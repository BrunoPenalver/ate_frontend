
export const correctLogin = (user: string, password: string) =>
{
    cy.visit("/login");

    cy.get("input[name='user']").type(user);
    cy.get("input[name='password']").type(password);

    cy.get("button[type='submit']").click();

    cy.url().should('include', '/admin');
}