import { Adresse } from "./adresse";

export interface IVeranstalter {
    id?: number,
    bezeichnung: string,
    bezeichnung_alternativ?: string,
    info?: string,
    tel?: string,
    email?: string,
    home?: string,
    facebook?: string,
    insta?: string,
    picture?: string,
    adresse: Adresse,
}
