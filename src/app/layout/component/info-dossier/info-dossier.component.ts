import { Dashboard } from './../../../pages/dashboard/dashboard';
import { Agent } from './../../../model/agent';
import { filter, timeInterval } from 'rxjs/operators';
import { Documentation } from './../../../pages/documentation/documentation';
import { Observable } from 'rxjs';
import { AnyClient, Client, ClientPersonnePhysique } from './../../../model/client';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule, DropdownItem } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { ClientService } from '../../service/client-service.service';
import { CompteService } from '../../service/compte-service.service';
import { Compte } from '../../../model/compte';
import { DossierCredit } from '../../../model/dossier-credit';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { Doc } from '../../../model/doc';
import { AgentService } from '../../service/agent.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LigneCreditComponent } from '../ligne-credit/ligne-credit.component';
import { LigneCredit } from '../../../model/ligne-credit';
import { ConfirmDialog } from "primeng/confirmdialog";


@Component({
  selector: 'app-info-dossier',
  imports: [ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    DropdownModule,
    CommonModule,
    SelectModule,
    TextareaModule,
    FluidModule,
    DatePickerModule,
    ToastModule,
    LigneCreditComponent, ConfirmDialog],
  templateUrl: './info-dossier.component.html',
  styleUrl: './info-dossier.component.scss',
  standalone: true,
  providers:[ConfirmationService]
})
export class InfoDossierComponent implements OnInit {
goBack() {
  this.location.back();
}
  updateDocument(arg0: any) {

    this.document.num = this.documents.filter((d) => d.id === arg0)[0].num;
    this.document.date = this.documents.filter((d) => d.id === arg0)[0].date;
  }
  booleanValider(): boolean {
    let role = ""
    const status = this.dossier.status?.toUpperCase();
    const agent = localStorage.getItem('agent');
    if (agent) {
      const agentData: Agent = JSON.parse(agent);
      role = agentData.role;
    }


    if (!status || !role) return true;

    return !(
      (status === 'ELABORATION' && role === 'CHARGE_CLIENT') ||
      (status === 'VALIDATION' && role === 'ANALYST-GGR') ||
      (status === 'ANALYSE GGR' && role === 'RESPONSABLE-GGR')
    );
  }

  constructor(
    private location : Location,
    private messageService: MessageService,
    private agentService: AgentService,
    private clientService: ClientService,
    private confirmationService: ConfirmationService,
    private compteService: CompteService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.getInitialData();
    this.route.queryParams.subscribe(params => {
      this.source = params['source'] || 'default';
      this.dashboard = params['dash'] || false;
    });
    switch (this.source) {
      case "consulter":
        this.valider = true;
        this.consulter = true;
        break;
      case "ajouter":
        this.valider = true;
        this.consulter = false
        break;
      case "valider":
        this.valider = false
        this.consulter = false
        break;
    }
  }

  accepter() {
    this.confirmationService.confirm({
      message: 'Souhaitez-vous accepter ou rejeter cette demande ?',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Accepter',
      rejectLabel: 'Rejeter',
      accept: () => {
        this.dossier.status="ACCEPTEE";
        this.enregistrer(true)
      },
      reject: () => {
        this.dossier.status="REJETEE";
        this.enregistrer(true)
      }
    });
  }


  public enregistrer(v: boolean) {
    this.dossier.dateCreation = new Date().toISOString()
    this.dossier.dateModification = this.dossier.dateCreation
    const agent = localStorage.getItem('agent');
    if (agent) {
      const agentData: Agent = JSON.parse(agent);
      this.dossier.modifiePar = agentData.username
    }
    this.compte.dc = { ...this.dossier }
    this.compte.dc.id = null;
    delete this.compte.dc.compte;
    if (this.compte.dc.id == null) {
      delete this.compte.dc.id;
    }
    this.dossier.lignesCredit = this.ligneCreditComponent.products();
    for (let l of this.dossier.lignesCredit) {
      if (l.id && l.id > 900000) {
        delete l.id
      }
      delete l.dossier
    }
    for (let c of this.client.comptes) {
      if (c.id == this.compte.id) {
        delete this.dossier.compte
        if (!this.dossier.id) {
          delete this.dossier.id
        }
        if (v) {
          this.validate()
        }
        c.dc = { ...this.dossier }
        delete c.client
      }
    }

    this.clientService.updateClient(this.client).subscribe({
      next: () => {
        const agent = localStorage.getItem('agent');
        if (agent) {
          const agentData: Agent = JSON.parse(agent);
          this.router.navigate(['/', agentData.username, 'recherche']).then(() => {
            setTimeout(() => {
              if (this.dossier.status == "ACCEPTEE") {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Succès',
                  detail:'Demande Acceptée'
                })
              }else {
                if (this.dossier.status == "REJETEE") {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail:'Demande Acceptée'
              });
                } else {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: v ? 'Dossier validé et Client mis à jour avec succès' : 'Dossier ajouté et Client mis à jour avec succès'
                  });
                }

              }
            }, 100);
          });
        }
      },
    });
  }

  getInitialData() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id !== null && !isNaN(id)) {
      this.compteService.getCompte(id).subscribe(compte => {
        this.compte = compte;
        if (this.compte.dc?.id != null) {
          this.consulter
        }
      });

      this.clientService.getClientByCompteId(id).subscribe(client => {
        this.client = client;


        if ('nom' in client) {
          this.employeur = client.typeEmployeur || '';
          this.contrat = client.typeContrat || '';
          this.documents = this.compte.documents;
          const agent = localStorage.getItem('agent');
          if (agent) {
            const agentData: Agent = JSON.parse(agent);
            this.dossier.creePar = agentData.username;
          }

          this.clt = client as ClientPersonnePhysique;
          if (this.compte.dc !== undefined && this.compte.dc !== null) {
            this.dossier = { ...this.compte.dc };
            this.ligList = this.compte.dc.lignesCredit;
            console.log(this.ligList);

          }
        } else {
          console.warn("client non trouvé");

        }
      });
    }

  }
  @ViewChild('ligneCreditComponent') ligneCreditComponent!: LigneCreditComponent;
  consulter: boolean = false;
  valider: boolean = false;
  dateC: Date = new Date();
  dossier: DossierCredit = {
    status: "élaboration",
    agence: "010",
    modifiePar: "",
    creePar: "client1",
    assigneA: "analyste1",
    dateCreation: new Date().toISOString().split('T')[0],
    dateModification: new Date().toISOString().split('T')[0],
    marche: "063",
    lignesCredit: [],
  };
  document: Doc = {
    id: 0,
    type: '',
    date: '',
    compte: {} as Compte,
    num: ''
  };

  public validate() {
    console.log(this.dossier.status.toLocaleUpperCase());

    switch (this.dossier.status.toUpperCase()) {
      case "ÉLABORATION":
        this.dossier.assigneA = "analyste1"
        this.dossier.status = "VALIDATION";
        break;
      case "ELABORATION":
        this.dossier.assigneA = "analyste1"
        this.dossier.status = "VALIDATION";
        break;
      case "VALIDATION":
        this.dossier.assigneA = "boss1"
        this.dossier.status = "ANALYSE GGR";
        break;
      case "ANALYSE GGR":
        console.log("accepter ou rejeter");
        break;
    }
  }

  selectFieldset(num: number) {
    this.activeFieldset = num;
  }
  dashboard: boolean = false
  source: string | null = null;
  ligList: LigneCredit[] = [];
  activeFieldset = 1;
  employeur: String = "";
  employeurs: String[] = ["PME", "Grande Entreprise", "Administration Publique", "ONG", "Autre"];
  contrat: String = "";
  contrats: String[] = ["CDI", "CDD", "Intérim", "Freelance"];
  situationF: String = "";
  situationsF: String[] = ["Marié(e)", "Célibataire", "Divorcé(e)", "Veuf(ve)"];
  sexe: String = "";
  sexes: String[] = ["Homme", "Femme"];
  documents: Doc[] = [];
  client: AnyClient = {} as AnyClient;
  clt: ClientPersonnePhysique = {} as ClientPersonnePhysique;
  compte: Compte = {} as Compte;
  public isClientPersonnePhysique(client: AnyClient): client is ClientPersonnePhysique {
    return (client as ClientPersonnePhysique).nom !== undefined;
  }

}
