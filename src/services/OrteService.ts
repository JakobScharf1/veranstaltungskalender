import { ILocation } from "@/models/locations"


export const OrteService = {
    getLocations(): ILocation[] {
        return MOCK_DATA
    },
}

const MOCK_DATA: ILocation[] = [
    {
        id: '1',
        name: 'Kulturzentrum Mitte',
        strasse: 'Hauptstraße 12',
        ort: 'Berlin',
        plz: '10115',
        tel: '+49 30 12345678',
        email: 'info@kulturzentrum-mitte.de',
        home: 'https://kulturzentrum-mitte.de',
        facebook: 'https://facebook.com/kulturzentrum.mitte',
        instagram: 'https://instagram.com/kulturzentrum_mitte',
        info: 'Zentrales Kulturzentrum im Herzen Berlins.'
    },
    {
        id: '2',
        name: 'Stadtbibliothek',
        name2: 'Zweigstelle Nord',
        strasse: 'Gartenweg 5',
        ort: 'Hamburg',
        plz: '20095',
        tel: '+49 40 98765432',
        email: 'bibliothek@nord.hamburg.de',
    },
    {
        id: '3',
        name: 'Jugendzentrum',
        name2: 'JuZ West',
        strasse: 'Parkstraße 88',
        ort: 'München',
        plz: '80333',
        email: 'kontakt@juz-west.de',
        instagram: 'https://instagram.com/juz_west',
        image: 'https://picsum.photos/seed/juz/400/300',
        info: 'Offenes Jugendzentrum mit Veranstaltungen und Workshops.'
    },
    {
        id: '4',
        name: 'Gemeindehaus St. Maria',
        strasse: 'Kirchplatz 3',
        ort: 'Köln',
        plz: '50667',
        tel: '+49 221 11223344',
        home: 'https://stmaria-koeln.de',
        image: 'https://picsum.photos/seed/stmaria/400/300',
    },
    {
        id: '5',
        name: 'Veranstaltungshalle Ost',
        strasse: 'Industriestraße 101',
        ort: 'Leipzig',
        plz: '04103',
        tel: '+49 341 55667788',
        email: 'halle@events-ost.de',
        home: 'https://events-ost.de',
        facebook: 'https://facebook.com/events.ost',
        info: 'Große Veranstaltungshalle für Konzerte und Messen.'
    }
]
