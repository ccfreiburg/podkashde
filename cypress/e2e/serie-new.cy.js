import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import './cypress/support/serieServices.js'

describe('', () => {
  before('', () => {
    cy.viewport(1000, 1400)
  })
  beforeEach('Visit Home', () => {
    cy.login()
    cy.visitNuxtDev('/admin/new-serie', [
      {
        method: 'GET',
        url: '*meta?*',
        id: 'meta'
      }

    ])
  })
  it('New Serie Page', () => {
    cy.contains('h1','Neue ')
  })
  it('Shows All Errors on Empty Form submitted', () => {
    cy.getInput('title').type('{Enter}')
    cy.contains('Bitte ein Podcast Titelbild')
    cy.contains('Bitte einen Titel eingeben')
    cy.contains('Bitte einen eindeutingen Slug eingeben')
  })
  it('Only cover image missing', () => {
    cy.getInput('title').type('title{Enter}')
    cy.contains('Bitte ein Podcast Titelbild')
    cy.contains('Bitte einen').should('not.exist')
  })
  it('Form without Errors saving', () => {
    cy.intercept('POST','series').as('series')
    cy.get('input[type=file]').selectFile('cypress/fixtures/pod-cover1.jpg', {
      action: "select",
      force: true,
    });
    cy.wait(5)
    cy.getInput('title').type('title{Enter}')
    cy.waitIntercept('series')
    cy.wait(5)
    cy.getBySel("serie.title")
    cy.deleteSerie('title')
  })
  it('Displays Error when slug already exists', () => {
    const slug = "a_new_podcast"
    cy.createSerie(slug)
    cy.intercept('GET','count*').as('count')
    cy.getInput('slug').type(slug+"{Enter}").wait('@count')
    cy.contains('Bitte einen eindeutingen Slug')
    cy.deleteSerie(slug)
  })
})