describe('Reports', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/reports');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/reports');
  });

  it('should display main page elements', () => {
    cy.get('.navBarContainer').should('exist');
    cy.get('h1, h2, h3').should('exist');
    cy.get('main, .container, [class*="main"]').should('exist');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.get('.navBarContainer').should('exist');
    cy.get('h1, h2, h3').should('exist');
  });
});
