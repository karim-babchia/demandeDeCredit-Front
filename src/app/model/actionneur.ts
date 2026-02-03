import { Client } from "./client";

export interface Actionneur {
    cin: string;
    nom: string;
    prenom: string;
    dateDeNaissance: string;
    nationalite: string;
    capital: number;
    client: Client;
}


