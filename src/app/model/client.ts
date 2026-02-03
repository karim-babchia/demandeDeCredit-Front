import { Actionneur } from "./actionneur";
import { Compte } from "./compte";
import { DossierCredit } from "./dossier-credit";
import { Gerant } from "./gerant";

export interface Client {
    idRelation: number;
    pay: string;
    gouvernorat: string;
    adresse: string;
    infoComplementaires: string;
    comptes: Compte[];
    type:string;
}

export interface ClientPersonnePhysique extends Client {
    nom: string;
    prenom: string;
    sexe: string;
    situationFamiliale: string;
    dateDeNaissance: string;
    typeContrat: string;
    typeEmployeur: string;
    profession: string;
}

export interface ClientPersonneMorale extends Client {
  acronyme: string;
  raison:string;
  formeJuridique: string;
  groupe: string;
  capitalSocial: number;
  matriculeFiscale: string;
  nbrEmployes: number;
  secteurActivite: string;
  dateVisite: string;
  visitePar: string;
  personnesContactees: string;
  gerants: Gerant[];
  actionneurs: Actionneur[];
}

export type AnyClient = ClientPersonneMorale|ClientPersonnePhysique;


