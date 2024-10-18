const menu = ref(undefined)

export default function useMetaData(locale: string, load = true) {
    const {apiBase} = useRuntimeConfig().public
    const loading = ref(!menu.value)

    const refreshLocale = async (local: string) => {
        loading.value = true
        await fetch( apiBase + 'meta?locale='+local )
            .then(response => response.json())
            .then(response => {
                menu.value = response.menu
                loading.value = false
            })
    }

    const refresh = async () => refreshLocale(locale)

    if (!menu.value && load)
        refresh()

    return {
        menu,
        loading,
        refresh,
        refreshLocale
    }
}