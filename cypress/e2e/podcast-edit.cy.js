import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'

describe('', () => {
    const slug = "a_new_podcast"
    before('', () => {
        cy.viewport(1000, 1400)
        //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
      })
  beforeEach('Edit Podcast Page', () => {
    cy.intercept('GET','enums').as('enums')
    cy.login().then(() => {
        cy.createPodcast(slug).then( podcast => {
          cy.wait(3)
          cy.visitNuxtDev('/admin/podcast/'+podcast.slug )
        })
      })
    cy.waitIntercept('enums')
  })
  afterEach('', () => {
    cy.deletePodcast(slug)    
  })
  it('Shows Title', () => {
    cy.contains('h1','Podcast bearbeiten')
  })
  it('Change Author', () => {
    cy.intercept('GET','*generaterss?*').as('rss')
    cy.getInput('author').clear().type('fritzile{Enter}')
    cy.location().should(loc => {
        expect(loc.pathname).to.equal('/podcast/'+slug)
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
    cy.intercept('GET','count*').as('count')
    cy.intercept('POST','upload').as('upload')
    cy.intercept('POST','podcast').as('podcast')
    cy.get('input[type=file]').selectFile('cypress/fixtures/pod-cover3.jpg', {
        action: "select",
        force: true,
      });
    cy.getInput('author').type('{Enter}').wait(3)
    cy.waitIntercept('count')
    cy.waitIntercept('upload',12000)
    cy.waitIntercept('podcast')
    cy.waitIntercept('rss')
    cy.location({timeout: 10000}).should(loc => {
        expect(loc.pathname).to.equal('/podcast/'+slug)
    })
    cy.getBySel('content-area').find('img').should('have.attr', 'src').should('include','pod-cover3.jpg')
  })
})