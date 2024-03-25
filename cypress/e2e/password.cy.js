import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import { logout } from './cypress/support/authServices.js'

describe('', () => {
  before('', () => {
    cy.viewport(1000, 1000)
    //cy.intercept('GET', '/api/meta?locale=en', async (req) => req.reply( { fixture: 'meta-en.json' }) )
  })
  beforeEach('Visit Home', () => {
    cy.login()
    cy.wait(3)
  })
  it('Cange Password displays error on two different passwords', () => {
    cy.visitNuxtDev('/admin/setpassword' )
    cy.contains('h1','Neues Passwort')
    cy.getInput('passwordOld').type('Admin')
    cy.getInput('password1').type('password')
    cy.getInput('password2').type('password2{Enter}')
    cy.contains('Die Passwörter stimmen nicht überein')
  })
  it('Cange Password password too short', () => {
    cy.visitNuxtDev('/admin/setpassword' )
    cy.contains('h1','Neues Passwort')
    cy.getInput('passwordOld').type('Admin')
    cy.getInput('password1').type('pass')
    cy.getInput('password2').type('pass{Enter}')
    cy.contains('Das Passwort soll mindestens 8 Zeichen haben')
  })
  it('Cange Password works', () => {
    cy.visitNuxtDev('/admin/setpassword' )
    cy.contains('h1','Neues Passwort')
    cy.getInput('passwordOld').type('AdminPassword')
    cy.getInput('password1').type('password')
    cy.getInput('password2').type('password{Enter}')
    logout()
    cy.login('password')
    cy.visitNuxtDev('/admin/setpassword' )
    cy.wait(3)
    cy.getInput('passwordOld').type('password')
    cy.getInput('password1').type('AdminPassword')
    cy.getInput('password2').type('AdminPassword{Enter}')
  })
  it('Invite User', () => {
    cy.visitNuxtDev('/admin/invitation')
    cy.contains('Nutzer einladen')
    cy.getInput('username').type('regularjoe{Enter}')
    cy.getTextArea('invitelinktext').invoke('val')
      .then(actualValue => {
        cy.visitNuxtDev(actualValue)
        cy.contains('h1','Neues Passwort')
        cy.getInput('password1').type('AdminPassword')
        cy.getInput('password2').type('AdminPassword{Enter}')
        cy.wait(3)
        cy.loginFlex('regularjoe','AdminPassword')
  })
})
})