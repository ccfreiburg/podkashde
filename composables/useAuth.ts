import { jwtPayload } from 'jwt-payloader';
import { LOGIN_AP, LOGOUT_AP, PASSWORD_AP, REFRESH_AP, TOKEN_REFRESH_TIME } from "../base/Constants"
import type { IUser } from "../base/types/IUser"
import { checkToken } from '~/backend/src/controller/Auth';

export default function useAuth() {
    const authToken = useState<string|undefined>('auth_token_pk', () => undefined)
    const refreshToken = useState<string|undefined>('refresh_token_pk', () => undefined)
    const authUser = useState<IUser|undefined>('auth_user_pk', () => undefined)
    const useAuthLoading = () => useState('auth_loading_pk', () => true)
    var timer:any = undefined

    const { apiBase } = useRuntimeConfig().public

    const setToken = (newToken: string) => {
        authToken.value = newToken
        if (process.client)
            localStorage.setItem('auth_token', newToken)
    }

    const getToken = () => {
        var token = authToken.value
        if (!token && process.client)
            token = localStorage.getItem('auth_token') as string
        return token
    }

    const setRefreshToken = (newToken: string) => {
        refreshToken.value = newToken
        if (process.client)
             localStorage.setItem('refresh_token', newToken)
    }

    const getRefreshToken = () => {
        var token = refreshToken.value 
        if (!token && process.client)
             token = localStorage.getItem('refresh_token') || undefined
        return token
    }

    const clearTokens = () => {
        refreshToken.value = undefined
        localStorage.clear()
        authToken.value = undefined
        authUser.value = undefined
    }
    
    const setUser = (newUser: IUser) => {
        authUser.value = newUser
        if (process.client)
             localStorage.setItem('user', JSON.stringify(newUser))
    }

    const useAuthUser = async () => {
        if (!authUser.value && process.client) {
            const user = localStorage.getItem('user')
            authUser.value = (user && user.startsWith("{")?JSON.parse(user):undefined)
        }
        if (authUser.value && getToken()) {
            if (!timer) setTimer()
            return authUser
        } else if (getRefreshToken()) {
            try {
                await refreshTheToken().then(()=>reRefreshAccessToken())
            }
            catch {}
        }
        return authUser
    }

    const setIsAuthLoading = (value: boolean) => {
        const authLoading = useAuthLoading()
        authLoading.value = value
    }

    const login = (username: string, password: string) => {
        
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch( apiBase + LOGIN_AP, {
                    method: 'POST',
                    body: {
                        username,
                        password
                    }
                }) as { user: IUser, refresh_token: string, access_token: string } 
                setToken(data.access_token)
                setRefreshToken(data.refresh_token)
                setUser(data.user)
                setTimer(TOKEN_REFRESH_TIME)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    const setFirstPassword = (token: string, password: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await useFetchApi()( PASSWORD_AP, {
                    method: 'POST',
                    body: {
                        token,
                        password
                    }
                }) as { user: IUser, refresh_token: string, access_token: string } 

                setToken(data.access_token)
                setRefreshToken(data.refresh_token)
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
                const data = await useFetchApi()( PASSWORD_AP, {
                    method: 'POST',
                    body: {
                        username,
                        password,
                        oldpassword
                    }
                }) as { user: IUser, refresh_token: string, access_token: string } 

                setToken(data.access_token)
                setRefreshToken(data.refresh_token)
                setUser(data.user)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
      
    }
    const refreshTheToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const myFetch = useFetchApi()
                const data = await myFetch( REFRESH_AP, {  method: 'POST', body: { refresh_token: getRefreshToken()}} )  as { user: IUser, refresh_token: string, access_token: string } 

                setToken(data.access_token)
                setRefreshToken(data.refresh_token)
                setUser(data.user)

                resolve(true)
            } catch (error) {
                setToken("")
                setUser(undefined)
                reject(error)
            }
        })
    }

    const reRefreshAccessToken = () => {
        const authToken = getToken()

        if (!authToken) {
            return
        }
        const request = {
            headers: {
              'content-Type': 'application/json',
              authorization: `Bearer ${authToken}`,
            },
          };
        const jwt = jwtPayload(request)
        const newRefreshTime = jwt.exp - TOKEN_REFRESH_TIME
        setTimer(newRefreshTime)
    }

    const setTimer = (time: number) => {
        timer = setTimeout(() => {
            refreshTheToken().then(() => reRefreshAccessToken(), ()=>{})
            }, 
            time);
    }

    const initAuth = () => {
        return new Promise(async (resolve, reject) => {
            setIsAuthLoading(true)
            try {
                await refreshTheToken()
                // await getUser()

                reRefreshAccessToken()

                resolve(true)
            } catch (error) {
                reject(error)
            } finally {
                setIsAuthLoading(false)
            }
        })
    }

    const logout = () => {
        return new Promise(async (resolve, reject) => {
            try {
                await useFetchApi()(LOGOUT_AP, {
                    method: 'POST'
                })
                clearTokens()
            } catch (error) {
            }
        })
    }

    return {
        login,
        useAuthUser,
        initAuth,
        getToken,
        getRefreshToken,
        useAuthLoading,
        setFirstPassword,
        changePassword,
        logout
    }
}