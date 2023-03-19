export interface ISettings {
  baseUrl: string
  defaultRoute: string
  menuSource: string
  skin: string
  logo: string
  logo_w: string
  nondefault: boolean
}

export async function useSettings() : Promise<Ref<ISettings>> {
  const settings = useState<ISettings>('settings', () => {return {
    baseUrl: "http://localhost:3000",
    defaultRoute: "/recent",
    menuSource: "",
    skin: "",
    logo: "/img/logo.png",
    logo_w: "/img/logo-w.png",
    closeOnScroll: false,
    nondefault: false
  }})
  if (!settings.value.nondefault) {
    const set = await $fetch("/api/settings") as Partial<ISettings>
    settings.value.nondefault = true
    if (set.baseUrl)
      settings.value.baseUrl = set.baseUrl
    if (set.defaultRoute)
      settings.value.defaultRoute = set.defaultRoute
    if (set.menuSource)
      settings.value.menuSource = set.menuSource
    if (set.skin)
      settings.value.skin = set.skin
    if (set.logo)
      settings.value.logo = set.logo
    if (set.logo_w)
      settings.value.logo_w = set.logo_w
  }
  return settings
}