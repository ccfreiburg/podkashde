
Cypress.Commands.add('deleteSerie', (slug) => {
    const authData = JSON.parse(window.localStorage.getItem('authData'))
    if (!authData) throw 'authentication failed'
    cy.request({
        url: Cypress.env('apiBase') + 'serie',
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

Cypress.Commands.add('createSerie', (slug) => {
    cy.fixture(slug).then(fixtureData => {
        const authData = JSON.parse(window.localStorage.getItem('authData'))
        if (!authData) throw 'authentication failed'
        cy.request({
            url: Cypress.env('apiBase') + 'series',
            method: 'POST',
            headers: {
                Credentials: true,
                Authorization: 'Bearer ' + authData.access_token,
            },
            body: [ fixtureData ]
        }).then( res => {
            cy.request({
                url: Cypress.env('apiBase') + 'serie',
                method: 'GET',
                body: { id: res.body.id }
            }).then( res => {
                return res.body
            })
        })
    })
})