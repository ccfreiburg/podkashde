import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'
import './cypress/support/episodeServices.js'

describe('', () => {
  const podcast_slug = "a_new_podcast"
  const episode_slug = "a_new_episode"
  before('', () => {
    cy.viewport(1000, 1000)
    //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
  })
  beforeEach('', () => {
    cy.login().then(() => {
      cy.visitNuxtDev('/podcasts')
      cy.createPodcast(podcast_slug).then(podcast => {
        cy.createEpisode(episode_slug, podcast)
      })
      cy.visitNuxtDev('/admin/' + episode_slug)
    })
  })
  afterEach('', () => {
    cy.deleteEpisode(episode_slug)
    cy.deletePodcast(podcast_slug)
  })
  it('does display episode page', () => {
    cy.contains('A New Podcast')
  })
})