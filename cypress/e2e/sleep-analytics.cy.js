describe('Sleep Analytics', () => {
  beforeEach(() => {
    // Mock the baby API call
    cy.mockApi('babies', { baby_id: 1 })
  })

  it('renders no sleep records message when empty', () => {
    cy.mockApi('sleep', [])

    cy.visit('/sleep-analytics')
    cy.contains('No sleep records yet').should('be.visible')
  })

  it('renders existing sleep records', () => {
    cy.mockApi('sleep', [
      {
        sleep_id: 1,
        sleep_duration: '8',
        time_fell_asleep: '22:00',
        date: '2025-01-01T00:00:00.000Z'
      }
    ])

    cy.visit('/sleep-analytics')

    cy.contains('Duration: 8').should('be.visible')
    cy.contains('Time fell asleep at: 22:00').should('be.visible')
    cy.contains('Date: 2025-01-01').should('be.visible')
  })

  it('opens add sleep modal when Add button is clicked', () => {
    cy.mockApi('sleep', [])

    cy.visit('/sleep-analytics')
    cy.contains('Add').click()

    cy.contains('Add Sleep').should('be.visible')
    cy.get('input[placeholder="Hours slept"]').should('be.visible')
    cy.get('input[type="date"]').should('be.visible')
  })

  it('fails when trying to add sleep with empty fields', () => {
    cy.mockApi('sleep', [])

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.visit('/sleep-analytics')
    cy.contains('Add').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.get('@alert').should('have.been.calledWith', 'Please fill out all fields.')
  })

  it('closes modal when Cancel button is clicked', () => {
    cy.mockApi('sleep', [])

    cy.visit('/sleep-analytics')
    cy.contains('Add').click()

    cy.contains('Add Sleep').should('be.visible')
    cy.contains('Cancel').click()

    cy.contains('Add Sleep').should('not.exist')
  })

  it('successfully adds sleep record with all fields filled', () => {
    cy.mockApi('sleep', [])
    cy.mockApiPost('sleep', {
      sleep_id: 1,
      sleep_duration: '8',
      time_fell_asleep: '22:00',
      date: '2025-01-01'
    })

    cy.visit('/sleep-analytics')
    cy.contains('Add').click()

    // Fill the sleep form
    cy.get('input[placeholder="Hours slept"]').type('8')
    cy.get('input[type="date"]').type('2025-01-01')

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.wait('@postSleep').its('request.body').should('include', {
      baby_id: 1,
      sleep_duration: '8',
      date: '2025-01-01'
    })
  })

  it('renders multiple sleep records correctly', () => {
    cy.mockApi('sleep', [
      {
        sleep_id: 1,
        sleep_duration: '8',
        time_fell_asleep: '22:00',
        date: '2025-01-01T00:00:00.000Z'
      },
      {
        sleep_id: 2,
        sleep_duration: '6',
        time_fell_asleep: '23:30',
        date: '2025-01-02T00:00:00.000Z'
      }
    ])

    cy.visit('/sleep-analytics')

    cy.contains('Duration: 8').should('be.visible')
    cy.contains('Time fell asleep at: 22:00').should('be.visible')
    cy.contains('Duration: 6').should('be.visible')
    cy.contains('Time fell asleep at: 23:30').should('be.visible')
  })

  it('handles API error when fetching baby data', () => {
    cy.mockApi('babies', { message: 'Server error' }, 500)

    cy.visit('/sleep-analytics')

    // Should still render the page
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when fetching sleep records', () => {
    cy.mockApi('babies', { baby_id: 1 })
    cy.mockApi('sleep', { message: 'Server error' }, 500)

    cy.visit('/sleep-analytics')

    // Should render the page even with API error
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when adding sleep record', () => {
    cy.mockApi('sleep', [])
    cy.mockApiPost('sleep', { message: 'Server error' }, 500)

    cy.visit('/sleep-analytics')
    cy.contains('Add').click()

    // Fill the sleep form
    cy.get('input[placeholder="Hours slept"]').type('8')
    cy.get('input[type="date"]').type('2025-01-01')

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    // Verify the API was called (even though it failed)
    cy.wait('@postSleep')
  })

  it('displays time input for fell asleep time', () => {
    cy.mockApi('sleep', [])

    cy.visit('/sleep-analytics')
    cy.contains('Add').click()

    // Check that time input is present (label text from component)
    cy.contains('Time fell asleep at').should('be.visible')
  })
})