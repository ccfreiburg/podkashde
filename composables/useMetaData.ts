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

// export interface ISettings {
//   baseUrl: string
//   defaultRoute: string
//   menuSource: string
//   skin: string
//   logo: string
//   logo_w: string
//   enableDarkOption: boolean,
//   nondefault: boolean
// }

// export async function useMetaData(locale: string) : Promise<{ccf: Ref<any>, menu: Ref<any>, settings: Ref<any>}> {
//     const { apiBase } = useRuntimeConfig().public
//     const result = await $fetch( apiBase+ 'meta?locale=' + locale )
//     const menu = ref(result?result.menu:[])
//     const ccf = ref(result?result.settings:[])

//     const settings = ref({
//       baseUrl: "http://localhost:3000",
//       defaultRoute: "/recent",
//       menuSource: "",
//       skin: "",
//       logo: "/img/logo.png",
//       logo_w: "/img/logo-w.png",
//     enableDarkOption: false,
//     closeOnScroll: false,
//     nondefault: false
//     } as ISettings)
//   return { ccf, menu, settings }
// }

// async function getSettings() {
//   const { apiBase } = useRuntimeConfig().public
//   const settings = ref()
//   if (!settings.value.nondefault) {
//     const set = await $fetch( apiBase + "/settings") as Partial<ISettings>
//     settings.value.nondefault = true
//     if (set.baseUrl)
//       settings.value.baseUrl = set.baseUrl
//     if (set.defaultRoute)
//       settings.value.defaultRoute = set.defaultRoute
//     if (set.menuSource)
//       settings.value.menuSource = set.menuSource
//     if (set.enableDarkOption)
//       settings.value.enableDarkOption = set.enableDarkOption
//     if (set.skin)
//       settings.value.skin = set.skin
//     if (set.logo)
//       settings.value.logo = set.logo
//     if (set.logo_w)
//       settings.value.logo_w = set.logo_w
//   }
//   return settings
// }