export type FilterOption = {
  key: string
  label: string
  icon: string
  type: 'text' | 'select' | 'toggle' | 'daterange'
  placeholder?: string
  options?: string[]
  queryParam: string | string[]
}
