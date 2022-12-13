export async function useSettings() {
  const settings = useState<Object>('settings', () => {return {
    baseUrl: "http://localhost:3000",
    defaultRoute: "/recent",
    menuSource: "",
    closeOnScroll: false,
    default: false
  }})
  if (!settings.value.default)
    settings.value = await $fetch("/api/settings")
  return settings
}