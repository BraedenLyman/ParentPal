describe('Sign In', () => {
  beforeEach(() => {
    cy.clearFirebaseAuth();
    cy.visit('/sign-in');
  });

  it('should display sign in form', () => {
    cy.contains('h1', 'Welcome back!').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should have form element', () => {
    cy.get('form').should('exist');
    cy.get('.formContainer').should('be.visible');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('Forgot Password').click();
    cy.url().should('include', '/forgot-password');
  });

  it('should navigate to create account page', () => {
    cy.contains('Create account').click();
    cy.url().should('include', '/create-account');
  });

  it('should toggle password visibility', () => {
    cy.get('input[type="password"]').should('exist');
    cy.get('.formContainer button[type="button"]').first().click();
    cy.get('input[type="text"]').should('exist');
  });

  it('should show error for invalid credentials', () => {
    // Mock failed auth response
    cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
      statusCode: 400,
      body: {
        error: {
          code: 400,
          message: 'INVALID_PASSWORD',
          errors: [{
            message: 'INVALID_PASSWORD',
            domain: 'global',
            reason: 'invalid',
          }],
        },
      },
    }).as('firebaseAuthFailed');

    cy.intercept('POST', '**/api/sign-in', {
      statusCode: 401,
      body: {
        success: false,
        error: 'Invalid credentials',
      },
    }).as('backendSignInFailed');

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check for error message (adjust selector based on your UI)
    cy.get('body').should('contain', 'Invalid').or('contain', 'incorrect').or('contain', 'error');
  });

  it('should be responsive on mobile', () => {
    cy.testMobile();
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });
});
