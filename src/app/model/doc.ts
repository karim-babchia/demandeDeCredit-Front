import { Compte } from "./compte";


export interface Doc {
  id: number;
  type: string;
  date: string;
  compte: Compte; 
  num:string;
}
