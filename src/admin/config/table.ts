/** Einheitliche DataTable-Konfiguration der Verwaltung (per v-bind eingebunden). */
export const tableDefaults = {
    dataKey: 'id',
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50],
    paginatorTemplate: 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
    currentPageReportTemplate: '{first}–{last} von {totalRecords}',
    scrollable: true,
    stripedRows: true
}

/** Spalten, die auf kleinen Displays ausgeblendet werden */
export const desktopOnlyColumn = {
    headerClass: 'hidden md:table-cell',
    bodyClass: 'hidden md:table-cell'
}
