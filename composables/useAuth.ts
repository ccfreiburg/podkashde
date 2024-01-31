import { jwtPayload } from 'jwt-payloader';
import { LOGIN_AP, LOGOUT_AP, PASSWORD_AP, REFRESH_AP } from "../base/Constants"
import type { IUser } from "../base/types/IUser"

export default function useAuth() {
    const authToken = useState<string|undefined>('auth_token_pk', () => undefined)
    const refreshToken = useState<string|undefined>('refresh_token_pk', () => undefined)
    const authUser = useState<IUser|undefined>('auth_user_pk', () => undefined)
    const useAuthLoading = () => useState('auth_loading_pk', () => true)

    const { apiBase } = useRuntimeConfig().public

    const setToken = (newToken: string) => {
        authToken.value = newToken
        // if (process.client)
        //     localStorage.setItem('auth_token', newToken)
    }

    const getToken = () => {
        var token = authToken.value
        // if (!token && process.client)
        //     token = localStorage.getItem('auth_token') as string
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
    
    const setUser = (newUser: IUser | undefined ) => {
        authUser.value = newUser
    }

    const useAuthUser = async () => {
        if (!authUser.value && (getRefreshToken() || getToken() )) {
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
                setTimer(10000)
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
        const newRefreshTime = jwt.exp - 60000
        setTimer(newRefreshTime)
    }

    const setTimer = (time: number) => {
        setTimeout(() => {
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