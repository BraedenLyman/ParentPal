describe('Create Account', () => {
  beforeEach(() => {
    cy.mockFirebaseAuth();
    cy.visit('/create-account');
  });

  it('should display create account page', () => {
    cy.contains('h1', 'Create an account').should('be.visible');
    cy.get('.inputContainer').should('be.visible');
  });

  it('should display input fields', () => {
    cy.get('input[placeholder*="first name"]').should('be.visible');
    cy.get('input[placeholder*="last name"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should show password validation errors', () => {
    cy.get('input[type="password"]').type('weak').focus();
    cy.get('input[type="email"]').click(); 
    cy.contains('Password must be at least 8 characters long').should('be.visible');
  });

  it('should allow selecting account type', () => {
    cy.contains('Account Type').should('be.visible');
    cy.get('.form-field').contains('Account Type').parent().find('.react-select__control').click();
    cy.get('.react-select__menu').should('be.visible');
    cy.contains('.react-select__option', 'Parent').should('be.visible');
    cy.contains('.react-select__option', 'Babysitter').should('be.visible');
  });

  it('should show additional fields after selecting parent', () => {
    cy.get('.form-field').contains('Account Type').parent().find('.react-select__control').click();
    cy.contains('.react-select__option', 'Parent').click();
    cy.contains('Date of Birth').should('be.visible');
    cy.contains('Gender').should('be.visible');
    cy.get('input[placeholder*="baby"]').should('exist');
  });

  it('should show additional fields after selecting babysitter', () => {
    cy.get('.form-field').contains('Account Type').parent().find('.react-select__control').click();
    cy.contains('.react-select__option', 'Babysitter').click();
    cy.contains('Date of Birth').should('be.visible');
    cy.contains('Gender').should('be.visible');
    cy.contains('Baby Type').should('not.exist');
  });

  it('should have disabled button initially', () => {
    cy.contains('button', 'Create an account').should('be.disabled');
  });

  it('should successfully create parent account', () => {
    cy.intercept('POST', '**/auth/sign-up', {
      statusCode: 200,
      body: { user: { uid: 'test-uid' } }
    }).as('signUp');

    cy.intercept('POST', '**/api/accounts', {
      statusCode: 200,
      body: {
        user: {
          account_id: 1,
          user_type: 'parent'
        }
      }
    }).as('createAccount');

    cy.get('input[placeholder*="first name"]').type('Test');
    cy.get('input[placeholder*="last name"]').type('main');
    cy.get('input[type="email"]').type('test.main@test.com');
    cy.get('input[type="password"]').type('TestPass123!');
    cy.get('.form-field').contains('Account Type').parent().find('.react-select__control').click();
    cy.get('.react-select__menu').find('.react-select__option').first().click();
    cy.get('input[type="date"]').first().type('1990-01-01');
    cy.get('.form-field').contains('Gender').parent().find('.react-select__control').click();
    cy.get('.react-select__menu').find('.react-select__option').first().click();
    cy.get('.form-field').contains('Baby Type').parent().find('.react-select__control').click();
    cy.get('.react-select__menu').find('.react-select__option').first().click();
    cy.get('input[placeholder*="baby\'s first name"]').type('Baby');
    cy.get('input[placeholder*="baby\'s last name"]').type('Doe');
    cy.get('input[type="date"]').last().type('2024-01-01');
    cy.get('.form-field').contains('Baby Gender').parent().find('.react-select__control').click();
    cy.get('.react-select__menu').find('.react-select__option').first().click();
    cy.contains('button', 'Create an account').click();
    cy.url().should('include', '/account-complete', { timeout: 15000 });
    cy.contains('Welcome to ParentPal!').should('be.visible');
    cy.contains('Your account has been successfully created').should('be.visible');
    cy.contains('button', 'Sign In to Get Started').click();
    cy.url().should('include', '/sign-in');
  });

  it('should be responsive on mobile', () => {
    cy.testMobile();
    cy.contains('h1', 'Create an account').should('be.visible');
    cy.get('.inputContainer').should('be.visible');
  });
});
