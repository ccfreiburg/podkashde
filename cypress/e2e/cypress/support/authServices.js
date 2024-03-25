export async function logout() {
    cy.clearCookies()
    cy.clearAllLocalStorage()  
}

Cypress.Commands.add('login', (password = 'AdminPassword') => {
    cy.request({ url: Cypress.env('apiBase') + 'auth/login',  
            method: 'POST',  
            body: {
                username: 'Admin',
                password
            }}
        ).then((response) => { 
            window.localStorage.setItem('authData', JSON.stringify(response.body))
            return true
         })
    })

Cypress.Commands.add('loginFlex', (username, password) => {
        cy.request({ url: Cypress.env('apiBase') + 'auth/login',  
                method: 'POST',  
                body: {
                    username,
                    password
                }}
            ).then((response) => { 
                window.localStorage.setItem('authData', JSON.stringify(response.body))
                return true
             })
        })
    