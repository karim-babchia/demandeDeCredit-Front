import { DossierCredit } from './dossier-credit';

export interface LigneCredit {
  id?: number;
  famille: string;
  nature: string;
  type: string;
  devise: string;
  montant: number;
  dateEcheance: string;
  typeTaux: string;
  taux: number;
  marge: number;
  montantcontreValeur: number;
  dossier?: DossierCredit;
}
