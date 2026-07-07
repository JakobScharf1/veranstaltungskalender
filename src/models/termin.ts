import { IVeranstaltung } from "./veranstaltung";

export interface ITermin {
    id?: number,
    veranstaltung: IVeranstaltung,
    start: Date | string,
    ende?: Date | string,
    allday: boolean,
    info?: string,
}
