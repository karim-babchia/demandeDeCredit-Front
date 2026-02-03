import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeService } from '../../service/demande-service.service';
import { CompteService } from '../../service/compte-service.service';
import { LigneCreditService } from '../../service/ligne-credit.service';

@Component({
  standalone: true,
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl:"./stats.Component.html"
})
export class StatsComponent implements OnInit {
  nbrDemandes: number = 0;
  nbrDemandesLastMonth : number = 0;
  nbrComptes : number=0;
  nbrComptesLastMonth : number = 0;
  sumTND : number = 0;
  sumUSD : number = 0;
  constructor(
    private demandeService: DemandeService,
    private compteService : CompteService,
    private ligneCreditService : LigneCreditService,
  ) { }
  ngOnInit(): void {
    this.demandeService.getCount().subscribe((nbr:number) => {
      this.nbrDemandes = nbr;
    });
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const year = lastMonth.getFullYear();
    const month = (lastMonth.getMonth() + 1).toString().padStart(2, '0');
    const day = lastMonth.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    this.demandeService.getCountLastMonth(formattedDate).subscribe((nbr:number)=>{
      this.nbrDemandesLastMonth = nbr ;
    })
    this.compteService.getCount().subscribe((nbr:number)=>{
      this.nbrComptes = nbr;
    })
    this.compteService.getCountLastMonth(formattedDate).subscribe((nbr:number)=>{
      this.nbrComptesLastMonth=nbr;
    })

    this.ligneCreditService.getSumByDevise("TND").subscribe((nbr:number)=>{
      this.sumTND=nbr;
    })

    this.ligneCreditService.getSumByDevise("USD").subscribe((nbr : number)=>{
      this.sumUSD=nbr;  
    })
  }

}
