import { Dashboard } from './../../../pages/dashboard/dashboard';
import { ClientService } from './../../service/client-service.service';
import { AnyClient } from './../../../model/client';
import { Agent } from './../../../model/agent';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DossierCredit } from './../../../model/dossier-credit';
import { Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DemandeService } from '../../service/demande-service.service';
import { AgentService } from '../../service/agent.service';
import { Client } from '../../../model/client';
import { CompteService } from '../../service/compte-service.service';
import { Compte } from '../../../model/compte';
import { Message, MessageModule } from "primeng/message";

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-consulter',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    ToastModule,
],
  templateUrl: './consult.component.html',
  providers: [MessageService, DemandeService, ConfirmationService]
})
export class ConsultComponent implements OnInit {
  dossierCreditDialog: boolean = false;

  dossierCredits = signal<DossierCredit[]>([]);

  dossierCredit!: DossierCredit;

  selectedDossierCredits!: DossierCredit[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private agentService: AgentService,
    private demandeService: DemandeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clientService: ClientService,
    private compteService: CompteService
  ) { }
 ngOnInit() {
    this.loadDemoData();
    this.route.queryParams.subscribe(params => {
      this.dashboard = params['dash'] || false;
      
    }); 
    if (!this.dashboard) {
      this.demandeService.getAll().subscribe((data) => {
        this.dossierCredits.set(data);
      });
    } else {
      const agent = localStorage.getItem('agent');
      var username: string = "";
      if (agent) {
        const agentData: Agent = JSON.parse(agent);
        username = agentData.username;
      }
      this.demandeService.getDossiersByAssigneA(username).subscribe((data) => {
        this.dossierCredits.set(data);
      });


      
    }


  }


  details(dc: DossierCredit): void {
    let source=""
    if (this.valider){
      
      source="valider"
    }else{
      source="consulter"
    }
    var id = 0;

    this.compteService.getCompteByDossierId(dc.id || 0).subscribe({
      next: (compte: Compte) => {
        id = compte.id;
        this.clientService.getClientByCompteId(id).subscribe({
          next: (client: AnyClient) => {
            const agent = localStorage.getItem("agent");
            if (agent) {
              const agentData: Agent = JSON.parse(agent);
              if ("prenom" in client) {
                this.router.navigate([`/${agentData.username}/pp`, id], { queryParams: { source } })
              }
              else {
                this.router.navigate([`/${agentData.username}/pm`, id], { queryParams: { source } })
              }
            }
          }

        })
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du client', err);
      }
    });
  }
  @Input() valider: boolean=false;
  dash:string|null=null;
  dashboard: boolean = false;
 

  loadDemoData() {

    this.statuses = [
      { label: 'ELABORATION', value: 'elaboration' },
      { label: 'VALIDATION', value: 'validation' },
      { label: 'GRR', value: 'grr' },
      { label: 'ACCEPTEE', value: 'acceptee' },
      { label: 'REJETEE', value: 'rejetee' }
    ];

    this.cols = [
      { field: 'Id', header: 'id' },
      { field: 'Nom du client', header: 'client' },
      { field: 'Crée par', header: 'creePar' },
      { field: 'Agence', header: 'agence' },
      { field: 'Status', header: 'status' },
      { field: 'Date de création', header: 'date' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.dossierCredit = {} as DossierCredit;
    this.submitted = false;
    this.dossierCreditDialog = true;
  }

  editDossierCredit(DossierCredit: DossierCredit) {
    this.dossierCredit = { ...DossierCredit };
    this.dossierCreditDialog = true;
  }

  deleteSelectedDossierCredits() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dossierCredits.set(this.dossierCredits().filter((val) => !this.selectedDossierCredits?.includes(val)));
        this.selectedDossierCredits = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Demande de credit supprimée',
          life: 3000
        });
      }
    });
  }

  public deleting(dc:DossierCredit){
    const agent = localStorage.getItem('agent');
      var username: string = "";
      if (agent) {
        const agentData: Agent = JSON.parse(agent);
        username = agentData.username;
      }
    return username!=dc.assigneA;
  }

  hideDialog() {
    this.dossierCreditDialog = false;
    this.submitted = false;
  }

  deleteDossierCredit(DossierCredit: DossierCredit) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ' + DossierCredit.id + '?',
      header: 'Confirmer',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dossierCredits.set(this.dossierCredits().filter((val) => val.id !== DossierCredit.id));
        this.demandeService.delete(DossierCredit.id || 0).subscribe(
          {
            next: () => {
              this.dossierCredit = {} as DossierCredit;
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Demande de credit supprimée',
                life: 3000
              });

            }
          }
        )

      }
    });
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.dossierCredits().length; i++) {
      if (this.dossierCredits()[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status.toUpperCase()) {
      case 'ELABORATION':
        return 'secondary';

      case 'VALIDATION':
        return 'warn';

      case 'GRR':
        return 'info';

      case 'ACCEPTEE':
        return 'success';

      case 'REJETEE':
        return 'danger';

      default:
        return 'secondary';
    }
  }

}
