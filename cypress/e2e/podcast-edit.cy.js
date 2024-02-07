import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'

describe('', () => {
    const slug = "a_new_podcast"
    before('', () => {
        cy.viewport(1000, 1000)
        //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
      })
  beforeEach('Edit Podcast Page', () => {
    cy.visitNuxtDev('/podcasts')
    cy.login()
    cy.createPodcast(slug)
    cy.visitNuxtDev('/podcast/'+slug)
    cy.clickLinkNuxtDev('Podcast bearbeiten')
  })
  afterEach('', () => {
    cy.deletePodcast(slug)    
  })
  it('Shows Title', () => {
    cy.contains('h1','Podcast bearbeiten')
  })
  it('Change Author', () => {
    cy.getInput('author').clear().type('fritzile{Enter}')
    cy.location().should(loc => {
        expect(loc.pathname).to.equal('/podcast/'+slug)
    })
    cy.contains('fritzile')
  })
  it('Empty Author creates validation error', () => {
    cy.getInput('author').clear().type('{Enter}')
    cy.contains('Bitte einen Autor eingeben')
  })
  it('Change Image', () => {
    cy.intercept('POST','podcast').as('postPodcast')
    cy.get('input[type=file]').selectFile('cypress/fixtures/pod-cover0.jpg', {
        action: "select",
        force: true,
      });
    cy.getInput('author').type('{Enter}')
    cy.wait('@postPodcast')
    cy.location().should(loc => {
        expect(loc.pathname).to.equal('/podcast/'+slug)
    })
    cy.getBySel('content-area').find('img').should('have.attr', 'src').should('include','pod-cover0.jpg')
  })
})