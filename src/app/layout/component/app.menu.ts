import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    constructor(
        private route: ActivatedRoute,
    ) { }
    private username: string ="";
    model: MenuItem[] = [];

    ngOnInit() {
        const agentJson = localStorage.getItem('agent');
        const agent = agentJson ? JSON.parse(agentJson) : null;
        if(agent){
            this.username = agent.username;
        }
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [`/${this.username}/dashboard`], queryParams: { dash: true } }]
            },
            {
                label: 'Demandes de Crédit',
                items: [
                    { label: 'Ajouter une demande', icon: 'pi pi-fw pi-id-card', routerLink: [`/${this.username}/recherche`] },
                    { label: 'Liste des demandes', icon: 'pi pi-fw pi-check-square', routerLink: [`/${this.username}/consult`] },
                    { label: 'Bot de Credit', icon: 'pi pi-comments pi-check-square', routerLink: [`/${this.username}/bot`] },
                ]
            }];

    }
}
