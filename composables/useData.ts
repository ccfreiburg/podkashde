
export function useDatas( datas: Ref<Array<any>>, apiSlug: string ) {
    const {apiBase} = useRuntimeConfig().public
    const loading = ref(!datas.value || datas.value.length==0)

    const refresh = async () => {
        loading.value = true
        await fetch( apiBase + apiSlug )
            .then(response => response.json())
            .then(response => {      
                datas.value = response
                loading.value = false
            })
    }

    return {
        datas,
        loading,
        refresh
    }
}

export function useData( data: Ref<any>, apiSlug: string, query: string ) {
    const {apiBase} = useRuntimeConfig().public
    const loading = ref(!data.value)

    const refresh = async () => {
        loading.value = true
        await fetch( apiBase + apiSlug + query )
            .then(response => response.json())
            .then(response => {
                data.value = response
                loading.value = false
            })
    }

    const remove = async () => {
        const myFetch = useFetchApi()
        await myFetch( apiSlug, { method: 'DELETE', body: { id: data.value?.id } } )
        data.value = undefined
    }

    const save = async () => {
        const myFetch = useFetchApi()
        await myFetch( apiSlug, { method: 'POST', body: { ... data.value } } )
    }

    return {
        data,
        loading,
        remove, 
        save,
        refresh
    }
}
