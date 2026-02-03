import { Client } from "./client";
import { Doc } from "./doc";
import { DossierCredit } from "./dossier-credit";

export interface Compte {
  id: number;
  dateOuverture: string;
  chapitre: string;
  documents: Doc[];
  client?: Client; 
  dc: DossierCredit|null;
}