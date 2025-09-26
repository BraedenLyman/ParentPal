describe('Feeding Notes', () => {
  beforeEach(() => {
    // Mock the baby API call
    cy.mockApi('babies', { baby_id: 1 })
  })

  it('renders no feeding records message when empty', () => {
    cy.mockApi('feeding', [])

    cy.visit('/feeding-notes')
    cy.contains('No feeding records yet').should('be.visible')
  })

  it('renders existing feeding records', () => {
    cy.mockApi('feeding', [
      {
        feeding_id: 1,
        time_fed: '12:30',
        date: '2025-01-01T00:00:00.000Z',
        fed_from: 'bottle',
        type_of_food: 'milk',
        amount: '120ml',
        notes: 'Baby was very hungry'
      }
    ])

    cy.visit('/feeding-notes')
    cy.contains('Time Fed: 12:30').should('be.visible')
    cy.contains('Date: 2025-01-01').should('be.visible')
    cy.contains('Fed From: bottle').should('be.visible')
    cy.contains('Type of Food: milk').should('be.visible')
    cy.contains('Amount: 120ml').should('be.visible')
    cy.contains('Notes: Baby was very hungry').should('be.visible')
  })

  it('opens add feeding modal when Add button is clicked', () => {
    cy.mockApi('feeding', [])

    cy.visit('/feeding-notes')
    cy.contains('Add').click()

    cy.contains('Add Feeding').should('be.visible')
    cy.contains('Feeding TIme').should('be.visible')
    cy.get('input[type="date"]').should('be.visible')
    cy.contains('Fed From').should('be.visible')
    cy.contains('Type of Food').should('be.visible')
    cy.get('input[placeholder="Amount of food they were fed"]').should('be.visible')
    cy.get('input[placeholder="Add any other important information"]').should('be.visible')
  })

  it('fails when trying to add feeding with empty fields', () => {
    cy.mockApi('feeding', [])

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.visit('/feeding-notes')
    cy.contains('Add').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.get('@alert').should('have.been.calledWith', 'Please fill out all fields.')
  })

  it('closes modal when Cancel button is clicked', () => {
    cy.mockApi('feeding', [])

    cy.visit('/feeding-notes')
    cy.contains('Add').click()

    cy.contains('Add Feeding').should('be.visible')
    cy.contains('Cancel').click()

    cy.contains('Add Feeding').should('not.exist')
  })

  it('displays fed from options in select dropdown', () => {
    cy.mockApi('feeding', [])

    cy.visit('/feeding-notes')
    cy.contains('Add').click()

    // Click on Fed From dropdown
    cy.contains('Select where the baby was fed from').click()

    // Verify all fed from options are available
    cy.contains('Bottle').should('be.visible')
    cy.contains('Left Boob').should('be.visible')
    cy.contains('Right Boob').should('be.visible')
  })

  it('displays food type options in select dropdown', () => {
    cy.mockApi('feeding', [])

    cy.visit('/feeding-notes')
    cy.contains('Add').click()

    // Click on Type of Food dropdown
    cy.contains('Select what type of food they had').click()

    // Verify all food type options are available
    cy.contains('Milk').should('be.visible')
    cy.contains('Water').should('be.visible')
    cy.contains('Juice').should('be.visible')
  })

  it('successfully adds feeding record with all fields filled', () => {
    cy.mockApi('feeding', [])
    cy.mockApiPost('feeding', {
      feeding_id: 1,
      time_fed: '12:30',
      date: '2025-01-01',
      fed_from: 'bottle',
      type_of_food: 'milk',
      amount: '120ml',
      notes: 'Baby was hungry'
    })

    cy.visit('/feeding-notes')
    cy.contains('Add').click()

    // Fill the feeding form
    cy.get('input[type="date"]').type('2025-01-01')
    cy.get('input[placeholder="Amount of food they were fed"]').type('120ml')
    cy.get('input[placeholder="Add any other important information"]').type('Baby was hungry')

    // Select Fed From
    cy.contains('Select where the baby was fed from').click()
    cy.contains('Bottle').click()

    // Select Type of Food
    cy.contains('Select what type of food they had').click()
    cy.contains('Milk').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.wait('@postFeeding').its('request.body').should('include', {
      baby_id: 1,
      date: '2025-01-01',
      amount: '120ml',
      notes: 'Baby was hungry'
    })
  })

  it('renders multiple feeding records correctly', () => {
    cy.mockApi('feeding', [
      {
        feeding_id: 1,
        time_fed: '12:30',
        date: '2025-01-01T00:00:00.000Z',
        fed_from: 'bottle',
        type_of_food: 'milk',
        amount: '120ml',
        notes: 'Baby was very hungry'
      },
      {
        feeding_id: 2,
        time_fed: '15:00',
        date: '2025-01-01T00:00:00.000Z',
        fed_from: 'left-boob',
        type_of_food: 'milk',
        amount: '100ml',
        notes: 'Good feeding session'
      }
    ])

    cy.visit('/feeding-notes')

    cy.contains('Time Fed: 12:30').should('be.visible')
    cy.contains('Fed From: bottle').should('be.visible')
    cy.contains('Amount: 120ml').should('be.visible')
    cy.contains('Time Fed: 15:00').should('be.visible')
    cy.contains('Fed From: left-boob').should('be.visible')
    cy.contains('Amount: 100ml').should('be.visible')
  })

  it('handles API error when fetching baby data', () => {
    cy.mockApi('babies', { message: 'Server error' }, 500)

    cy.visit('/feeding-notes')

    // Should still render the page
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when fetching feeding records', () => {
    cy.mockApi('babies', { baby_id: 1 })
    cy.mockApi('feeding', { message: 'Server error' }, 500)

    cy.visit('/feeding-notes')

    // Should render the page even with API error
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when adding feeding record', () => {
    cy.mockApi('feeding', [])
    cy.mockApiPost('feeding', { message: 'Server error' }, 500)

    cy.visit('/feeding-notes')
    cy.contains('Add').click()

    // Fill the form
    cy.get('input[type="date"]').type('2025-01-01')
    cy.get('input[placeholder="Amount of food they were fed"]').type('120ml')
    cy.get('input[placeholder="Add any other important information"]').type('Baby was hungry')

    // Select dropdowns
    cy.contains('Select where the baby was fed from').click()
    cy.contains('Bottle').click()
    cy.contains('Select what type of food they had').click()
    cy.contains('Milk').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    // Verify the API was called (even though it failed)
    cy.wait('@postFeeding')
  })
})