describe('Photo Gallery', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/photo-gallery');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/photo-gallery');
  });

  it('should display main page elements', () => {
    cy.get('.navBarContainer').should('exist');
    cy.get('h1, h2, h3').should('exist');
    cy.get('.settings-container').should('exist');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.get('.navBarContainer').should('exist');
    cy.get('h1, h2, h3').should('exist');
  });
});
