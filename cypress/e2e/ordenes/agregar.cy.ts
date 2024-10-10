import { openAndFillMovimientoForm } from "../utils/agregar";
import { correctLogin } from "../utils/login";
import "cypress-plugin-tab";

describe('Crear Orden', () =>
{

    it('Crear Orden: Borrador', () => 
    {
        correctLogin("admin", "ZwyiHTqljvRn");
        cy.visit("/admin/ordenes/agregar");
      
        cy.get("#date").click();
        cy.get(".p-datepicker-today").click();
        cy.get("#description").type("TEST DESCRIPCION");
        
        cy.get("#state").click();
        cy.get(".p-dropdown-item").contains("Borrador").click();

        const rangeAmount = [100, 99999];

        openAndFillMovimientoForm(false,Math.floor(Math.random() * (rangeAmount[1] - rangeAmount[0] + 1)) + rangeAmount[0]);
        openAndFillMovimientoForm(true ,Math.floor(Math.random() * (rangeAmount[1] - rangeAmount[0] + 1)) + rangeAmount[0]);


        cy.get("#save-order").click();

        cy.url().should('include', '/admin/ordenes');
    });

    it('Crear Orden: Cerrada', () => 
    {
        correctLogin("admin", "ZwyiHTqljvRn");
        cy.visit("/admin/ordenes/agregar");
        
        cy.get("#date").click();
        cy.get(".p-datepicker-today").click();
        cy.get("#description").type("TEST DESCRIPCION");

        
        cy.get("#state").click();
        cy.get(".p-dropdown-item").contains("Cerrada").click();

        const rangeAmount = [100, 99999];
        const amount = Math.floor(Math.random() * (rangeAmount[1] - rangeAmount[0] + 1)) + rangeAmount[0];

        openAndFillMovimientoForm(false,amount);
        openAndFillMovimientoForm(true,amount);

        cy.get("#save-order").click();

        cy.url().should('include', '/admin/ordenes');
    });
});