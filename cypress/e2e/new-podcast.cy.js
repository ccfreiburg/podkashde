import './cypress/support/e2e.js'
import './cypress/support/authServices.js'
import { login } from './cypress/support/authServices.js'

describe('', () => {
  beforeEach('Visit Home', () => {
    login()
    cy.visitNuxtDev('/admin/new-podcast')
  })
  it('Shows Title', () => {
    cy.contains('h1','Neu')
  })
 
})