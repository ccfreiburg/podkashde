
export async function logout() {
    cy.clearCookies()
    cy.clearAllLocalStorage()  
}

export function login() {
    cy.request({ url: 'http://localhost:3003/api/auth/login',  
            method: 'POST',  
            body: {
                username: 'Admin',
                password: 'Admin'
            }}
        ).then((response) => { 
        cy.window().then((win) => {
            win.localStorage.setItem('refresh_token', response.body.refresh_token)
            win.localStorage.setItem('auth_token', response.body.refresh_token)
            win.localStorage.setItem('user', response.body.user)
         })
    })
}