import { Kategorie } from "./kategorie";
import { IOrt } from "./ort";
import { IVeranstalter } from "./veranstalter";

export interface IVeranstaltung {
    id?: number,
    ort: IOrt,
    veranstalter: IVeranstalter,
    titel: string,
    untertitel?: string,
    kategorie: Kategorie,
    info?: string,
    kostenlos: boolean,
    web?: string,
    facebook?: string,
    insta?: string,
    picture1?: string,
    picture2?: string,
}
