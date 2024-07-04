import { openAndFillMovimientoForm } from "../utils/agregar";
import { correctLogin } from "../utils/login";
import "cypress-plugin-tab";

describe('Crear Orden', () =>
{
    it('Crear movimiento', () => 
    {
        cy.viewport(1920, 1080);
        correctLogin("admin", "admin");
        cy.visit("ordenes/agregar");
      
        openAndFillMovimientoForm(false);
        openAndFillMovimientoForm(true);
    });
});