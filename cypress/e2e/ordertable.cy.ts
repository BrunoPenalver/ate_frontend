describe('StyledTable', () => {
    beforeEach(() => {
        cy.visit('/ordenes/lista');

    });

    it('debe verificar el formato del ID de la orden', () => {
        cy.get('.p-datatable-tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(0).invoke('text').then((text) => {
                const idPattern = /^[0-9]+$/;
                expect(text.trim()).to.match(idPattern);
            });
        });
    });

    it('debe verificar el formato de la fecha', () => {
        cy.get('.p-datatable-tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
                const datePattern = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
                expect(text.trim()).to.match(datePattern);
            });
        });
    });

    it('debe verificar la longitud de la descripción', () => {
        cy.get('.p-datatable-tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(2).invoke('text').then((text) => {
                expect(text.trim()).to.have.length.of.at.most(30);
            });
        });
    });

    it('debe verificar el formato del importe total', () => {
        cy.get('.p-datatable-tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(4).invoke('text').then((text) => {
                const totalPattern = /^\$\d+(\.\d{1,2})?$/;
                expect(text.trim()).to.match(totalPattern);
            });
        });
    });

    it('debe verificar el estado de la orden', () => {
        cy.get('.p-datatable-tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(3).invoke('text').then((text) => {
                expect(text.trim()).to.be.oneOf(['Abierto', 'Cerrado']);
            });
        });
    });
});
