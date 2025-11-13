// Custom commands for ParentPal application

/**
 * Login command for testing authenticated routes
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/sign-in');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Wait for redirect after successful login
  cy.url().should('not.include', '/sign-in');
});

/**
 * Login as parent user with session caching
 */
Cypress.Commands.add('loginAsParent', () => {
  const parentEmail = Cypress.env('PARENT_EMAIL') || 'parent@test.com';
  const parentPassword = Cypress.env('PARENT_PASSWORD') || 'TestPassword123!';

  cy.session([parentEmail, 'parent'], () => {
    cy.login(parentEmail, parentPassword);
    cy.url().should('include', '/parent-dashboard');
  });
});

/**
 * Login as babysitter user with session caching
 */
Cypress.Commands.add('loginAsBabysitter', () => {
  const babysitterEmail = Cypress.env('BABYSITTER_EMAIL') || 'babysitter@test.com';
  const babysitterPassword = Cypress.env('BABYSITTER_PASSWORD') || 'TestPassword123!';

  cy.session([babysitterEmail, 'babysitter'], () => {
    cy.login(babysitterEmail, babysitterPassword);
    cy.url().should('include', '/babysitter-dashboard');
  });
});

/**
 * Logout command
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click({ force: true });
  cy.url().should('include', '/sign-in');
});

/**
 * Navigate to a specific page
 */
Cypress.Commands.add('navigateTo', (path) => {
  cy.visit(path);
  cy.url().should('include', path);
});

/**
 * Wait for API response
 */
Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(alias).its('response.statusCode').should('eq', 200);
});

/**
 * Check if element is visible and contains text
 */
Cypress.Commands.add('shouldContainText', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).should('be.visible').and('contain', text);
});

/**
 * Fill form field by label
 */
Cypress.Commands.add('fillFieldByLabel', (label, value) => {
  cy.contains('label', label).parent().find('input, textarea, select').type(value);
});

/**
 * Submit form
 */
Cypress.Commands.add('submitForm', () => {
  cy.get('form').submit();
});

/**
 * Check for success message
 */
Cypress.Commands.add('checkSuccessMessage', (message) => {
  cy.get('[role="alert"], .success-message, .toast').should('contain', message);
});

/**
 * Check for error message
 */
Cypress.Commands.add('checkErrorMessage', (message) => {
  cy.get('[role="alert"], .error-message, .toast').should('contain', message);
});

/**
 * Click button by text
 */
Cypress.Commands.add('clickButton', (text) => {
  cy.contains('button', text).click();
});

/**
 * Mock Firebase Auth
 */
Cypress.Commands.add('mockFirebaseAuth', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('firebase:authUser', JSON.stringify({
      uid: 'test-user-id',
      email: 'test@example.com',
      emailVerified: true,
    }));
  });
});

/**
 * Clear Firebase Auth
 */
Cypress.Commands.add('clearFirebaseAuth', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});

/**
 * Test mobile viewport
 */
Cypress.Commands.add('testMobile', () => {
  cy.viewport('iphone-x');
});

/**
 * Test tablet viewport
 */
Cypress.Commands.add('testTablet', () => {
  cy.viewport('ipad-2');
});

/**
 * Test desktop viewport
 */
Cypress.Commands.add('testDesktop', () => {
  cy.viewport(1280, 720);
});

/**
 * Intercept API calls
 */
Cypress.Commands.add('interceptApi', (method, url, alias, response = {}) => {
  cy.intercept(method, url, response).as(alias);
});

/**
 * Take screenshot with specific name
 */
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name, { capture: 'fullPage' });
});
