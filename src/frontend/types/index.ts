export type FilterOption = {
  key: string
  label: string
  icon: string
  type: 'text' | 'select' | 'toggle' | 'daterange'
  placeholder?: string
  options?: string[]
  queryParam: string | string[]
}

export type Item = {
  id: number
  ansprechpartner: { name: string; email: string; telefon: string; organisation: string }
  beschreibung: string
  titel: string
  anmeldung_erforderlich: boolean
  bild_url: string
  datum: string
  details_link: string
  eintritt: { kostenlos: boolean; preis: number | null; waehrung: number | null }
  kategorie: string
  max_teilnehmer: number | null
  ort: { name: string; adresse: string; stadt: string; plz: string; koordinaten: { lat: number; lng: number } }
  status: string
  tags: string[]
  uhrzeit_beginn: string
  uhrzeit_ende: string
  veranstalter: string
}