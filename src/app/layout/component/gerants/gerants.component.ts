import { Gerant } from '../../../model/gerant';
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

@Component({
  selector: 'app-gerants',
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
  templateUrl: './gerants.component.html',
  styleUrl: './gerants.component.scss',
  providers: [MessageService, ProductService, ConfirmationService]
})
export class GerantsComponent implements OnChanges {
  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.gerants.set(this.recievedGrtList)

  }
  gerants = signal<Gerant[]>([]);
  @Input() recievedGrtList: Gerant[] = [];
  gerant !: Gerant;
  gerantDialog: boolean = false;
  selectedGerants: Gerant[] = [];
  submitted: boolean = false;
  cols: String[] = [];


  editGerant(gerant: Gerant) {
    this.gerant = { ...gerant };
    this.gerantDialog = true;
  }

  deleteGerant(gerant: Gerant) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + gerant.nom + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gerants.set(this.gerants().filter(val => val.id !== gerant.id));
        this.gerant = {} as Gerant;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Gérant supprimé',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.gerantDialog = false;
    this.submitted = false;
  }

 saveGerant() {
  this.submitted = true;
  let _gerants = this.gerants();

  if (this.gerant.nom?.trim()) {
    // Format date
    this.gerant.dateNomination = this.formatDateToString(this.gerant.dateNomination);

    const index = this.findIndexById(this.gerant.id || 0);

    if (index !== -1) {
      _gerants[index] = { ...this.gerant };
      this.gerants.set([..._gerants]);

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Gérant mis à jour',
        life: 3000
      });
    } else {
      this.gerant.id = this.gerant.id || this.generateId()+900000;
      this.recievedGrtList = [..._gerants, { ...this.gerant }];
      this.gerants.set(this.recievedGrtList);
    }

    this.gerantDialog = false;
    this.gerant = {} as Gerant;
  }
}


  findIndexById(id: number): number {
    return this.recievedGrtList.findIndex(g => g.id === id);
  }

  generateId(): number {
    let cin = '';
    const chars = '0123456789';
    for (let i = 0; i < 5; i++) {
      cin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return Number(cin);
  }

  openNew() {
    this.gerant = {} as Gerant;
    this.submitted = false;
    this.gerantDialog = true;
  }

  deleteSelectedGerants() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected gérants?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gerants.set(
          this.gerants().filter(val => !this.selectedGerants?.includes(val))
        );
        this.selectedGerants = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Gérants supprimés',
          life: 3000
        });
      }
    });
  }
  private formatDateToString(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

}
