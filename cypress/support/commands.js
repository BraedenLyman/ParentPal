Cypress.Commands.add('login', (email, password) => {
  cy.visit('/sign-in');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/sign-in');
});

Cypress.Commands.add('loginAsParent', () => {
  const parentEmail = Cypress.env('PARENT_EMAIL');
  const parentPassword = Cypress.env('PARENT_PASSWORD');

  cy.session([parentEmail, 'parent'], () => {
    cy.login(parentEmail, parentPassword);
  }, {
    cacheAcrossSpecs: true 
  });
  
  cy.visit('/parent-dashboard');
  cy.url().should('include', '/parent-dashboard');
});

Cypress.Commands.add('loginAsBabysitter', () => {
  const babysitterEmail = Cypress.env('BABYSITTER_EMAIL');
  const babysitterPassword = Cypress.env('BABYSITTER_PASSWORD');

  cy.session([babysitterEmail, 'babysitter'], () => {
    cy.login(babysitterEmail, babysitterPassword);
  }, {
    cacheAcrossSpecs: true 
  });

  cy.visit('/babysitter-dashboard');
  cy.url().should('include', '/babysitter-dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click({ force: true });
  cy.url().should('include', '/sign-in');
});

Cypress.Commands.add('navigateTo', (path) => {
  cy.visit(path);
  cy.url().should('include', path);
});

Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(alias).its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add('shouldContainText', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).should('be.visible').and('contain', text);
});

Cypress.Commands.add('fillFieldByLabel', (label, value) => {
  cy.contains('label', label).parent().find('input, textarea, select').type(value);
});

Cypress.Commands.add('submitForm', () => {
  cy.get('form').submit();
});

Cypress.Commands.add('checkSuccessMessage', (message) => {
  cy.get('[role="alert"], .success-message, .toast').should('contain', message);
});

Cypress.Commands.add('checkErrorMessage', (message) => {
  cy.get('[role="alert"], .error-message, .toast').should('contain', message);
});

Cypress.Commands.add('clickButton', (text) => {
  cy.contains('button', text).click();
});

Cypress.Commands.add('mockFirebaseAuth', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('firebase:authUser', JSON.stringify({
      uid: 'test-user-id',
      email: 'test@example.com',
      emailVerified: true,
    }));
  });
});

Cypress.Commands.add('clearFirebaseAuth', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});

Cypress.Commands.add('testMobile', () => {
  cy.viewport('iphone-x');
});

Cypress.Commands.add('testTablet', () => {
  cy.viewport('ipad-2');
});

Cypress.Commands.add('testDesktop', () => {
  cy.viewport(1280, 720);
});

Cypress.Commands.add('interceptApi', (method, url, alias, response = {}) => {
  cy.intercept(method, url, response).as(alias);
});

Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name, { capture: 'fullPage' });
});
