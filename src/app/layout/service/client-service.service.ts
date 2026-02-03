
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnyClient } from '../../model/client';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    private baseUrl = `${environment.apiUrl}/clients`; // ← Utilisation de l'URL de l'environnement

  constructor(private http:HttpClient) {}

  public getClients():Observable<AnyClient[]>{
    return this.http.get<AnyClient[]>(`${this.baseUrl}`)
  }

  public getClient(id: number):Observable<AnyClient>{
    return this.http.get<AnyClient>(`${this.baseUrl}/${id}`);
  }

  public addClient(client : AnyClient):Observable<AnyClient>{
    return this.http.post<AnyClient>(`${this.baseUrl}`,client);
  }

  public updateClient(client : AnyClient):Observable<AnyClient>{
    return this.http.put<AnyClient>(`${this.baseUrl}`,client);
  }

  public deleteClient(id:number):Observable<AnyClient>{
    return this.http.delete<AnyClient>(`${this.baseUrl}/${id}`);
  }

  public getClientByCompteId(id:number):Observable<AnyClient>{
    return this.http.get<AnyClient>(`${this.baseUrl}/comptes/${id}`);
  }





}
