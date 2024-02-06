import { jwtPayload } from 'jwt-payloader';
import { LOGIN_AP, LOGOUT_AP, PASSWORD_AP, REFRESH_AP, TOKEN_REFRESH_TIME } from "../base/Constants"
import type { IUser } from "../base/types/IUser"


interface IAuthenticationData { 
    user: IUser | undefined, 
    refresh_token: string, 
    access_token: string 
} 

const loading = ref(true)
const user = ref()
const initialValue = {
    user: undefined,
    refresh_token: "",
    access_token: ""
}
var authData : IAuthenticationData = initialValue

export default function useAuth() {
    var timer:any = undefined
    const { apiBase } = useRuntimeConfig().public  

    const persistData = (data : IAuthenticationData) => {
        if (!data.user || data.access_token.length<1) return
        authData = data
        user.value = data.user
        if (process.client) {
            localStorage.setItem('authData', JSON.stringify(authData))
        }
    }

    const unPersistData = () => {
        if (!authData.user && process.client) {
            const json = localStorage.getItem('authData')
            authData = (json && json.startsWith("{")?JSON.parse(json):initialValue)
            user.value = authData.user
        }
    }
    
    const clearData = () => {
        user.value = undefined
        localStorage.clear()
        authData = initialValue
    }
    
    const leaveAuthenticated = ( data: IAuthenticationData ) => {
        persistData(data)
        setTimer(TOKEN_REFRESH_TIME)
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
        unPersistData()
        const myFetch = useFetchApi()
        const data = await myFetch( REFRESH_AP, {  method: 'POST', body: authData } ) as IAuthenticationData

        return leaveAuthenticated(data)
    }

    const reRefreshAccessToken = () => {
        unPersistData()
        if (!authData.refresh_token) {
            return
        }
        const request = {
            headers: {
              'content-Type': 'application/json',
              authorization: `Bearer ${authData.refresh_token}`,
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

    const logout = async () => {
        clearData()
        await useFetchApi()(LOGOUT_AP, {
            method: 'POST'
        })
    }

    const haveUser = () => {
        unPersistData()
        return user.value!=undefined
    }
    const getToken = () => {
        unPersistData()
        return authData.access_token
    }
    unPersistData()
    return {
        login,
        haveUser,
        getToken, 
        setFirstPassword,
        changePassword,
        user,
        logout
    }
}