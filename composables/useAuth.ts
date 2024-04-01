import { jwtPayload } from 'jwt-payloader';
import { LOGIN_AP, LOGOUT_AP, PASSWORD_AP, REFRESH_AP, TOKEN_REFRESH_TIME } from "../base/Constants"
import type { IUser } from "../base/types/IUser"

var refreshTime : number = TOKEN_REFRESH_TIME
var refreshTimer:any = undefined

interface IAuthenticationData { 
    user: IUser | undefined, 
    refresh_token: string, 
    access_token: string,
    last_refreshed: number
} 

const loading = ref(true)
const user = ref()
const initialValue = {
    user: undefined,
    refresh_token: "",
    access_token: "",
    last_refreshed: 0
}
var authData : IAuthenticationData = initialValue

export default function useAuth( onetimeToken: String | undefined = undefined ) {
    const { apiBase } = useRuntimeConfig().public  

    const persistData = (data : IAuthenticationData) => {
        if (!data.user || data.access_token.length<1) return
        authData = data
        user.value = data.user
        if (process.client) {
            localStorage.setItem('authData', JSON.stringify(authData))
        }
    }

    const readPersistedData = () => {
        if (process.client) {
            const json = localStorage.getItem('authData')
            authData = (json && json.startsWith("{")?JSON.parse(json):initialValue)
            user.value = authData.user
        }
    }
  
    const clearData = () => {
        localStorage.clear()
        authData = initialValue
        user.value = undefined
    }
    
    const leaveAuthenticated = ( data: IAuthenticationData ) => {
        setTimer(refreshTime)
        data.last_refreshed = Date.now()
        persistData(data)
        return data.user != undefined
    }

    const login = async (username: string, password: string) => {      
        const data = await $fetch( apiBase + LOGIN_AP, {
                method: 'POST',
                body: {
                    username,
                    password
                }
            }) as IAuthenticationData
        return leaveAuthenticated(data)
    }

    const setFirstPassword = async (token: string, password: string) => {
        const data = await useFetchApi()( PASSWORD_AP, {
            method: 'POST',
            body: {
                token,
                password
            }
        }) as IAuthenticationData
        return leaveAuthenticated(data)
    }

    const changePassword = async (username: string, password: string, oldpassword: string) => {
        const data = await useFetchApi()( PASSWORD_AP, {
            method: 'POST',
            body: {
                username,
                password,
                oldpassword
            }
        }) as IAuthenticationData
        return leaveAuthenticated(data)
    }

    const refreshTheToken = async () => {
        readPersistedData()
        if (!hasAuthData()) return false
        const myFetch = useFetchApi()
        try {
            const data = await myFetch( REFRESH_AP, {  method: 'POST', body: authData } ) as IAuthenticationData
            return leaveAuthenticated(data)
        } catch {
            clearData()
            return false;
        }
    }

    const reRefreshAccessToken = () => {
        readPersistedData()
        if (!hasAuthData()) return false
        const request = {
            headers: {
              'content-Type': 'application/json',
              authorization: `Bearer ${authData.refresh_token}`,
            },
          };
        const jwt = jwtPayload(request)
        const newRefreshTime = jwt.exp - refreshTime
        setTimer(newRefreshTime)
    }

    const setTimer = (time: number) => {
        refreshTimer = setTimeout(
                refreshTheToken,
                time);
    }

    const logout = async () => {
        await useFetchApi()(LOGOUT_AP, {
            method: 'POST'
        })
        clearData()
    }
    
    const isSuperAdmin = () :boolean => {
        return (user.value && user.value.username.toLowerCase().startsWith('admin'))
    }

    const hasAuthData = () :boolean => {
        return authData.access_token!="" && authData.refresh_token!=""
    }
    
    const haveUser = () => {
        return user.value!=undefined
    }
    const getToken = () => {
        return authData.access_token
    }

    readPersistedData()
    if (haveUser() && authData.last_refreshed<Date.now()-refreshTime) 
    
    if (!refreshTimer)
        setTimer(50)
    return {
        login,
        haveUser,
        isSuperAdmin,
        getToken, 
        setFirstPassword,
        changePassword,
        user,
        logout
    }
}