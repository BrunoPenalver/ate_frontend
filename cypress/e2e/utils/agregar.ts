
export const openAndFillMovimientoForm = (isHaber:boolean) => 
{
    cy.get("#add-text").click();

    const rangeAmount = [100, 99999];
    const amount = Math.floor(Math.random() * (rangeAmount[1] - rangeAmount[0] + 1)) + rangeAmount[0];

    cy.get("#amount").type(amount.toString());

    if(isHaber)
        cy.get(`#select-type > div:nth-child(2) > span`).click();

    cy.get("#concept").type("3 -");
    cy.get("#concept_list > li").first().click();

    cy.get("#origin").type("Rendiciones ");
    cy.get("#origin_list > li").first().click();
    
    cy.get("#beneficiary").type("2 DE OCTUBRE SO");
    cy.get("#beneficiary_list > li").first().click();

    cy.get("#paymentType").type("Efectivo");
    cy.get("#paymentType_list > li").first().click();

    cy.get("#bankAccount").type("Banco nación");
    cy.get("#bankAccount_list > li").first().click();

    
    cy.get("#sectional").type("CDP JUJUY");
    cy.get("#sectional_list > li").first().click();

    
    cy.get("#paymentDate").click();
    cy.get(".p-datepicker-today").click();


    cy.get("#details").type("Detalles \nde la \norden");

    cy.get("#imageUpload").selectFile("cypress/fixtures/test.png");

    cy.get("#button_add").click();
}