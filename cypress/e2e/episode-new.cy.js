import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'
import './cypress/support/episodeServices.js'

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
  it('When submitting empty form, displays all validation errrors', () => {
    cy.getInput('title').type('{Enter}')
    cy.contains('Bitte ein Podcast Titelbild mit 1400x1400 Pixel auswählen')
    cy.contains('Bitte einen Titel eingeben')
    cy.contains('Bitte einen Autor eingeben')
    cy.contains('Bitte einen Slug eingeben, der noich nicht verwendet wurd')
  })
  it('Saves correct Episode with MP3 Tags into Podcast', ()=>{
    cy.intercept('POST','episode').as('postEpisode')
    cy.intercept('POST','upload').as('upload')
    cy.get('input[name="audioFileInput"]').selectFile('cypress/fixtures/1test.mp3', {
      action: "select",
      force: true,
    });
    cy.getInput('creator').value = 'Alexander Röhm'
    cy.getInput('slug').type('{selectall}test_slug')
    cy.getInput('slug').type('{Enter}')
    cy.wait('@upload')
    cy.wait('@postEpisode')
    cy.contains('Podcast Folgen')
    cy.contains('diesem Podcast')
    cy.contains('Welchen Tod willst du sterben? Welches Leben willst du leben?')
    cy.deleteEpisode('test_slug')
  })
})  