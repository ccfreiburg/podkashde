import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import { login } from './cypress/support/authServices.js'
import { deletePodcast } from './cypress/support/dbCleanup.js'

describe('', () => {
  before('', () => {
  })
  beforeEach('Visit Home', () => {
    cy.visitNuxtDev('/admin/new-podcast')
    cy.login()
  })
  it('Shows Title', () => {
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
    cy.getInput('title').type('title')
    cy.getInput('author').type('author')
    cy.getSelect('language').select(1)
    cy.getSelect('category').select(1)
    cy.getSelect('type').select(1)
    cy.getInput('owner_name').type('owner_name')
    cy.getInput('owner_email').type('owner@ema.il{Enter}')
    cy.contains('Bitte ein Podcast Titelbild')
    cy.contains('Bitte einen').should('not.exist')
  })
  it('Form without Errors saving', () => {
    cy.intercept('POST','podcast').as('postPodcast')
    cy.get('input[type=file]').selectFile('cypress/fixtures/pod-cover1.jpg', {
      action: "select",
      force: true,
    });
    cy.getInput('title').type('title')
    cy.getInput('author').type('author')
    cy.getSelect('language').select(1)
    cy.getSelect('category').select(1)
    cy.getSelect('type').select(1)
    cy.getInput('owner_name').type('owner_name')
    cy.getInput('owner_email').type('owner@ema.il{Enter}')
    cy.wait('@postPodcast')
    cy.getBySel("podcast.title");
    deletePodcast('title')
  })

})