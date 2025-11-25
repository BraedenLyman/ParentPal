Cypress.Commands.add('setupAuthMocks', (userType = 'parent') => {
  const mockUser = {
    uid: `test-${userType}-uid-123`,
    email: `test-${userType}@example.com`,
    emailVerified: true,
    displayName: `Test ${userType}`,
  };

  cy.window().then((win) => {
    win.localStorage.setItem('firebase:authUser', JSON.stringify(mockUser));
    win.localStorage.setItem('userType', userType);
    win.localStorage.setItem('userId', mockUser.uid);
    win.localStorage.setItem('userEmail', mockUser.email);
  });

  cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
    statusCode: 200,
    body: {
      kind: 'identitytoolkit#VerifyPasswordResponse',
      localId: mockUser.uid,
      email: mockUser.email,
      displayName: mockUser.displayName,
      idToken: 'mock-id-token-' + userType,
      registered: true,
      refreshToken: 'mock-refresh-token',
      expiresIn: '3600',
    },
  }).as('firebaseAuth');
});

Cypress.Commands.add('login', (email, password, userType = 'parent') => {
  cy.setupAuthMocks(userType);

  cy.intercept('POST', '**/api/sign-in', {
    statusCode: 200,
    body: {
      success: true,
      user: {
        uid: `test-${userType}-uid-123`,
        email: email,
        user_type: userType,
        account_id: 1,
      },
      token: 'mock-jwt-token',
    },
  }).as('backendSignIn');

  cy.visit('/sign-in');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/sign-in', { timeout: 10000 });
});

Cypress.Commands.add('loginAsParent', () => {
  cy.setupAuthMocks('parent');

  cy.intercept('GET', '**/api/accounts/**', {
    statusCode: 200,
    body: {
      account_id: 1,
      first_name: 'Test',
      last_name: 'Parent',
      email: 'test-parent@example.com',
      user_type: 'parent',
    },
  }).as('getAccount');

  cy.intercept('GET', '**/api/babies/**', {
    statusCode: 200,
    body: [{
      baby_id: 1,
      first_name: 'Baby',
      last_name: 'Doe',
      date_of_birth: '2024-01-01',
      gender: 'Male',
    }],
  }).as('getBabies');

  cy.window().then((win) => {
    win.localStorage.setItem('isAuthenticated', 'true');
    win.localStorage.setItem('userType', 'parent');
  });
});

Cypress.Commands.add('loginAsBabysitter', () => {
  cy.setupAuthMocks('babysitter');

  cy.intercept('GET', '**/api/accounts/**', {
    statusCode: 200,
    body: {
      account_id: 2,
      first_name: 'Test',
      last_name: 'Babysitter',
      email: 'test-babysitter@example.com',
      user_type: 'babysitter',
    },
  }).as('getAccount');

  cy.intercept('GET', '**/api/babysitter/assignments/**', {
    statusCode: 200,
    body: [{
      assignment_id: 1,
      parent_name: 'Test Parent',
      baby_name: 'Baby Doe',
      status: 'active',
    }],
  }).as('getAssignments');

  cy.window().then((win) => {
    win.localStorage.setItem('isAuthenticated', 'true');
    win.localStorage.setItem('userType', 'babysitter');
  });
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
