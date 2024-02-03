import { cloneVNode } from 'vue'
import './cypress/support/e2e.js'

describe('', () => {
  before('', () => {
    cy.intercept('GET', '/_nuxt/builds/meta/dev.json', { fixture: 'dev.json' })
    cy.intercept('GET', '/menu-ext-de.json', { fixture: 'menu-ext-de.json' })
  })
  beforeEach('Visit Home', () => {
    cy.visit('/admin/login')
  })
  it('Shows Title', () => {
    cy.contains('h1','Anmelden')
  })
  it('Empty Passwort', () => {
    cy.getInput('user').type('Fred{Enter}')
    cy.wait(3)
    cy.contains('Passwort oder Nutzername falsch')
  })
  it('Empty User', () => {
    cy.getInput('password').type('Fred')
    cy.getBySel('submit').click()
    cy.wait(3)
    cy.contains('Passwort oder Nutzername falsch')
  })
  it('Login', () => {
    cy.getInput('user').clear().type('Admin')
    cy.getInput('password').clear().type('Admin')
    cy.getBySel('submit').click()
    cy.wait(3)
    cy.contains('Podcasts')
    cy.contains('Neuer Podcast')
  })
  
})