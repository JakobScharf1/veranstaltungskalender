import { IVeranstaltung } from "./veranstaltung";

export interface ITermin {
    id?: number,
    veranstaltung: IVeranstaltung,
    start: string,
    ende?: string,
    allday: boolean,
    info?: string,
}
