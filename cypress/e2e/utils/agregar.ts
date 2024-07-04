
export const openAndFillMovimientoForm = (isHaber:boolean) => 
{
    cy.get("#add-text").click();
    cy.get("#amount").type("100");

    if(isHaber)
        cy.get(`#select-type > div:nth-child(2) > span`).click();

    cy.get("#concept").type("Concepto 1");
    cy.get("#concept_list > li").first().click();

    cy.get("#sectional").type("Seccional 1");
    cy.get("#sectional_list > li").first().click();

    cy.get("#origin").type("Juan Test");
    cy.get("#origin_list > li").first().click();

    cy.get("#destiny").type("Pedro Test");
    cy.get("#destiny_list > li").first().click();

    cy.get("#numberCheck").type("123456");
    
    cy.get("#paymentDate").click();
    cy.get("#paymentDate_panel > div > div > div.p-datepicker-calendar-container > table > tbody > tr:nth-child(1) > td.p-datepicker-today").click();

    cy.get("#details").type("Detalles de la orden");
    cy.get("#extraDetails").type("Detalles de la orden extra");

    cy.get("#button_add").click();
}