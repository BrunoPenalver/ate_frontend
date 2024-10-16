
/**

 * @param {string} dropdownSelector - El selector del Dropdown (por ejemplo, '#provincia').
 * @param {string} optionText - El texto de la opción que deseas seleccionar (por ejemplo, 'Buenos Aires').
 */
export function selectPrimeDropdown(dropdownSelector: string, optionText: string | number):void {
    // Abre el Dropdown
    cy.get(dropdownSelector).click();

    // Selecciona la opción deseada
    cy.get('.p-dropdown-item').contains(optionText).click();
}

/**
 * Hace clic en un elemento una cantidad específica de veces.
 *
 * @param {string} selector - El selector del elemento en el que se hará clic.
 * @param {number} times - La cantidad de veces que se hará clic.
 */
export function clickMultipleTimes(selector:string, times:number):void {
    for (let i = 0; i < times; i++) {
        cy.get(selector).click();
    }
}

/**
 * Hace clic en el botón .pi-search de la última fila visible de una tabla.
 *
 * @param {string} tableSelector - El selector de la tabla (por ejemplo, 'table' o '.mi-tabla').
 */
export function clickSearchInLastRow(tableSelector:string) {
    cy.get(`${tableSelector} tbody tr`).last().within(() => {
        cy.get('#detailsicon').click();
    });
}

export function clickEditInfirstRow(tableSelector:string) {
    cy.get(`${tableSelector} tbody tr`).first().within(() => {
        cy.get('#editicon').click();
    });
}

export function clickBankEditInfirstRow(tableSelector:string) {
    cy.get(`${tableSelector} tbody tr`).first().within(() => {
        cy.get('#editbankicon').click();
    });
}

export function clickAccountsInfirstRow(tableSelector:string) {
    cy.get(`${tableSelector} tbody tr`).first().within(() => {
        cy.get('#accountsButton').click();
    });
}

