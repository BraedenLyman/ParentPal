// Custom commands for API mocking
Cypress.Commands.add('mockApi', (endpoint, response, status = 200) => {
  cy.intercept('GET', `**/api/${endpoint}*`, {
    statusCode: status,
    body: response,
  }).as(`get${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`)
})

Cypress.Commands.add('mockApiPost', (endpoint, response, status = 200) => {
  cy.intercept('POST', `**/api/${endpoint}`, {
    statusCode: status,
    body: response,
  }).as(`post${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`)
})

// Custom command for filling forms
Cypress.Commands.add('fillGrowthForm', (height, weight, date) => {
  if (height) cy.get('input[placeholder="How tall are they"]').type(height)
  if (weight) cy.get('input[placeholder="How much do they weigh"]').type(weight)
  if (date) cy.get('input[type="date"]').type(date)
})

Cypress.Commands.add('fillMedicationForm', (name, dose, date, symptoms) => {
  if (name) cy.get('input[placeholder="Enter medication name"]').type(name)
  if (dose) cy.get('input[placeholder="Amount of meds taken"]').type(dose)
  if (date) cy.get('input[type="date"]').first().type(date)
  if (symptoms) cy.get('input[placeholder="Describe how they are feeling"]').type(symptoms)
})

// Mock Firebase Auth
Cypress.Commands.add('mockAuth', () => {
  cy.window().then((win) => {
    win.firebase = {
      auth: () => ({
        currentUser: {
          uid: 'test-uid'
        }
      })
    }
  })
})