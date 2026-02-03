import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
@Component({
    selector: 'app-empty',
    standalone: true,
    templateUrl: "./empty.html",
    imports:[FormsModule,RouterModule,ButtonModule,CheckboxModule,InputTextModule,PasswordModule,RippleModule,AppFloatingConfigurator]
})
export class Empty {
    idRelation:Number=0;
    idCompte:number=0;
}
