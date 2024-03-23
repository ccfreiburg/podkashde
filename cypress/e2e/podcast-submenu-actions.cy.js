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
    cy.login().then(()=>{
      cy.createPodcast(slug).then(podcast => {
        cy.visitNuxtDev('/podcast/'+podcast.slug)
      })
    })
  })
  afterEach('', () => {
    cy.deletePodcast(slug)    
  })
  it('does display podcast detail', () => {
    cy.contains('h1','Podcast')
        cy.contains('A New Podcast')
  })
  it('deletes podcast, when click delete', () => {
    cy.getBySel('#delete').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/podcasts')
    })    
    cy.contains('A New Podcast').should('not.exist')
  })
  it('opens add episode dialog, when click add', () => {
    const url = '/admin/podcast/'+slug+'/new-episode'
    cy.getBySel(url).click()
    cy.wait(3)
    cy.location().should(loc => {
      expect(loc.pathname).to.equal(url)
    })    
    cy.contains('h1','Neue Folge')
    cy.contains('für')
    cy.contains('A New Podcast')
  })
})  