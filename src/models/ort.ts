import { Adresse } from "./adresse";

export interface IOrt {
    id?: string,
    bezeichnung: string,
    bezeichnung_alternativ?: string,
    info?: string,
    picture?: string,
    tel?: string,
    email?: string,
    home?: string,
    facebook?: string,
    insta?: string,
    adresse: Adresse,
}
