import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'

describe('', () => {
    const podcast_slug = "a_new_podcast"
    before('', () => {
        cy.viewport(1000, 1000)
        //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
      })
  beforeEach('', () => {
    cy.visitNuxtDev('/podcasts')
    cy.login()
    cy.createPodcast(podcast_slug)
    cy.visitNuxtDev('/admin/podcast/'+podcast_slug+'/new-episode')
  })
  afterEach('', () => {
    cy.deletePodcast(podcast_slug)    
  })
  it('does display new episode page', () => {
    cy.contains('h1','Neue Folge')
    cy.contains('A New Podcast')
  })
  it('deletes podcast, when click delete', () => {
  })
})  