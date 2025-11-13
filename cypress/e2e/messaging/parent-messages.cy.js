describe('Parent Messages', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/parent-messages');
  });

  it('should load the parent messages page', () => {
    cy.url().should('include', '/parent-messages');
  });

  it('should display the navbar', () => {
    cy.get('.navBarContainer').should('be.visible');
  });

  it('should have the main messages container', () => {
    cy.get('.messages-container, .messaging-container, [class*="message"]').should('exist');
  });

  it('should display the page title', () => {
    cy.get('h1, h2, h3').should('exist');
  });

  it('should show empty state when no conversation selected', () => {
    cy.viewport(375, 667); 
    cy.visit('/parent-messages');
    cy.contains('Select a conversation').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport(375, 667); 
    cy.visit('/parent-messages');
    cy.url().should('include', '/parent-messages');
    cy.get('.navBarContainer').should('be.visible');
  });
});
