describe('Forgot Password', () => {
  beforeEach(() => {
    cy.mockFirebaseAuth();
    cy.visit('/forgot-password');
  });

  it('should display forgot password page', () => {
    cy.contains('h1', 'Recover Password').should('be.visible');
    cy.contains('Enter your account email to recover password').should('be.visible');
  });

  it('should display email input field', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[placeholder="Enter your email"]').should('be.visible');
  });

  it('should display send restore link button', () => {
    cy.contains('button', 'Send restore link').should('be.visible');
  });

  it('should show validation error for empty email', () => {
    cy.contains('button', 'Send restore link').click();
    cy.contains('Please enter your email').should('be.visible');
  });

  it('should navigate back to sign in', () => {
    cy.get('button').find('svg').first().click();
    cy.url().should('include', '/sign-in');
  });

  it('should be responsive on mobile', () => {
    cy.testMobile();
    cy.contains('h1', 'Recover Password').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
  });
});
