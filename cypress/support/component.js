// Import commands.js for component testing
import './commands'
import { mount } from 'cypress/react18'

// Augment the Cypress namespace to include type definitions for
// your custom command.
Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(<MyComponent />)
