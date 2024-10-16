
import { correctLogin } from "../../../utils/login";
import { clickAccountsInfirstRow, selectPrimeDropdown } from '../../../utils/masters';



describe('Crear cuenta bancaria: otros', () =>
{

    it('Crear cuenta bancaria: otros', () => 
    {
        cy.viewport(1920, 1080);
        correctLogin("admin", "ZwyiHTqljvRn");
        cy.visit("/admin/informacion/proovedores");
        clickAccountsInfirstRow('table');
        cy.get("#addBank").click();
        cy.get("#code").type("123456");
        selectPrimeDropdown("#credicoop", "No");
        cy.get("#bank").type("Banco Comafi");
        selectPrimeDropdown("#cbuType", "CBU");
        cy.get("#CBU").clear().type("00700269-30004021050122");
        cy.get("#CBU").should('have.value', '00700269-30004021050122');
        cy.get("#alias").type("alias.de.test");
        cy.get("#holder").type("Titular de test");
        cy.get("#cuit").clear().type("20-38089910-9");
        cy.get("#cuit").should('have.value', '20-38089910-9');
        // cy.get("#number").type("1234567890");
        selectPrimeDropdown("#type", "Caja de ahorro pesos");
        cy.get("button[type='submit']").click();
        const datosCorrectosColumnIndex = 11;
        cy.get("table") // Asegúrate de que este selector apunte correctamente a tu tabla
          .find("tbody tr")
          .last() // Selecciona la primera fila del cuerpo de la tabla
          .find("td")
          .eq(datosCorrectosColumnIndex) // Selecciona la celda correspondiente a "Datos correctos"
          .find("i.pi-check") // Busca el icono con la clase 'pi-check' dentro de la celda
          .should("exist"); // Asegura que el icono exista
      });
        

 

})


