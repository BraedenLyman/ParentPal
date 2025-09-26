describe('Observation Notes', () => {
  beforeEach(() => {
    // Mock the baby API call
    cy.mockApi('babies', { baby_id: 1 })
  })

  it('renders no observation records message when empty', () => {
    cy.mockApi('observation', [])

    cy.visit('/observation-notes')
    cy.contains('No observation records yet').should('be.visible')
  })

  it('renders existing observation records', () => {
    cy.mockApi('observation', [
      {
        observation_id: 1,
        priority_level: 'high',
        notes: 'Baby seems fussy today'
      }
    ])

    cy.visit('/observation-notes')

    cy.contains('Priority Level: high').should('be.visible')
    cy.contains('Notes: Baby seems fussy today').should('be.visible')
  })

  it('opens add observation modal when Add button is clicked', () => {
    cy.mockApi('observation', [])

    cy.visit('/observation-notes')
    cy.contains('Add').click()

    cy.contains('Add Observation').should('be.visible')
    cy.contains('Priority Level').should('be.visible')
    cy.get('input[placeholder="Describe what you noitce"]').should('be.visible')
  })

  it('fails when trying to add observation with empty fields', () => {
    cy.mockApi('observation', [])

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.visit('/observation-notes')
    cy.contains('Add').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.get('@alert').should('have.been.calledWith', 'Please fill out all fields.')
  })

  it('closes modal when Cancel button is clicked', () => {
    cy.mockApi('observation', [])

    cy.visit('/observation-notes')
    cy.contains('Add').click()

    cy.contains('Add Observation').should('be.visible')
    cy.contains('Cancel').click()

    cy.contains('Add Observation').should('not.exist')
  })

  it('successfully adds observation record with all fields filled', () => {
    cy.mockApi('observation', [])
    cy.mockApiPost('observation', {
      observation_id: 1,
      priority_level: 'medium',
      notes: 'Baby had a good day'
    })

    cy.visit('/observation-notes')
    cy.contains('Add').click()

    // Fill the notes field
    cy.get('input[placeholder="Describe what you noitce"]').type('Baby had a good day')

    // Select priority level
    cy.contains('Priority Level').click()
    cy.contains('Medium').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.wait('@postObservation').its('request.body').should('include', {
      baby_id: 1,
      notes: 'Baby had a good day'
    })
  })

  it('displays priority level options in select dropdown', () => {
    cy.mockApi('observation', [])

    cy.visit('/observation-notes')
    cy.contains('Add').click()

    // Click on priority level dropdown
    cy.contains('Priority Level').click()

    // Verify all priority options are available
    cy.contains('Low').should('be.visible')
    cy.contains('Medium').should('be.visible')
    cy.contains('High').should('be.visible')
  })

  it('renders multiple observation records correctly', () => {
    cy.mockApi('observation', [
      {
        observation_id: 1,
        priority_level: 'high',
        notes: 'Baby seems fussy today'
      },
      {
        observation_id: 2,
        priority_level: 'low',
        notes: 'Baby is sleeping well'
      }
    ])

    cy.visit('/observation-notes')

    cy.contains('Priority Level: high').should('be.visible')
    cy.contains('Notes: Baby seems fussy today').should('be.visible')
    cy.contains('Priority Level: low').should('be.visible')
    cy.contains('Notes: Baby is sleeping well').should('be.visible')
  })

  it('handles API error when fetching baby data', () => {
    cy.mockApi('babies', { message: 'Server error' }, 500)

    cy.visit('/observation-notes')

    // Should still render the page
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when fetching observation records', () => {
    cy.mockApi('babies', { baby_id: 1 })
    cy.mockApi('observation', { message: 'Server error' }, 500)

    cy.visit('/observation-notes')

    // Should render the page even with API error
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when adding observation record', () => {
    cy.mockApi('observation', [])
    cy.mockApiPost('observation', { message: 'Server error' }, 500)

    cy.visit('/observation-notes')
    cy.contains('Add').click()

    // Fill the form
    cy.get('input[placeholder="Describe what you noitce"]').type('Baby had a good day')
    cy.contains('Priority Level').click()
    cy.contains('Medium').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    // Verify the API was called (even though it failed)
    cy.wait('@postObservation')
  })
})