import { Client } from "./client";
import { Compte } from "./compte";
import { LigneCredit } from "./ligne-credit";

export interface DossierCredit {
  id?: number|null;
  status: string;
  agence: string;
  modifiePar: string;
  creePar: string;
  assigneA: string;
  dateCreation: string;
  dateModification: string;
  marche: string;
  lignesCredit: LigneCredit[];
  compte?: Compte;
}