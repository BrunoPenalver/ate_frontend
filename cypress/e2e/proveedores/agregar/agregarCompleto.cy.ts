
import { correctLogin } from "../../utils/login";
import { clickMultipleTimes, clickSearchInLastRow, selectPrimeDropdown } from "../../utils/masters";
// import "cypress-plugin-tab";

describe('Crear Proveedor', () =>
{

    it('Crear Proveedor', () => 
    {
        cy.viewport(1920, 1080);
        correctLogin("admin", "ZwyiHTqljvRn");
        cy.visit("/admin/informacion/proovedores");
        cy.get("#add-Proovedores").click();
        cy.get("#código").type("18122022");
        selectPrimeDropdown("#tipodeproveedor", "Seccional");
        selectPrimeDropdown("#tipodeproveedor", "Beneficiario");
        cy.get("#razónsocial").type("Test Proveedor");  
        cy.get("#cuit").clear().type("20-38089910-9");
        cy.get("#cuit").should('have.value', '20-38089910-9');
        cy.get("#email").type("test@gmail.com");
        cy.get("#dirección").type("Calle test 123");
        selectPrimeDropdown("#provincia", "Buenos Aires");
        selectPrimeDropdown("#localidad", "Saavedra");
        cy.get("#códigopostal").type("1876");
        cy.get("#teléfono").type("1111111111");
        cy.get("#contacto").type("Contacto de test");
        cy.get("#cargo").type("Cargo test");
        cy.get("#observaciones").type("Observaciones de test");
        cy.get("button[type='submit']").click();
        cy.get(".p-paginator-last").click();
        clickMultipleTimes(".p-paginator-prev", 18);
        clickSearchInLastRow('table');
        cy.get('#details-dialog').should('be.visible');
        

    });

})