import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'

describe('', () => {
    const slug = "a_new_podcast"
    before('', () => {
        cy.viewport(1000, 1000)
        //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
      })
  beforeEach('', () => {
    cy.visitNuxtDev('/podcasts')
    cy.login()
    cy.createPodcast(slug)
    cy.visitNuxtDev('/podcast/'+slug)
  })
  afterEach('', () => {
    cy.deletePodcast(slug)    
  })
  it('does display podcast detail', () => {
    cy.contains('h1','Podcast')
    cy.contains('A New Podcast')
  })
  it('deletes podcast, when click delete', () => {
    cy.clickLinkNuxtDev('Löschen')
    cy.contains('A New Podcast').should('not.exist')
  })
  it('opens add episode dialog, when click add', () => {
    cy.clickLinkNuxtDev('Folge hinzufügen')
    cy.contains('h1','Neue Folge')
    cy.contains('für')
    cy.contains('A New Podcast')
  })
})  