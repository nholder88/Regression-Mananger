describe('regression test form', () => {
  beforeEach(() => cy.visit('/regression/continue/thing'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    cy.get('.card-header').should('contain', 'Scenario Configuration');
  });
});
