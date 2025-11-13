describe('Settings', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/settings');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/settings');
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

describe('Personal Information', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/settings/personal-information');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/settings/personal-information');
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

describe('Shared Accounts', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/settings/shared-accounts');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/settings/shared-accounts');
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

describe('Data Export', () => {
  beforeEach(() => {
    cy.loginAsParent();
    cy.visit('/settings/data-export');
  });

  it('should load the page with correct URL', () => {
    cy.url().should('include', '/settings/data-export');
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
