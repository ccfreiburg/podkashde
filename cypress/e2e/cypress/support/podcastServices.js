
Cypress.Commands.add('deletePodcast', (slug) => {
    const authData = JSON.parse(window.localStorage.getItem('authData'))
    cy.request({
        url: Cypress.env('apiBase') + 'podcast',
        method: 'DELETE',
        headers: {
            Credentials: true,
            Authorization: 'Bearer ' + authData.access_token,
        },
        body: {
            slug
        }
    })
})

Cypress.Commands.add('createPodcast', (slug) => {
    cy.fixture(slug).then(fixtureData => {
        const authData = JSON.parse(window.localStorage.getItem('authData'))
        cy.request({
            url: Cypress.env('apiBase') + 'podcast',
            method: 'POST',
            headers: {
                Credentials: true,
                Authorization: 'Bearer ' + authData.access_token,
            },
            body: fixtureData
        })
    })
})