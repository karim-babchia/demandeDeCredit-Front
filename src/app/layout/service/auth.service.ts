import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AgentService } from './agent.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  constructor(
    private router: Router,
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (!this.isLoggedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
  private key = 'isLoggedIn';

  login() {
    localStorage.setItem(this.key, 'true');
  }

  logout() {
    localStorage.removeItem(this.key);
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.key) === 'true';
  }
}
