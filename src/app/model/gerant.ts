import { Client } from "./client";


export interface Gerant {
  id?: number;
  nom: string;
  dateNomination: string; 
  tel: string;
  position :string;
  client?: Client;
}
