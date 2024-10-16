
import { correctLogin } from "../../utils/login";
import { clickEditInfirstRow, selectPrimeDropdown } from "../../utils/masters";
// import "cypress-plugin-tab";

describe('Editar Proveedor', () =>
{

    it('Editar Proveedor, datos incompletos', () => 
        {
            cy.viewport(1920, 1080);
            correctLogin("admin", "ZwyiHTqljvRn");
            cy.visit("/admin/informacion/proovedores");
            cy.wait(500); 
            clickEditInfirstRow('table');
            cy.wait(500); 
            cy.get("#código").clear().type("14072024");
            selectPrimeDropdown("#tipodeproveedor", "Seccional");

            cy.get("#razónsocial").clear().type("Test Proveedor");  
            cy.get("#cuit").clear().type("20-38089910-9");
            cy.get("#cuit").should('have.value', '20-38089910-9');
            cy.get("#email").clear().type("test@gmail.com");
            cy.get("button[type='submit']").click();
            cy.wait(500); 
            const datosCorrectosColumnIndex = 6;
            cy.get('table') // Asegúrate de que este selector apunte correctamente a tu tabla
            .find('tbody tr').first() // Selecciona la primera fila del cuerpo de la tabla
            .find('td').eq(datosCorrectosColumnIndex) // Selecciona la celda correspondiente a "Datos correctos"
            .find('i.pi-check') // Busca el icono con la clase 'pi-check' dentro de la celda
            .should('exist'); // Asegura que el icono exista

            
    
        });
})