import { filter } from 'rxjs/operators';
import { AnyClient, ClientPersonneMorale } from './../../../model/client';
import { ClientService } from './../../service/client-service.service';
import { Actionneur } from './../../../model/actionneur';
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
import { timeout, timer } from 'rxjs';

@Component({
  selector: 'app-actionneurs',
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
    DatePickerModule
  ],
  templateUrl: './actionneurs.component.html',
  styleUrl: './actionneurs.component.scss',
  providers: [ClientService, ConfirmationService, MessageService]
})
export class ActionneursComponent implements OnChanges {
  constructor(
    private messageService: MessageService,
    private clientService: ClientService,
    private confirmationService: ConfirmationService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.actionneurs.set(this.recievedActList)
  }

  clt: ClientPersonneMorale = {} as ClientPersonneMorale;
  @Input() recievedActList: Actionneur[] = [];
  actionneurs = signal<Actionneur[]>([]);
  actionneur !: Actionneur;
  actionneurDialog: boolean = false;
  selectedActionneurs: Actionneur[] = [];
  submitted: boolean = false;
  cols: String[] = [];
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
      governorates: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba']
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

  setActionneurs(actionneurs: Actionneur[]) {
    this.recievedActList = actionneurs;
  }
  getActionneurs(): Actionneur[] | void {
    if (this.recievedActList) return this.recievedActList;
  }
  editActionneur(act: Actionneur) {
    this.actionneur = { ...act };
    this.actionneurDialog = true;
  }

  deleteActionneur(act: Actionneur) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + act.cin + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.actionneurs.set(this.actionneurs().filter((val) => val.cin !== act.cin));
        this.actionneur = {} as Actionneur;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Actionneur Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.actionneurDialog = false;
    this.submitted = false;
  }

  saveActionneur() {
    this.submitted = true;
    let _acts = this.actionneurs();

    if (this.actionneur.nom?.trim()) {
      const index = this.findIndexByCin(this.actionneur.cin);

      if (index !== -1) {
        _acts[index] = { ...this.actionneur };
        _acts[index].dateDeNaissance = this.formatDateToString(this.actionneur.dateDeNaissance);
        this.actionneurs.set([..._acts]);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Actionneur mis à jour',
          life: 3000
        });
      } else {
        this.actionneur.cin = this.actionneur.cin || this.createCin();
        this.actionneur.dateDeNaissance = this.formatDateToString(this.actionneur.dateDeNaissance);

        this.recievedActList = [..._acts, { ...this.actionneur }];
        this.actionneurs.set(this.recievedActList);
      }

      this.actionneurDialog = false;
      this.actionneur = {} as Actionneur;
    }
  }

  private formatDateToString(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  findIndexByCin(cin: string): number {
    let index = -1;
    for (let i = 0; i < this.recievedActList.length; i++) {
      if (this.recievedActList[i].cin === cin) {
        index = i;
        break;
      }
    }
    return index;
  }

  createCin(): string {
    let cin = '';
    const chars = '0123456789';
    for (let i = 0; i < 5; i++) {
      cin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return cin;
  }

  openNew() {
    this.actionneur = {} as Actionneur;
    this.submitted = false;
    this.actionneurDialog = true;
  }

  deleteSelectedActionneurs() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected actionneurs?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.actionneurs.set(
          this.actionneurs().filter((val) => !this.selectedActionneurs?.includes(val))
        );
        this.selectedActionneurs = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Actionneurs Deleted',
          life: 3000
        });
      }
    });
  }
}
