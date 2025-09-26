describe('Health Journal', () => {
  beforeEach(() => {
    // Mock the baby API call
    cy.mockApi('babies', { baby_id: 1 })
  })

  it('renders meds tab with no records message when empty', () => {
    cy.mockApi('meds', [])

    cy.visit('/health-journal')
    cy.contains('No med records yet').should('be.visible')
  })

  it('renders existing meds records', () => {
    cy.mockApi('meds', [
      {
        meds_id: 1,
        medication_name: 'Tylenol',
        time_taken: '14:30',
        dosage: '5ml',
        symptoms: 'Fever',
        date: '2025-01-01T00:00:00.000Z'
      }
    ])

    cy.visit('/health-journal')

    cy.contains('Medication Name: Tylenol').should('be.visible')
    cy.contains('Time taken at: 14:30').should('be.visible')
    cy.contains('Dosage: 5ml').should('be.visible')
    cy.contains('Symptoms/Description: Fever').should('be.visible')
  })

  it('switches to allergies tab and shows no records message', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [])

    cy.visit('/health-journal')
    cy.contains('Allergies').click()

    cy.contains('No allergy records yet').should('be.visible')
  })

  it('renders existing allergies records', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [
      {
        allergy_id: 1,
        allergy_name: 'Peanuts',
        severity: 'high',
        epi_pen: 'yes',
        notes: 'Severe reaction'
      }
    ])

    cy.visit('/health-journal')
    cy.contains('Allergies').click()

    cy.contains('Allergy: Peanuts').should('be.visible')
    cy.contains('Severity: high').should('be.visible')
    cy.contains('Epi Pen: yes').should('be.visible')
  })

  it('switches to vaccinations tab and shows no records message', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [])
    cy.mockApi('vaccinations', [])

    cy.visit('/health-journal')
    cy.contains('Vaccinations').click()

    cy.contains('No vaccinations records yet').should('be.visible')
  })

  it('renders existing vaccination records', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [])
    cy.mockApi('vaccinations', [
      {
        vaccine_id: 1,
        vaccination_name: 'MMR',
        date_of_vaccine: '2025-01-01T00:00:00.000Z'
      }
    ])

    cy.visit('/health-journal')
    cy.contains('Vaccinations').click()

    cy.contains('Vaccine: MMR').should('be.visible')
    cy.contains('Date of Vaccine: 2025-01-01').should('be.visible')
  })

  it('fails when trying to add medication with empty fields', () => {
    cy.mockApi('meds', [])

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.visit('/health-journal')
    cy.contains('Add').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.get('@alert').should('have.been.calledWith', 'Please fill out all fields.')
  })

  it('fails when trying to add allergy with empty fields', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [])

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.visit('/health-journal')
    cy.contains('Allergies').click()
    cy.contains('Add').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.get('@alert').should('have.been.calledWith', 'Please fill out all fields.')
  })

  it('fails when trying to add vaccination with empty fields', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [])
    cy.mockApi('vaccinations', [])

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert')
    })

    cy.visit('/health-journal')
    cy.contains('Vaccinations').click()
    cy.contains('Add').click()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.get('@alert').should('have.been.calledWith', 'Please fill out all fields.')
  })

  it('successfully adds medication record', () => {
    cy.mockApi('meds', [])
    cy.mockApiPost('meds', {
      meds_id: 1,
      medication_name: 'Tylenol',
      time_taken: '14:30',
      dosage: '5ml',
      symptoms: 'Fever',
      date: '2025-01-01'
    })

    cy.visit('/health-journal')
    cy.contains('Add').click()

    // Fill the medication form
    cy.get('input[placeholder="Enter medication name"]').type('Tylenol')
    cy.get('input[placeholder="Amount of meds taken"]').type('5ml')
    cy.get('input[type="date"]').first().type('2025-01-01')
    cy.get('input[placeholder="Describe how they are feeling"]').type('Fever')

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.wait('@postMeds').its('request.body').should('include', {
      baby_id: 1,
      medication_name: 'Tylenol',
      dosage: '5ml',
      symptoms: 'Fever',
      date: '2025-01-01'
    })
  })

  it('successfully adds allergy record', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [])
    cy.mockApiPost('allergies', {
      allergy_id: 1,
      allergy_name: 'Peanuts',
      severity: 'high',
      epi_pen: 'yes',
      notes: 'Severe reaction'
    })

    cy.visit('/health-journal')
    cy.contains('Allergies').click()
    cy.contains('Add').click()

    // Fill the allergy form
    cy.get('input[placeholder="What are they allergic to"]').type('Peanuts')
    cy.get('input[placeholder="Add any other important info"]').type('Severe reaction')

    // Select severity (this might need adjustment based on actual UI)
    cy.contains('Select severity').click()
    cy.contains('High').click()

    // Select EpiPen option
    cy.get('input[value="yes"]').check()

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.wait('@postAllergies')
  })

  it('successfully adds vaccination record', () => {
    cy.mockApi('meds', [])
    cy.mockApi('allergies', [])
    cy.mockApi('vaccinations', [])
    cy.mockApiPost('vaccinations', {
      vaccine_id: 1,
      vaccination_name: 'MMR',
      date_of_vaccine: '2025-01-01'
    })

    cy.visit('/health-journal')
    cy.contains('Vaccinations').click()
    cy.contains('Add').click()

    // Fill the vaccination form
    cy.get('input[placeholder="Vaccination they have"]').type('MMR')
    cy.get('input[type="date"]').type('2025-01-01')

    // Click the modal Add button
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Add').click()
    })

    cy.wait('@postVaccinations').its('request.body').should('include', {
      baby_id: 1,
      vaccination_name: 'MMR',
      date_of_vaccine: '2025-01-01'
    })
  })
})