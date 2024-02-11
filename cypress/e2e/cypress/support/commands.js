// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.ts

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid='${selector}']`, ...args)
})

Cypress.Commands.add('getInput', (selector, ...args) => {
  return cy.get(`input[name='${selector}']`, ...args)
})
Cypress.Commands.add('getSelect', (selector, ...args) => {
  return cy.get(`select[name='${selector}']`, ...args)
})
Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args)
})

Cypress.Commands.add('visitNuxtDev', (url) => {
  if (Cypress.env('NUXT_MODE') == 'development'){
    cy.intercept('GET', '/_nuxt/builds/meta/dev.json').as('nuxtDev')
    cy.visit(url).wait('@nuxtDev')
  } else
    cy.visit(url)
})

Cypress.Commands.add('clickLinkNuxtDev', (text) => {
  if (Cypress.env('NUXT_MODE') == 'development'){
    cy.intercept('GET', '/_nuxt/builds/meta/dev.json').as('nuxtDev')
    cy.contains(text).trigger('mouseover').wait(3).click().wait('@nuxtDev')
  } else {
    cy.wait(3)
    cy.contains(text).click()
  }
})
