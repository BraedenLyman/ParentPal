describe('Babysitter Dashboard', () => {
  beforeEach(() => {
    cy.loginAsBabysitter();
    cy.visit('/babysitter-dashboard');
  });

  it('should load the babysitter dashboard page', () => {
    cy.url().should('include', '/babysitter-dashboard');
  });

  it('should display a heading', () => {
    cy.get('h1, h2, h3').should('exist');
  });

  it('should display the navigation bar', () => {
    cy.get('.navBarContainer').should('exist');
  });

  it('should have navigation links or buttons', () => {
    cy.get('.navBarContainer').within(() => {
      cy.get('.navSection').should('have.length.greaterThan', 0);
    });
  });

  it('should display dashboard content container', () => {
    cy.get('body').should('be.visible');
    cy.get('div').should('exist');
  });

  it('should be responsive on mobile viewport', () => {
    cy.viewport('iphone-x');
    cy.get('.navBarContainer').should('exist');
    cy.get('body').should('be.visible');
  });

  it('should be responsive on tablet viewport', () => {
    cy.viewport('ipad-2');
    cy.get('.navBarContainer').should('exist');
    cy.get('body').should('be.visible');
  });

  it('should have links or buttons for key features', () => {
    cy.get('a, button, [role="button"]').should('have.length.greaterThan', 0);
  });
});
