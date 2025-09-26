describe('Growth Tracker', () => {
  beforeEach(() => {
    // Mock the baby API call
    cy.mockApi('babies', { baby_id: 1 })

    // Visit the growth tracker page
    cy.visit('/growth-tracker')
  })

  it('renders no growth records message when empty', () => {
    // Mock empty growth records
    cy.mockApi('growth', [])

    cy.visit('/growth-tracker')
    cy.contains('No growth records yet').should('be.visible')
  })

  it('renders existing growth records', () => {
    // Mock growth records data
    cy.mockApi('growth', [
      {
        growth_id: 1,
        height: 50,
        weight: 3.2,
        date: '2025-01-01T00:00:00.000Z'
      }
    ])

    cy.visit('/growth-tracker')

    cy.contains('Height: 50').should('be.visible')
    cy.contains('Weight: 3.2').should('be.visible')
    cy.contains('Date: 2025-01-01').should('be.visible')
  })

  it('opens add growth modal when Add button is clicked', () => {
    cy.mockApi('growth', [])

    cy.visit('/growth-tracker')
    cy.contains('Add').click()

    cy.contains('Add Growth').should('be.visible')
    cy.get('input[placeholder="How tall are they"]').should('be.visible')
    cy.get('input[placeholder="How much do they weigh"]').should('be.visible')
    cy.get('input[type="date"]').should('be.visible')
  })

  it('fails when trying to add growth with empty fields', () => {
    cy.mockApi('growth', [])

    // Stub window.alert to capture the alert call
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.visit('/growth-tracker')
    cy.contains('Add').click()

    // Click the Add button in the modal (second Add button)
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.get('@alert').should('have.been.calledWith', 'Please fill out all fields.')
  })

  it('closes modal when Cancel button is clicked', () => {
    cy.mockApi('growth', [])

    cy.visit('/growth-tracker')
    cy.contains('Add').click()

    cy.contains('Add Growth').should('be.visible')
    cy.contains('Cancel').click()

    cy.contains('Add Growth').should('not.exist')
  })

  it('successfully adds growth record with all fields filled', () => {
    cy.mockApi('growth', [])
    cy.mockApiPost('growth', {
      growth_id: 1,
      height: 52,
      weight: 3.5,
      date: '2025-01-01'
    })

    cy.visit('/growth-tracker')
    cy.contains('Add').click()

    cy.fillGrowthForm('52', '3.5', '2025-01-01')

    // Click the Add button in the modal
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    // Verify the API was called
    cy.wait('@postGrowth').its('request.body').should('deep.include', {
      baby_id: 1,
      height: 52,
      weight: 3.5,
      date: '2025-01-01'
    })
  })

  it('renders multiple growth records correctly', () => {
    cy.mockApi('growth', [
      {
        growth_id: 1,
        height: 50,
        weight: 3.2,
        date: '2025-01-01T00:00:00.000Z'
      },
      {
        growth_id: 2,
        height: 52,
        weight: 3.5,
        date: '2025-01-15T00:00:00.000Z'
      }
    ])

    cy.visit('/growth-tracker')

    cy.contains('Height: 50').should('be.visible')
    cy.contains('Weight: 3.2').should('be.visible')
    cy.contains('Height: 52').should('be.visible')
    cy.contains('Weight: 3.5').should('be.visible')
  })

  it('handles API error when fetching baby data', () => {
    // Mock API failure
    cy.mockApi('babies', { message: 'Server error' }, 500)

    cy.visit('/growth-tracker')

    // Should still render the page, just without data
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when fetching growth records', () => {
    cy.mockApi('babies', { baby_id: 1 })
    cy.mockApi('growth', { message: 'Server error' }, 500)

    cy.visit('/growth-tracker')

    // Should render empty state or handle error gracefully
    cy.get('.mainDiv').should('exist')
  })

  it('handles API error when adding growth record', () => {
    cy.mockApi('growth', [])
    cy.mockApiPost('growth', { message: 'Server error' }, 500)

    cy.visit('/growth-tracker')
    cy.contains('Add').click()

    cy.fillGrowthForm('52', '3.5', '2025-01-01')

    // Click the Add button in the modal
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    // Verify the API was called (even though it failed)
    cy.wait('@postGrowth')
  })

  it('converts height and weight to floats when submitting', () => {
    cy.mockApi('growth', [])
    cy.mockApiPost('growth', {
      growth_id: 1,
      height: 52.5,
      weight: 3.75,
      date: '2025-01-01'
    })

    cy.visit('/growth-tracker')
    cy.contains('Add').click()

    cy.fillGrowthForm('52.5', '3.75', '2025-01-01')

    // Click the Add button in the modal
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    // Verify the API was called with float values
    cy.wait('@postGrowth').its('request.body').should('deep.include', {
      baby_id: 1,
      height: 52.5,
      weight: 3.75,
      date: '2025-01-01'
    })
  })
})