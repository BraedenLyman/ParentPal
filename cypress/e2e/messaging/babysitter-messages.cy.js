describe('Babysitter Messages', () => {
  beforeEach(() => {
    cy.loginAsBabysitter();
    cy.visit('/babysitter-messages');
  });

  it('should load the babysitter messages page', () => {
    cy.url().should('include', '/babysitter-messages');
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
    cy.visit('/babysitter-messages');
    cy.contains('Select a conversation').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport(375, 667); 
    cy.visit('/babysitter-messages');

    cy.url().should('include', '/babysitter-messages');
    cy.get('.navBarContainer').should('be.visible');
  });
});
