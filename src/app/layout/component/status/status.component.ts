import { DossierCredit } from './../../../model/dossier-credit';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DemandeService } from '../../service/demande-service.service';

@Component({
  selector: 'app-status',
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit {
  constructor(
    private demandeService: DemandeService,
  ) { }
  statusList = ['elaboration', 'validation', 'analyse ggr', 'acceptee', 'rejetee'];
  statusData: { [key: string]: DossierCredit[] } = {};
  statusPercentages: { [key: string]: number } = {};
  totalCount = 0;
  statusColors: { [key: string]: string } = {
    elaboration: 'bg-blue-500',
    validation: 'bg-yellow-500',
    'analyse ggr': 'bg-purple-500',
    acceptee: 'bg-green-500',
    rejetee: 'bg-red-500'
  };


  ngOnInit(): void {
    let loadedCount = 0;

    this.statusList.forEach(status => {
      this.demandeService.getDossiersByStatus(status).subscribe(data => {
        this.statusData[status] = data;
        
        loadedCount++;

        if (loadedCount === this.statusList.length) {
          this.calculatePercentages();
        }
      });
    });
  }

  calculatePercentages(): void {
    this.totalCount = Object.values(this.statusData)
      .reduce((sum, list) => sum + list.length, 0);

    this.statusList.forEach(status => {
      const count = this.statusData[status]?.length || 0;
      this.statusPercentages[status] = this.totalCount > 0
        ? Math.round((count / this.totalCount) * 100)
        : 0;
    });
  }
  menu = null;

  items = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
  ];
}
