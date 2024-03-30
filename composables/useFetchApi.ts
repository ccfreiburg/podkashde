
export default function useFetchApi() {
    const { getToken } = useAuth()
    const { apiBase } = useRuntimeConfig().public
    return async (url: string,options: { headers?: any, body?:any, method?:any, query?:any } = {}) => {
        const headers = (options.hasOwnProperty('headers')?{ ... options.headers }:{})
        const fetchOptions =  {
            ...options,
            headers: {
                ...headers,
                Credentials: 'include',
                Authorization: `Bearer ${getToken()}`,
            }
        }
        return await $fetch( apiBase + url, fetchOptions )
    }
}