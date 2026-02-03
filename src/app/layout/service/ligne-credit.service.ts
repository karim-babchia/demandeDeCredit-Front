import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LigneCredit } from '../../model/ligne-credit';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LigneCreditService {
    private apiUrl = `${environment.apiUrl}/lignes`; // ← Utilisation de l'URL de l'environnement
    constructor(private http: HttpClient) { }
  getGroupedByNature(famille: string): Observable<{ [nature: string]: LigneCredit[] }> {
    return this.http.get<{ [nature: string]: LigneCredit[] }>(
      `${this.apiUrl}/grouped/famille/${famille}`
    );
  }

  getSumByDevise(devise: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sum-by-devise`, {
      params: { devise }
    });
  }


}
