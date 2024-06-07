
describe('Login', () => 
{
  it('con credenciales incorrectas', () => 
  {
    cy.visit("/login");

    cy.get("input[name='user']").type("dsadasdas d a");
    cy.get("input[name='password']").type("dasddasdasdada");

    cy.get("button[type='submit']").click();

    cy.get(".p-toast-message-content").should('be.visible');
    cy.get(".p-toast-message-content").should('contain', 'Usuario y/o contraseña incorrecta');
  });

  it('con credenciales correctas', () => 
  {
    cy.visit("/login");

    cy.get("input[name='user']").type("admin");
    cy.get("input[name='password']").type("admin");

    cy.get("button[type='submit']").click();

    cy.url().should('include', '/admin');
    cy.get("h1").should('contain', 'Bienvenido:');
    cy.get("h2").should('contain', 'Firstname: Usuario');
    cy.get("h2").should('contain', 'Lastname: de testing');
  });

  it("sin permisos", () =>
  {
    cy.visit("/admin");
    cy.url().should('include', '/login');
  });
 
})