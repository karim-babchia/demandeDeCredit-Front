import { DossierCredit } from './../../../model/dossier-credit';
import { ClientService } from './../../service/client-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LigneCredit } from '../../../model/ligne-credit';
import { Component, Input, OnChanges, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
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
import { ProductService } from '../../../pages/service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-ligne-credit',
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
    CalendarModule,
    DatePickerModule,
    DropdownModule
  ],
  templateUrl: './ligne-credit.component.html',
  styleUrl: './ligne-credit.component.scss',
  providers: [MessageService, ProductService, ConfirmationService]
})
export class LigneCreditComponent implements OnChanges,OnInit {
  constructor(
    private ClientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route : ActivatedRoute
  ) { }
  ngOnInit(): void {
    let source=""
    this.route.queryParams.subscribe(params => {
      source = params['source'] || 'default';
    });
    if (source =="consulter"){
      this.consult=true
      console.log("source ::::",source);
      
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.products.set(this.recievedLigList);
  }

  consult :boolean =false 
  @Input() recievedLigList: LigneCredit[] = [];
  products = signal<LigneCredit[]>([]);
  ligneCredit !: LigneCredit;
  ligneCreditDialog: boolean = false;
  selectedLignes: LigneCredit[] = [];
  submitted: boolean = false;
  cols: String[] = [];
  famillesCredit = ["crédits au particuliérs", "crédits de gestion", "crédits d'investissement", "crédits de consolidation"];
  naturesCredit = ["Autorisation sur compte", "crédit immobiliér", "crédit à la consommation"];
  typesCredit = ["Autorisation sur compte", "Autorisation sur dossier exclusive"];
  typestaux = ["LIBOR-", "LIBOR+", "TMM-", "TMM+", "SOFR"];
  openNew() {
    this.ligneCredit = {} as LigneCredit;
    this.submitted = false;
    this.ligneCreditDialog = true;
  }

  deleteSelectedLignes() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => !this.selectedLignes?.includes(val)));
        this.selectedLignes = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  public getLignes(): LigneCredit[] {
    return this.recievedLigList;
  }
  editLigneCredit(lc: LigneCredit) {
    this.ligneCredit = { ...lc };
    this.ligneCreditDialog = true;
  }
  deleteLigneCredit(product: LigneCredit) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => val.id !== product.id));
        this.ligneCredit = {} as LigneCredit;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }
  hideDialog() {
    this.ligneCreditDialog = false;
    this.submitted = false;
  }
  saveLigneCredit() {
    this.submitted = true;
    let _lignes = this.products();

    if (this.ligneCredit.famille?.trim()) {
      if (this.ligneCredit.id) {
        const index = this.findIndexById(this.ligneCredit.id);
        if (index !== -1) {
          _lignes[index] = { ...this.ligneCredit };
          this.products.set([..._lignes]);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Ligne crédit mise à jour',
            life: 3000
          });
        }
      } else {
        this.ligneCredit.id = Number(this.createId())+900000;
        console.log("id = ",this.ligneCredit.id);
        

        if (!this.ligneCredit.dossier) {
          this.ligneCredit.dossier = {} as DossierCredit; // or fetch/set appropriately
        }
        this.ligneCredit.dateEcheance = new Date(this.ligneCredit.dateEcheance).toISOString().split('T')[0];

        this.recievedLigList = [..._lignes, { ...this.ligneCredit }];
        this.products.set(this.recievedLigList);
      }
      console.log(this.products());

      this.ligneCreditDialog = false;
      this.ligneCredit = {} as LigneCredit;
    }
  }
  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.recievedLigList.length; i++) {
      if (this.recievedLigList[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  isAlphabet(str: string): boolean {
    return /^[A-Za-z]+$/.test(str);
  }

  createId(): string {
    let id = '';
    var chars = '1234567890';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
