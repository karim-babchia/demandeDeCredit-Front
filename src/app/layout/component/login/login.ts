import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AgentService } from '../../service/agent.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LayoutService } from '../../service/layout.service';
import { AuthService } from '../../service/auth.service';


export interface layoutConfig {
    preset?: string;
    primary?: string;
    surface?: string | undefined | null;
    darkTheme?: boolean;
    menuMode?: string;
}



@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ToastModule],
    templateUrl: './login.html',
    providers: [MessageService, AgentService]
})
export class Login {
    config: layoutConfig = {
        preset: 'Nora',
        primary: 'orange',
        surface: null,
        darkTheme: false,
        menuMode: 'overlay'
    };
    constructor(private agentService: AgentService,
        private authService : AuthService,
        private messageService: MessageService,
        private router: Router
    ) { }
    email: string = '';

    password: string = '';

    checked: boolean = false;
    setAgent() {
        if (!this.email || this.email.trim() === '') {
            console.warn('Email is empty!');
            return;
        }

        this.agentService.getAgentByUsername(this.email.trim()).subscribe({
            next: (agent) => {
                localStorage.setItem('agent', JSON.stringify(agent));
                this.authService.login();
                this.router.navigate([`/${agent.username}/dashboard`], { queryParams: { dash: true } }).then(() => {
                    location.reload();
                })
            },
            error: (error) => {
                if (error.status === 404) {
                    console.log("404");

                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Agent Not Found',
                        detail: 'No agent found with this email.'
                    });
                } else {
                    console.error('Error setting agent:', error);
                }
            }
        });
    }


}
