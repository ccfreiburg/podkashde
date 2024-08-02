import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/podcastServices.js'

describe('', () => {
  before('', () => {
  })
  beforeEach('Visit Home', () => {
    cy.login()
    cy.visitNuxtDev('/admin/new-podcast', [
      {
        method: 'GET',
        url: '*meta?*',
        id: 'meta'
      }

    ])
  })
  
  it('New Podcast Page', () => {
    cy.contains('h1','Neu')
  })
  it('Shows All Errors on Empty Form submitted', () => {
    cy.getInput('title').type('{Enter}')
    cy.contains('Bitte ein Podcast Titelbild')
    cy.contains('Bitte einen Titel eingeben')
    cy.contains('Bitte einen Autor eingeben')
    cy.contains('Bitte einen eindeutingen Slug eingeben')
    cy.contains('Bitte den Namen der verantwortlichen Person eingeben')
    cy.contains('Bitte eine Sprache wählen')
    cy.contains('Bitten eine Podcastkategorie wählen')
    cy.contains('Bitte eine Art der Veröffentlichung wählen')
    cy.contains('Bitte die Email der verantwortlichen Person eingeben')
  })
  it('Only cover image missing', () => {
    const slug = "a_new_podcast-podcast-new-3"
    cy.getInput('title').type('title')
    cy.getInput('author').type('author')
    cy.getInput('slug').clear().type(slug)
    cy.getSelect('language').select(1)
    cy.getSelect('category').select(1)
    cy.getSelect('type').select(1)
    cy.getInput('owner_name').type('owner_name')
    cy.getInput('owner_email').type('owner@ema.il{Enter}')
    cy.contains('Bitte ein Podcast Titelbild')
    cy.contains('Bitte einen').should('not.exist')
  })
  it('Form without Errors saving', () => {
    const slug = "a_new_podcast-podcast-new-4"
    cy.intercept('GET','*generaterss?*').as('rss')
    cy.intercept('POST','upload').as('upload')
    cy.intercept('POST','podcast').as('podcast')
    cy.get('input[type=file]').selectFile('cypress/fixtures/pod-cover2.jpg', {
      action: "select",
      force: true,
    });
    cy.getInput('title').type('title')
    cy.getInput('author').type('author')
    cy.getInput('slug').clear().type(slug)
    cy.getSelect('language').select(1)
    cy.getSelect('category').select(1)
    cy.getSelect('type').select(1)
    cy.getInput('owner_name').type('owner_name')
    cy.getInput('owner_email').type('owner@ema.il{Enter}').wait(3)
    cy.waitIntercept('upload',12000)
    cy.waitIntercept('podcast')
    cy.waitIntercept('rss')
    cy.getBySel("podcast."+slug);
    cy.deletePodcast(slug)
  })
  it('Displays Error when slug already exists', () => {
    const slug = "a_new_podcast"
    cy.createPodcast(slug)
    cy.intercept('GET','count*').as('count')
    cy.getInput('slug').clear().type(slug+"{Enter}")
    cy.waitIntercept('count')
    cy.contains('Bitte einen eindeutingen Slug')
    cy.deletePodcast(slug)
  })
})