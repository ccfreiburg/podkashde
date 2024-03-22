import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/serieServices.js'

describe('', () => {
    const slug = "a_new_serie"
    before('', () => {
        cy.viewport(1000, 1400)
        //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
      })
  beforeEach('Edit serie Page', () => {
    cy.visitNuxtDev('/series')
    cy.login()
    cy.createSerie(slug)
    cy.visitNuxtDev('/serie/'+slug)
    cy.clickLinkNuxtDev('Serie bearbeiten')
  })
  afterEach('', () => {
    cy.deleteSerie(slug)    
  })
  it.only('Shows Title', () => {
    cy.contains('h1','Serie bearbeiten')
  })
  it('Change Author', () => {
    cy.intercept('GET','*generaterss?*').as('rss')
    cy.getInput('author').clear().type('fritzile{Enter}')
    cy.location().should(loc => {
        expect(loc.pathname).to.equal('/serie/'+slug)
    })
    cy.waitIntercept('rss')
    cy.contains('fritzile')
  })
  it('Empty Author creates validation error', () => {
    cy.getInput('author').clear().type('{Enter}')
    cy.contains('Bitte einen Autor eingeben')
  })
  it('Change Image', () => {
    cy.intercept('GET','*generaterss?*').as('rss')
    cy.get('input[type=file]').selectFile('cypress/fixtures/pod-cover1.jpg', {
        action: "select",
        force: true,
      });
    cy.getInput('author').type('{Enter}')
    cy.waitIntercept('rss')
    cy.location().should(loc => {
        expect(loc.pathname).to.equal('/serie/'+slug)
    })
    cy.getBySel('content-area').find('img').should('have.attr', 'src').should('include','pod-cover1.jpg')
  })
})