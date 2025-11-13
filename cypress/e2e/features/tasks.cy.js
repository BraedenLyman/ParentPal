describe('Parent Assigned Tasks', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/parent-assigned-tasks');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/parent-assigned-tasks');
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

describe('Babysitter Assigned Tasks', () => {
  beforeEach(() => {
    cy.loginAsBabysitter();
    cy.visit('/assigned-tasks');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/assigned-tasks');
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
