import { openAndFillMovimientoForm } from "../utils/agregar";
import { correctLogin } from "../utils/login";
import "cypress-plugin-tab";

describe('Crear Orden', () =>
{
    it('Crear Orden sin movimientos', () => 
    {
        cy.viewport(1920, 1080);
        correctLogin("admin", "admin");
        cy.visit("/admin/ordenes/agregar");
        
        cy.get("#date").click();
        cy.get("#date_panel > div > div > div.p-datepicker-calendar-container > table > tbody > tr:nth-child(2) > td.p-datepicker-today").click();
        cy.get("#description").type("Descripción de prueba");

        cy.get("#save-order").click();

        cy.url().should('include', '/admin/ordenes/');
    });

    it('Crear Orden', () => 
    {
        cy.viewport(1920, 1080);
        correctLogin("admin", "admin");
        cy.visit("/admin/ordenes/agregar");
      
        cy.get("#date").click();
        cy.get("#date_panel > div > div > div.p-datepicker-calendar-container > table > tbody > tr:nth-child(2) > td.p-datepicker-today").click();
        cy.get("#description").type("Descripción de prueba");

        openAndFillMovimientoForm(false);
        openAndFillMovimientoForm(true);
        openAndFillMovimientoForm(true);

        cy.get("#save-order").click();

        cy.url().should('include', '/admin/ordenes');
    });
});