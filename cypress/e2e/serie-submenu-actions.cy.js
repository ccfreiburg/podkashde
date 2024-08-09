import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/serieServices.js'

describe('', () => {
    const slug = "a_new_serie"
    before('', () => {
        cy.viewport(1000, 1000)
        //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
      })
  beforeEach('', () => {
    cy.login()
    cy.visitNuxtDev('/series', [
      {
        method: 'GET',
        url: '*meta?*',
        id: 'meta'
      }

    ])
    cy.createSerie(slug)
    cy.visitNuxtDev('/serie/'+slug, [
      {
        method: 'GET',
        url: '*meta?*',
        id: 'meta'
      }

    ])
  })
  afterEach('', () => {
    cy.deleteSerie(slug)    
  })
  it('does display serie detail', () => {
    cy.contains('h1','Serie')
    cy.contains('A new Serie')
  })
  it('deletes serie, when click delete', () => {
    cy.clickLinkNuxtDev('Löschen')
    cy.contains('A New serie').should('not.exist')
  })
})  