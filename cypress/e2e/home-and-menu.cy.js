import './cypress/support/e2e.js'

describe('template spec', () => {
  beforeEach('Visit Home', () => {
    cy.intercept('GET', '/api/episodes').as('episodes')
    cy.visitNuxtDev('/en')
    cy.waitIntercept('episodes')
  })
  it('Shows Title', () => {
    cy.contains('h1','Recent Episodes')
  });
  it('Menu Sandwich Button clicked shows menu with podcasts link', () => {
    cy.getBySel('NavBar.clickableElement').click({ force: true })
    cy.contains('Podcasts').should('have.attr', 'href')
    cy.getBySel('NavBar.clickableElement').click({ force: true })
    cy.contains('Podcasts').should('have.length', 0)
  });
  it('Language Button clicked shows Deutsch', () => {
    cy.wait(2000)
    cy.getBySel('show-locale-dropdown').click({ force: true })
    cy.getBySel('switch-locale-de').click({ force: true })
    cy.contains('Deutsch').click({ force: true })
    cy.contains('h1','Kürzlich erschienen')
  });
})