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
    cy.login().then( ()=> {
      cy.createSerie(slug).then( ser => {
        cy.visitNuxtDev('/admin/serie/'+slug)
      })
    })
    cy.contains('Serie bearbeiten')
  })
  afterEach('', () => {
    cy.deleteSerie(slug)    
  })
  it('Shows Title', () => {
    cy.contains('h1','Serie bearbeiten')
  })
  it('Change Title', () => {
    cy.getInput('title').clear().type('fritzile{Enter}')
    cy.wait(3)
    cy.contains('fritzile')
  })
  it('Empty Author creates validation error', () => {
    cy.getInput('title').clear().type('{Enter}')
    cy.contains('Bitte einen Titel')
  })
  it('Change Image', () => {
    cy.intercept('POST','upload').as('upload')
    cy.intercept('POST','series').as('series')
    cy.get('input[type=file]').selectFile('cypress/fixtures/serie-cover4.jpg', {
        action: "select",
        force: true,
      });
    cy.getInput('title').type('{Enter}')
    cy.waitIntercept('upload',12000)
    cy.waitIntercept('series')
    cy.location({timeout: 9000}).should(loc => {
      expect(loc.pathname).to.equal('/serie/'+slug)
    })
    cy.getBySel('content-area').find('img').should('have.attr', 'src').should('include','serie-cover4.jpg')
  })
})