import { Agent } from './../../../model/agent';
import { CompteService } from './../../service/compte-service.service';
import { Client, AnyClient, ClientPersonnePhysique, ClientPersonneMorale } from './../../../model/client';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ClientService } from '../../service/client-service.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Compte } from '../../../model/compte';
import { AgentService } from '../../service/agent.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

type clientCompte = [AnyClient, Compte | null];

@Component({
  selector: 'app-recherche',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CheckboxModule,
    PasswordModule,
    RippleModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule
  ],
  templateUrl: './recherche.component.html',
  standalone: true,
})
export class RechercheComponent {
  compte: Compte | null = null;
  data: clientCompte[] = [];
  public clients: AnyClient[] = [];
  status: string = "";
  constructor(private clientService: ClientService,
    private compteService: CompteService,
    private router: Router,
    private messageService:MessageService,
    private route: ActivatedRoute,
  ) { };
  idRelation: number | null = null;
  idCompte: number | null = null;
  public getData(): void {
    this.data = [];
    this.clients = [];
    this.clientService.getClients().subscribe(
      (response: AnyClient[]) => {
        if (this.idCompte != null) {
          try {
            this.getCompte(this.idCompte);
          } catch (err) {
            console.error('compte non trouvé', err);
            return;
          }
          const clt = this.getClientByCompteId(this.idCompte);
          if (clt != null) {
            this.data.push([clt, this.compte]);
          }
          return;
        }
        if (this.idRelation == null) {
          this.clients == response;
        } else {
          const idRelationFilter = this.idRelation;
          this.clients = response.filter(clt => clt.idRelation == idRelationFilter);
        }
        for (const clt of this.clients) {
          for (const c of clt.comptes) {
            this.data.push([clt, c]);
          }
        }
      }
    )
  }
  public getClientByCompteId(id: number): AnyClient {
    this.clientService.getClientByCompteId(id).subscribe(
      (response: AnyClient) => {
        return response;
      }
    )
    return this.clients[0];
  }
  public getCompte(id: number): void {
    this.compteService.getCompte(id).subscribe(
      (response: Compte) => {
        this.compte = response;
      })
  }

  public isPersonnePhysique(client: AnyClient): client is ClientPersonnePhysique {
    return (client as ClientPersonnePhysique)?.nom !== undefined;
  }

  public isPersonneMorale(client: AnyClient): client is ClientPersonneMorale {
    return (client as ClientPersonneMorale)?.acronyme !== undefined;
  }

  chargeClient():boolean{
    const agent = localStorage.getItem('agent');
    var role: string = "";
    if (agent) {
      const agentData: Agent = JSON.parse(agent);
      role = agentData.role;
    }
    return role!="CHARGE_CLIENT"
  }

  public navigate(compte :Compte,client:AnyClient,source:string): void {
    const id = compte.id;
    console.log("Navigating to client with compte ID:", id);
    
    const personneMorale = this.isPersonneMorale(client);
    const agent = localStorage.getItem('agent');
    var username: string = "";
    if (agent) {
      const agentData: Agent = JSON.parse(agent);
      username = agentData.username;
    }
    if (username && id) {
      personneMorale ? this.router.navigate([`/${username}/pm`, id], { queryParams: { source } }) : this.router.navigate([`/${username}/pp`, id],{ queryParams: { source } });
    }
    else {
      console.warn("Impossible de naviguer, agent ou id non défini");
    }
  }

  public aUneCommande(client: any): boolean {
    for (const c of client.comptes) {
      if (c.dc != null) {
        this.status = c.dc.status;
        return true;
      }
    }
    return false;
  }

}
