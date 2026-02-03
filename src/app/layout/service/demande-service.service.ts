import { Injectable } from '@angular/core';
import { DossierCredit } from '../../model/dossier-credit';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DemandeService {
    private apiUrl = `${environment.apiUrl}/dossiers`; // ← Utilisation de l'URL de l'environnement

  constructor(private http: HttpClient) { }

  getAll(): Observable<DossierCredit[]> {
    return this.http.get<DossierCredit[]>(this.apiUrl);
  }

  getById(id: number): Observable<DossierCredit> {
    return this.http.get<DossierCredit>(`${this.apiUrl}/${id}`);
  }

  add(dossier: DossierCredit): Observable<string> {
    return this.http.post(this.apiUrl, dossier, { responseType: 'text' });
  }

  update(dossier: DossierCredit): Observable<string> {
    return this.http.put(this.apiUrl, dossier, { responseType: 'text' });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  getDossiersByAssigneA(username: string): Observable<DossierCredit[]> {
    return this.http.get<DossierCredit[]>(`${this.apiUrl}/assigneA/${username}`);
  }
  getDossiersByStatus(status: string): Observable<DossierCredit[]> {
    return this.http.get<DossierCredit[]>(`${this.apiUrl}/by-status/${status}`);
  }

  getCount():Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getCountLastMonth(date: string): Observable<number> {
    const params = new HttpParams().set('date', date);
    return this.http.get<number>(`${this.apiUrl}/count/lastMonth`, { params });
  }

}
