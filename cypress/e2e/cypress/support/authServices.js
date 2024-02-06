export async function logout() {
    cy.clearCookies()
    cy.clearAllLocalStorage()  
}

Cypress.Commands.add('login', () => {
    cy.request({ url: Cypress.env('apiBase') + 'auth/login',  
            method: 'POST',  
            body: {
                username: 'Admin',
                password: 'Admin'
            }}
        ).then((response) => { 
            window.localStorage.setItem('authData', JSON.stringify(response.body))
         })
    })
