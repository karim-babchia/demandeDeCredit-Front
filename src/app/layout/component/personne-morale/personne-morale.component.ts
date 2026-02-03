import { ConfirmationService, MessageService } from 'primeng/api';
import { LigneCredit } from './../../../model/ligne-credit';
import { AnyClient, ClientPersonneMorale, ClientPersonnePhysique } from './../../../model/client';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { Component, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { CommonModule, Location } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { Actionneur } from '../../../model/actionneur';
import { Gerant } from '../../../model/gerant';
import { CalendarModule } from 'primeng/calendar';
import { ActionneursComponent } from "../actionneurs/actionneurs.component";
import { GerantsComponent } from '../gerants/gerants.component';
import { LigneCreditComponent } from "../ligne-credit/ligne-credit.component";
import { ClientService } from '../../service/client-service.service';
import { DossierCredit } from '../../../model/dossier-credit';
import { Compte } from '../../../model/compte';
import { CompteService } from '../../service/compte-service.service';
import { Doc } from '../../../model/doc';
import { AgentService } from '../../service/agent.service';
import { Agent } from '../../../model/agent';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-personne-morale',
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
    SelectModule,
    PanelModule,
    TableModule,
    CalendarModule,
    ActionneursComponent,
    DatePickerModule,
    GerantsComponent, LigneCreditComponent,
    InputTextModule,
    ToastModule,
    ConfirmDialog
  ],
  templateUrl: './personne-morale.component.html',
  styleUrl: './personne-morale.component.scss',
  standalone: true,
  providers: [ClientService,ConfirmationService]
})
export class PersonneMoraleComponent implements OnInit {
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
  }source: string|null=null;
  consulter:boolean=true;
  valider:boolean=true;
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
  enregistrer(v: boolean) {
    localStorage.getItem('agent');
    if (!this.actionneursComponent) {
      console.warn('actionneursComponent not yet loaded');
      return;
    }
    this.clt.actionneurs = this.actionneursComponent.actionneurs();
    this.clt.gerants = this.gerantsComponent.gerants();
    this.clt.dateVisite = this.dateVisite.toISOString().split('T')[0];
    this.dossier.modifiePar = JSON.parse(localStorage.getItem('agent') || '{}').username;
    for (var c of this.clt.comptes) {
      if (c.id === this.compte.id) {
        if(v){
          this.validate();
        }
        this.dossier.dateModification == "" ? this.dossier.dateModification = new Date().toISOString() : this.dossier.dateModification;
        this.dateModification = new Date(this.dossier.dateModification) || new Date();
        c.dc = { ...this.dossier };
        c.dc.dateModification = new Date().toISOString().split('T')[0];
        c.dc.dateCreation = this.dateCreation.toISOString().split('T')[0];
        c.dc.lignesCredit = this.ligneCreditComponent.products();
        for (let ligne of c.dc.lignesCredit) {
          delete ligne.dossier;
          if (ligne.id && ligne.id > 900000) {
            delete ligne.id;
          }
        }
        delete c.client;
      }
    }
    for (let g of this.clt.gerants) {
      if (g.id && g.id > 900000) {
        delete g.id
      }
    }

    console.log(this.clt);
    this.clientService.updateClient(this.clt).subscribe({
      next: (response) => {

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
      error: (error) => {
        console.error('Erreur lors de la mise à jour du client:', error);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la mise à jour du client' });
      }
    }
    );



  }
  activeFieldset: number = 1;  // default to first fieldset

  selectFieldset(num: number) {
    this.activeFieldset = num;
  }
  @ViewChild('actionneursComponent') actionneursComponent!: ActionneursComponent;
  @ViewChild('gerantsComponent') gerantsComponent!: GerantsComponent;
  @ViewChild('ligneCreditComponent') ligneCreditComponent!: LigneCreditComponent;
  secteursActivite: any[] | undefined;
  dateVisite: Date = new Date();
  dateCreation: Date = new Date();
  dateModification: Date = {} as Date;
  constructor(
    private location : Location,
    private messageService: MessageService,
    private router: Router,
    private clientService: ClientService,
    private compteService: CompteService,
    private route: ActivatedRoute,
    private confirmationService : ConfirmationService
  ) { }
  ;

  goBack(){
    this.location.back();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.source = params['source'] || 'default';
    });
    switch (this.source) {
      case "consulter":
        this.valider = true;
        this.consulter = true;
        break;
      case "ajouter":
        this.valider = false;
        this.consulter = false
        break;
      case "valider":
        this.valider = false
        this.consulter = false
        break;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id !== null && !isNaN(id)) {
      this.compteService.getCompte(id).subscribe(compte => {
        this.compte = { ...compte };
        this.dateCreation = new Date(this.compte.dateOuverture);

      });

      this.clientService.getClientByCompteId(id).subscribe(client => {
        if ('acronyme' in client) {
          this.clt = client as ClientPersonneMorale;
          this.dossier = this.compte.dc || {
            status: "elaboration",
            agence: "010",
            modifiePar: "",
            creePar: "client1",
            assigneA: "analyste1",
            dateCreation: (new Date()).toISOString(),
            dateModification: "",
            marche: "063",
            lignesCredit: []
          };
          console.log("dossier", this.dossier);

          this.dossier.status = this.compte.dc?.status || "elaboration"
          this.selectedCountry = this.clt.pay;
          this.selectedGovernorate = this.clt.gouvernorat;
          this.visite.dateVisite = new Date(this.clt.dateVisite).toISOString().split('T')[0];
          this.dateVisite = new Date(this.visite.dateVisite);

          this.visite.visitePar = this.clt.visitePar;
          this.visite.personnesContactees = this.clt.personnesContactees;
          this.grtList = this.clt.gerants;
          this.actList = this.clt.actionneurs;
          this.ligList = this.compte.dc?.lignesCredit || [];
          const agent = localStorage.getItem('agent');
          if (agent) {
            const agentData: Agent = JSON.parse(agent);
            this.dossier.creePar = agentData.username;
          }
        } else {
          console.warn('Client is not a PersonneMorale');
        }
      });
    }
  }


  grtList: Gerant[] = [];
  actList: Actionneur[] = [];
  ligList: LigneCredit[] = [];
  client: AnyClient = {} as AnyClient;
  clt: ClientPersonneMorale = {} as ClientPersonneMorale;
  dossier: DossierCredit = {
    marche: "",
    assigneA: "",
    status: "elaboration",
    dateCreation: (new Date()).toISOString(),
    creePar: "",
    dateModification: "",
    modifiePar: "",
    agence: "",
    lignesCredit: []
  }
  compte: Compte = {} as Compte;
  id: number | null = null;
  visite = {
    dateVisite: "",
    visitePar: "",
    personnesContactees: ""
  };
  gerants: Gerant[] = [];
  countries = [
    {
      name: 'Tunisia', code: 'TN',
      governorates: ['Tunis', 'Sfax', 'Sousse', 'Ariana', 'Ben Arous']
    },
    {
      name: 'United States', code: 'US',
      governorates: ['California', 'Texas', 'New York', 'Florida', 'Illinois']
    },
    {
      name: 'Canada', code: 'CA',
      governorates: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Man itoba']
    },
    {
      name: 'United Kingdom', code: 'GB',
      governorates: ['England', 'Scotland', 'Wales', 'Northern Ireland']
    },
    {
      name: 'Germany', code: 'DE',
      governorates: ['Bavaria', 'Berlin', 'Hesse', 'Saxony', 'North Rhine-Westphalia']
    },
    {
      name: 'France', code: 'FR',
      governorates: ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Nouvelle-Aquitaine', 'Occitanie', 'Grand Est']
    },
    {
      name: 'Italy', code: 'IT',
      governorates: ['Lombardy', 'Lazio', 'Sicily', 'Veneto', 'Tuscany']
    },
    {
      name: 'Spain', code: 'ES',
      governorates: ['Catalonia', 'Madrid', 'Andalusia', 'Valencia', 'Galicia']
    },
    {
      name: 'Australia', code: 'AU',
      governorates: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia']
    },
    {
      name: 'Brazil', code: 'BR',
      governorates: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná']
    },
    {
      name: 'India', code: 'IN',
      governorates: ['Maharashtra', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'West Bengal']
    },
    {
      name: 'China', code: 'CN',
      governorates: ['Beijing', 'Shanghai', 'Guangdong', 'Sichuan', 'Zhejiang']
    },
    {
      name: 'Japan', code: 'JP',
      governorates: ['Tokyo', 'Osaka', 'Hokkaido', 'Fukuoka', 'Aichi']
    },
    {
      name: 'Mexico', code: 'MX',
      governorates: ['Mexico City', 'Jalisco', 'Nuevo León', 'Puebla', 'Chihuahua']
    },
    {
      name: 'Russia', code: 'RU',
      governorates: ['Moscow', 'Saint Petersburg', 'Krasnodar', 'Novosibirsk', 'Tatarstan']
    },
    {
      name: 'South Africa', code: 'ZA',
      governorates: ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Limpopo']
    },
    {
      name: 'South Korea', code: 'KR',
      governorates: ['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju']
    },
    {
      name: 'Sweden', code: 'SE',
      governorates: ['Stockholm', 'Skåne', 'Västra Götaland', 'Uppsala', 'Östergötland']
    },
    {
      name: 'Switzerland', code: 'CH',
      governorates: ['Zurich', 'Geneva', 'Vaud', 'Bern', 'Lucerne']
    },
    {
      name: 'Turkey', code: 'TR',
      governorates: ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa']
    }
  ];
  selectedCountry: String = "";
  governorates: string[] = [];
  selectedGovernorate: string = '';
  employeur: String = "";
  employeurs: String[] = [];
  contrat: String = "";
  contrats: String[] = [];
  situationF: String = "";
  situationsF: String[] = [];
  sexe: String = "";
  sexes: String[] = [];
  document: Doc = {} as Doc;
  documents: Doc[] = [];
  activite: String = "";
  onPayChange(selected: any) {
    this.governorates = selected?.governorates;
    this.selectedGovernorate = '';
  }
  public isPersonnePhysique(client: AnyClient): client is ClientPersonnePhysique {
    return (client as ClientPersonnePhysique)?.nom !== undefined;
  }

  public isPersonneMorale(client: AnyClient): client is ClientPersonneMorale {
    return client.type == "M";
  }

  public getCompte(id: number): Compte {
    let compte: Compte = {} as Compte;
    this.compteService.getCompte(id).subscribe(
      (response: Compte) => {
        compte = response;
      }
    );
    return compte;
  }

  setClient(client: AnyClient) {
    if ("raison" in client) {
      this.clt = client;
    }
  }
}
