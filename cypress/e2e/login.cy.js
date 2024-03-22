import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import { logout } from './cypress/support/authServices.js'

describe('', () => {
  before('', () => {
    cy.viewport(1000, 1000)
    //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
  })
  beforeEach('Visit Home', () => {
    logout()
    cy.visitNuxtDev('/admin/login')
    cy.intercept('POST', '/api/auth/login').as('apilogin')
  })
  it('Shows Title', () => {
    cy.contains('h1','Anmelden')
  })
  it('Empty Passwort', () => {
    cy.getInput('user').type('Fred{Enter}') 
    cy.waitIntercept('apilogin').then((interception) => {
      expect(interception.response.statusCode).to.eq(400)
      expect(interception.response.body).to.not.have.property('access_token')
    })
    cy.contains('Passwort oder Nutzername falsch')
  })
  it('Empty User', () => {
    cy.getInput('password').type('Fred')
    cy.getBySel('submit').click()
    cy.waitIntercept('apilogin').then((interception) => {
      expect(interception.response.statusCode).to.eq(400)
      expect(interception.response.body).to.not.have.property('access_token')
    })
    cy.contains('Passwort oder Nutzername falsch')
  })
  it('Login', () => {
    cy.getInput('user').clear().type('Admin')
    cy.getInput('password').clear().type('Admin')
    cy.getBySel('submit').click()
    cy.waitIntercept('apilogin').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body).to.have.property('access_token')
    })
    cy.contains('Podcasts')
    cy.contains('Neuer Podcast')
  })
  
})