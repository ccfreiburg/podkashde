import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'
import './cypress/support/episodeServices.js'

describe('', () => {
  const podcast_slug = "a_new_podcast"
  const episode_slug = "a_new_episode"
  const second_podcast_slug = "a_second_podcast"
  before('', () => {
    cy.viewport(1000, 1000)
    //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
  })
  beforeEach('', () => {
    cy.login().then(() => {
      cy.createPodcast(podcast_slug).then(podcast => {
        cy.createEpisode(episode_slug, podcast)
        cy.createPodcast(second_podcast_slug)
      })
    })
  })
  afterEach('', () => {
    cy.deleteEpisode(episode_slug)
    cy.deletePodcast(podcast_slug)
    cy.deletePodcast(second_podcast_slug)
  })
  it('Change Podcast for Episode', () => {
    cy.visitNuxtDev(episode_slug, [
      {
        method: 'GET',
        url: 'podcasts',
        id: 'podcasts'
      },
      {
        method: 'GET',
        url: '*episode?*',
        id: 'episode'
      },
      {
        method: 'GET',
        url: '*meta?*',
        id: 'meta'
      }
    ])
    cy.getBySel('#change').click()
    cy.getSelect('select_podcast').select(1)
    cy.getBySel('submit').click()
    cy.contains('A second Podcast')
  })
 })