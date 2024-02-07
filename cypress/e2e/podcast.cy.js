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
  })
  afterEach('', () => {
    cy.deletePodcast(slug)    
  })
  it('Shows Title', () => {
    cy.contains('h1','Podcast')
    cy.contains('A New Podcast')
  })
})  