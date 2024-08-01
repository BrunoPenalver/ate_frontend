import { openAndFillMovimientoForm } from "../utils/agregar";
import { correctLogin } from "../utils/login";
import "cypress-plugin-tab";

describe('Crear Orden', () =>
{
    // it('Crear Orden sin movimientos', () => 
    // {
    //     cy.viewport(1920, 1080);
    //     correctLogin("admin", "ZwyiHTqljvRn");
    //     cy.visit("/admin/ordenes/agregar");
        
    //     cy.get("#date").click();
    //     cy.get("td.p-datepicker-today").click();
    //     cy.get("#description").type("Descripción de prueba");

    //     cy.get("#save-order").click();

    //     cy.url().should('include', '/admin/ordenes/');
    // });

    it('Crear Orden', () => 
    {
        correctLogin("admin", "ZwyiHTqljvRn");
        cy.visit("/admin/ordenes/agregar");
      
        cy.get("#date").click();
        cy.get(".p-datepicker-today").click();
        cy.get("#description").type("Descripción de prueba");

        openAndFillMovimientoForm(false);
        openAndFillMovimientoForm(true);
        // openAndFillMovimientoForm(true);

        cy.get("#save-order").click();

        cy.url().should('include', '/admin/ordenes');
    });
});