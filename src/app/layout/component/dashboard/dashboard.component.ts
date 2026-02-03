import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { StatsWidget } from '../../../pages/dashboard/components/statswidget';
import { RecentSalesWidget } from '../../../pages/dashboard/components/recentsaleswidget';
import { BestSellingWidget } from '../../../pages/dashboard/components/bestsellingwidget';
import { RevenueStreamWidget } from '../../../pages/dashboard/components/revenuestreamwidget';
import { NotificationsWidget } from '../../../pages/dashboard/components/notificationswidget';
import { DossierCredit } from '../../../model/dossier-credit';
import { AnyClient } from '../../../model/client';
import { Compte } from '../../../model/compte';
import { Agent } from '../../../model/agent';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { AgentService } from '../../service/agent.service';
import { ClientService } from '../../service/client-service.service';
import { CompteService } from '../../service/compte-service.service';
import { DemandeService } from '../../service/demande-service.service';
import { InfoDossierComponent } from "../info-dossier/info-dossier.component";
import { ConsultComponent } from '../consult/consult.component';
import { StatusComponent } from "../status/status.component";
import { LigneCreditTypeComponent } from "../ligne-credit-type/ligne-credit-type.component";
import { ChatComponent } from "../chat/chat.component";
import { StatsComponent } from "../stats/stats.component";

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
  selector: 'app-dashboard',
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
    StatusComponent,
    LigneCreditTypeComponent,
    ConsultComponent,
    StatusComponent,
    StatsComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  providers: [ConfirmationService, MessageService]
})
export class DashboardComponent implements OnInit {
  admin : boolean=false;
  ngOnInit(): void {
    const agent = localStorage.getItem('agent');
    var role: string = "";
    if (agent) {
      const agentData: Agent = JSON.parse(agent);
      role = agentData.role;
    }
    if(role=="admin"){
      this.admin=true;
    }

  }

}
