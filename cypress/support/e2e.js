import './commands'

const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

beforeEach(() => {
  cy.intercept('GET', '**/api/test', {
    statusCode: 200,
    body: { status: 'ok', message: 'Test endpoint' },
  }).as('testEndpoint');

  cy.intercept('GET', '**/api/growth*', {
    statusCode: 200,
    body: [{
      growth_id: 1,
      baby_id: 1,
      weight: 10.5,
      height: 75,
      date: '2024-01-15',
    }],
  }).as('getGrowth');

  cy.intercept('POST', '**/api/growth', {
    statusCode: 201,
    body: { growth_id: 1, message: 'Growth record created' },
  }).as('createGrowth');

  cy.intercept('GET', '**/api/sleep*', {
    statusCode: 200,
    body: [{
      sleep_id: 1,
      baby_id: 1,
      sleep_duration: 8,
      time_fell_asleep: '20:00',
      date: '2024-01-15',
    }],
  }).as('getSleep');

  cy.intercept('POST', '**/api/sleep', {
    statusCode: 201,
    body: { sleep_id: 1, message: 'Sleep record created' },
  }).as('createSleep');

  cy.intercept('GET', '**/api/feeding*', {
    statusCode: 200,
    body: [{
      feeding_id: 1,
      baby_id: 1,
      time_fed: '10:00',
      fed_from: 'bottle',
      type_of_food: 'formula',
      amount: 6,
      date: '2024-01-15',
    }],
  }).as('getFeeding');

  cy.intercept('POST', '**/api/feeding', {
    statusCode: 201,
    body: { feeding_id: 1, message: 'Feeding record created' },
  }).as('createFeeding');

  cy.intercept('GET', '**/api/observation*', {
    statusCode: 200,
    body: [{
      observation_id: 1,
      baby_id: 1,
      priority_level: 'medium',
      notes: 'Test observation',
      date: '2024-01-15',
    }],
  }).as('getObservation');

  cy.intercept('POST', '**/api/observation', {
    statusCode: 201,
    body: { observation_id: 1, message: 'Observation created' },
  }).as('createObservation');

  cy.intercept('GET', '**/api/messages*', {
    statusCode: 200,
    body: [{
      message_id: 1,
      sender_id: 1,
      recipient_id: 2,
      message: 'Test message',
      timestamp: '2024-01-15T10:00:00Z',
      read: false,
    }],
  }).as('getMessages');

  cy.intercept('POST', '**/api/messages', {
    statusCode: 201,
    body: { message_id: 1, message: 'Message sent' },
  }).as('sendMessage');

  cy.intercept('GET', '**/api/photos*', {
    statusCode: 200,
    body: [{
      photo_id: 1,
      baby_id: 1,
      url: 'https://via.placeholder.com/300',
      caption: 'Test photo',
      date: '2024-01-15',
    }],
  }).as('getPhotos');

  cy.intercept('POST', '**/api/photos', {
    statusCode: 201,
    body: { photo_id: 1, message: 'Photo uploaded' },
  }).as('uploadPhoto');

  cy.intercept('GET', '**/api/tasks*', {
    statusCode: 200,
    body: [{
      task_id: 1,
      title: 'Test Task',
      description: 'Test description',
      completed: false,
      due_date: '2024-01-20',
    }],
  }).as('getTasks');

  cy.intercept('POST', '**/api/tasks', {
    statusCode: 201,
    body: { task_id: 1, message: 'Task created' },
  }).as('createTask');

  cy.intercept('GET', '**/api/settings*', {
    statusCode: 200,
    body: {
      notifications: true,
      theme: 'light',
      language: 'en',
    },
  }).as('getSettings');

  cy.intercept('PUT', '**/api/settings*', {
    statusCode: 200,
    body: { message: 'Settings updated' },
  }).as('updateSettings');

  cy.intercept('GET', '**/api/reports*', {
    statusCode: 200,
    body: {
      reportType: 'summary',
      data: {
        totalFeedings: 30,
        totalSleep: 180,
        averageWeight: 10.5,
      },
    },
  }).as('getReports');

  cy.intercept('GET', '**/api/vaccinations*', {
    statusCode: 200,
    body: [{
      vaccination_id: 1,
      baby_id: 1,
      vaccine_name: 'Test Vaccine',
      date_administered: '2024-01-10',
    }],
  }).as('getVaccinations');

  cy.intercept('GET', '**/api/health*', {
    statusCode: 200,
    body: [{
      health_id: 1,
      baby_id: 1,
      entry_type: 'checkup',
      notes: 'Regular checkup',
      date: '2024-01-15',
    }],
  }).as('getHealth');

  cy.intercept('POST', '**/api/health', {
    statusCode: 201,
    body: { health_id: 1, message: 'Health record created' },
  }).as('createHealth');
});

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  if (err.message.includes('Firebase')) {
    return false;
  }
  if (err.message.includes('auth')) {
    return false;
  }
  if (err.message.includes('localStorage')) {
    return false;
  }
  if (err.message.includes('Network')) {
    return false;
  }
  return true;
});
