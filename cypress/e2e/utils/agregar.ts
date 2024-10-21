
export const openAndFillMovimientoForm = (isHaber:boolean,amount:number) => 
{
    cy.get("#add-text").click();
    cy.get("#amount").type(amount.toString());

    if(isHaber)
        cy.get(`#select-type > div:nth-child(2) > span`).click();

    cy.get("#accountPlan").type("ACTIVO");
    cy.wait(500);
    cy.get(".p-autocomplete-item").first().click();
    
    cy.intercept("GET","**/beneficiaries?search=*").as("searchBeneficiaries");
    cy.get("#beneficiary").type("Glady");
    cy.wait("@searchBeneficiaries")
    cy.get(".p-autocomplete-item").should("be.visible").first().click();

    cy.get("#bankAccount > button").click();
    cy.get("#bankAccount_list > li").should("be.visible").first().click();

    cy.get("#paymentType").type("Efectivo");
    cy.get("#paymentType_list > li").first().click();

    cy.intercept("GET","**/sectionalnames?search=*").as("searchSectional");
    cy.get("#sectional").type("Lanus");
    cy.wait("@searchSectional")
    cy.get("#sectional_list > li").first().click();
    

    cy.get("#details").type("Detalle\nde la\nde prueba");
    cy.get("#operation").type("Operación test");

    cy.get("#imageUpload").selectFile("cypress/fixtures/test.png");

    cy.get("#button_add").click();
}