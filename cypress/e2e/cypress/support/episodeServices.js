
Cypress.Commands.add('deleteEpisode', (slug) => {
    const authData = JSON.parse(window.localStorage.getItem('authData'))
    if (!authData) throw 'authentication failed'
    cy.request({
        url: Cypress.env('apiBase') + 'episode',
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

var currentEpisode = {}

Cypress.Commands.add('createEpisode', (slug, podcast) => {
    cy.fixture(slug).then(fixtureData => {
        var currentEpisode = {...fixtureData}
        currentEpisode.podcast = podcast
        const authData = JSON.parse(window.localStorage.getItem('authData'))
        if (!authData) throw 'authentication failed'
        cy.request({
            url: Cypress.env('apiBase') + 'episode',
            method: 'POST',
            headers: {
                Credentials: true,
                Authorization: 'Bearer ' + authData.access_token,
            },
            body: currentEpisode
        }).then( res => {
            currentEpisode.id = res.body.id
        })
    })
})