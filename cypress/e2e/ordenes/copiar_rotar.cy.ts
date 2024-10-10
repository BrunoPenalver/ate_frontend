import { openAndFillMovimientoForm } from "../utils/agregar";
import { correctLogin } from "../utils/login";
import "cypress-plugin-tab";

describe('Crear Orden', () =>
{
    it('Copiar', () => 
    {
        correctLogin("admin", "ZwyiHTqljvRn");
        cy.visit("/admin/ordenes/agregar");
      
        cy.get("#date").click();
        cy.get(".p-datepicker-today").click();
        cy.get("#description").type("Descripción de prueba");

        openAndFillMovimientoForm(false,100);
        
        cy.get("i.pi.pi-copy").click();
    });

    it('Rotar', () => 
    {
        correctLogin("admin", "ZwyiHTqljvRn");
        cy.visit("/admin/ordenes/agregar");
        
        cy.get("#date").click();
        cy.get(".p-datepicker-today").click();
        cy.get("#description").type("Descripción de prueba");

        openAndFillMovimientoForm(true,100);
        cy.get("i.pi.pi-arrow-circle-left, i.pi.pi-arrow-circle-up").click();
    });
});