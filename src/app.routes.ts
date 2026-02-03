    import { InfoDossierComponent } from './app/layout/component/info-dossier/info-dossier.component';
    import { Routes } from '@angular/router';
    import { AppLayout } from './app/layout/component/app.layout';
    import { Dashboard } from './app/pages/dashboard/dashboard';
    import { Documentation } from './app/pages/documentation/documentation';
    import { Landing } from './app/pages/landing/landing';
    import { Notfound } from './app/pages/notfound/notfound';
    import { RechercheComponent } from './app/layout/component/recherche/recherche.component';
    import { PersonneMoraleComponent } from './app/layout/component/personne-morale/personne-morale.component';
    import { LoginComponent } from './app/layout/component/login/login.component';
    import { Login } from './app/layout/component/login/login';
import { DashboardComponent } from './app/layout/component/dashboard/dashboard.component';
import { ConsultComponent } from './app/layout/component/consult/consult.component';
import { ChatComponent } from './app/layout/component/chat/chat.component';
import { AuthService } from './app/layout/service/auth.service';

    export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: Login },  // login inside layout at root path
      { path: ':username/dashboard', component: DashboardComponent ,canActivate:[AuthService]},
      { path: ':username/consult', component: ConsultComponent ,canActivate:[AuthService]},
      { path: ':username/recherche', component: RechercheComponent ,canActivate:[AuthService]},
      { path: ':username/pp/:id', component: InfoDossierComponent ,canActivate:[AuthService]},
      { path: ':username/pm/:id', component: PersonneMoraleComponent ,canActivate:[AuthService]},
      { path: ':username/bot', component: ChatComponent },
      {
        path: ':username/uikit',
        loadChildren: () => import('./app/pages/uikit/uikit.routes')
      }
    ]
  },
  { path: 'landing', component: Landing },
  { path: 'notfound', component: Notfound },
  { path: 'auth', loadChildren: () => import('./app/layout/component/login/auth.routes') },
  { path: '**', redirectTo: '/notfound' },
];
