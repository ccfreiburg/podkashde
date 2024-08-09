const menu = ref(undefined)

export default function useMetaData(locale: string, load = true) {
    const {apiBase} = useRuntimeConfig().public
    const loading = ref(!menu.value)

    const refresh = async () => {
        loading.value = true
        await fetch( apiBase + 'meta?locale='+locale )
            .then(response => response.json())
            .then(response => {
                menu.value = response.menu
                loading.value = false
            })
    }
    if (!menu.value && load)
        refresh()
    return {
        menu,
        loading,
        refresh
    }
}