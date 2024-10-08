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
    cy.intercept('GET','meta').as('meta')
    cy.login().then(() => {
        cy.createPodcast(podcast_slug)
      })
    cy.visitNuxtDev('/admin/podcast/'+podcast_slug+'/new-episode', [
      {
        method: 'GET',
        url: '*meta?*',
        id: 'meta'
      }
    ])
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
    cy.deleteEpisode('test_slug')
    cy.intercept('POST','upload').as('upload')
    cy.intercept('POST','episode').as('episode')
    cy.intercept('GET','*generaterss?*').as('rss')
    cy.intercept('GET','*enum?*').as('enum')
    cy.intercept('GET','*podcast?*').as('podcast')
    cy.get('input[name="audioFileInput"]').selectFile('cypress/fixtures/1test.mp3', {
      action: "select",
      force: true,
    });
    cy.getInput('creator').value = 'Alexander Röhm'
    cy.getInput('slug').type('{selectall}test_slug')
    cy.getInput('title').type('{Enter}')
    cy.wait(8)
    cy.waitIntercept('upload')
    cy.waitIntercept('upload')
    cy.waitIntercept('episode')
    cy.waitIntercept('rss')
    cy.waitIntercept('enum')
    cy.contains('Podcast Folgen')
    cy.contains('diesem Podcast')
    cy.contains('Welchen Tod willst du sterben? Welches Leben willst du leben?')
    cy.deleteEpisode('test_slug')
  })
})  