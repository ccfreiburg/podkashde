import './cypress/support/e2e.js'

describe('template spec', () => {
  beforeEach('Visit Home', () => {
    cy.visit('/en')
  })
  it('Shows Title', () => {
    cy.contains('h1','Recent Episodes')
  });
  it('Menu Sandwich Button clicked shows menu with podcasts link', () => {
    cy.wait(2000)
    cy.getBySel('NavBar.clickableElement').click({ force: true })
    cy.contains('Podcasts').should('have.attr', 'href')
    cy.getBySel('NavBar.clickableElement').click({ force: true })
    cy.contains('Podcasts').should('have.length', 0)
  });
  it('Language Button clicked shows Deutsch', () => {
    cy.wait(2000)
    cy.contains('English').click()
    cy.contains('Deutsch').click()
    cy.contains('h1','Kürzlich erschienen')
  });
})