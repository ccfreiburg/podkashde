import jwt_decode from "jwt-decode"
import { AUTHUSER_AP, LOGIN_AP, LOGOUT_AP, PASSWORD_AP, REFRESH_AP } from "../base/Constants"
import { IUser } from "../base/types/IUser"

export default () => {
    const useAuthToken = () => useState('auth_token')
    const useAuthUser = () => useState('auth_user')
    const useAuthLoading = () => useState('auth_loading', () => true)

    const setToken = (newToken: string) => {
        const authToken = useAuthToken()
        authToken.value = newToken
    }

    const setUser = (newUser: IUser) => {
        const authUser = useAuthUser()
        authUser.value = newUser
    }

    const setIsAuthLoading = (value: boolean) => {
        const authLoading = useAuthLoading()
        authLoading.value = value
    }

    const login = (username: string, password: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch(LOGIN_AP, {
                    method: 'POST',
                    body: {
                        username,
                        password
                    }
                })

                setToken(data.access_token)
                setUser(data.user)
                setTimer(360000)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    const setFirstPassword = (token: string, password: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch(PASSWORD_AP, {
                    method: 'POST',
                    body: {
                        token,
                        password
                    }
                })

                setToken(data.access_token)
                setUser(data.user)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
      
    }

    const changePassword = (username: string, password: string, oldpassword: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch(PASSWORD_AP, {
                    method: 'POST',
                    body: {
                        username,
                        password,
                        oldpassword
                    }
                })

                setToken(data.access_token)
                setUser(data.user)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
      
    }
    const refreshToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch(REFRESH_AP)

                setToken(data.access_token)
                resolve(true)
            } catch (error) {
                setToken(null)
                setUser(null)
                reject(error)
            }
        })
    }

    const getUser = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await useFetchApi(AUTHUSER_AP)

                setUser(data.user)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    const reRefreshAccessToken = () => {
        const authToken = useAuthToken()

        if (!authToken.value) {
            return
        }

        const jwt = jwt_decode(authToken.value)

        const newRefreshTime = jwt.exp - 60000
        setTimer(newRefreshTime)
    }

    const setTimer = (time: Number) => {
        setTimeout(() => {
                refreshToken().then(() => reRefreshAccessToken(), ()=>{})
            }, 
            time) //newRefreshTime);
    }

    const initAuth = () => {
        return new Promise(async (resolve, reject) => {
            setIsAuthLoading(true)
            try {
                await refreshToken()
                await getUser()

                reRefreshAccessToken()

                resolve(true)
            } catch (error) {
                console.log(error)
                reject(error)
            } finally {
                setIsAuthLoading(false)
            }
        })
    }

    const logout = () => {
        return new Promise(async (resolve, reject) => {
            try {
                await useFetchApi(LOGOUT_AP, {
                    method: 'POST'
                })

                setToken(null)
                setUser(null)
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        login,
        useAuthUser,
        useAuthToken,
        initAuth,
        useAuthLoading,
        setFirstPassword,
        changePassword,
        logout
    }
}