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

const nuxt_timeouts = 20000
const interception_timeouts = 6000

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

Cypress.Commands.add('waitIntercept', (interception, duration = interception_timeouts) => {
  cy.wait('@'+interception, {timeout: duration})
})

function setInterceptions(interceptions = []) {
  for(var i=0; i<interceptions.length; i++) {
    cy.intercept(interceptions[i].method, interceptions[i].url).as(interceptions[i].id)
  }
}

function waitInterceptions(interceptions = []) {
  for(var i=0; i<interceptions.length; i++) {
    cy.waitIntercept(''+interceptions[i].id)
  }
}

Cypress.Commands.add('visitNuxtDev', (url, interceptions = []) => {
  setInterceptions(interceptions)
  if (Cypress.env('NUXT_MODE') == 'development'){
    cy.intercept('GET', '/_nuxt/builds/meta/dev.json').as('nuxtDev')
    cy.visit(url).wait('@nuxtDev', {timeout: nuxt_timeouts})
  } else {
    cy.visit(url)
   }
   waitInterceptions(interceptions)
})

Cypress.Commands.add('clickLinkNuxtDev', (text, interceptions = []) => {
  setInterceptions(interceptions)
  if (Cypress.env('NUXT_MODE') == 'development'){
    cy.intercept('GET', '/_nuxt/builds/meta/dev.json').as('nuxtDev')
    cy.contains(text).trigger('mouseover').wait(3).click()
    cy.wait('@nuxtDev', {timeout: nuxt_timeouts})
  } else {
    cy.contains(text).trigger('mouseover').wait(3).click()
  }
  waitInterceptions(interceptions)
})

Cypress.Commands.add('clickSelectorNuxtDev', (text, interceptions = []) => {
  setInterceptions(interceptions)
  if (Cypress.env('NUXT_MODE') == 'development'){
    cy.intercept('GET', '/_nuxt/builds/meta/dev.json').as('nuxtDev')
    cy.getBySel(text).click()
    cy.wait('@nuxtDev', {timeout: nuxt_timeouts})
  } else {
    cy.contains(text).click()
  }
  waitInterceptions(interceptions)
})