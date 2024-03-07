import type IEpisode from "~/base/types/IEpisode";
import type IPodcast from "~/base/types/IPodcast";
import { PODCAST_AP, GENERATE_RSS_AP } from "~~/base/Constants";


const episodes = ref<Array<IEpisode> | undefined>(undefined)
const podcast = ref<IPodcast | undefined>(undefined)

export default function usePodcast(slug:string) {
    const { remove, refresh: dataRefresh } = useData( podcast, PODCAST_AP, "?slug="+slug )
    const loading = ref(!podcast.value)

    const refresh = async () => {
        loading.value = true
        await dataRefresh()
        episodes.value = podcast.value?.episodes as Array<IEpisode>
        loading.value = false
    }

    const gernerateRss = async () => {
        if (!podcast.value) return
        const myFetch = useFetchApi()
        await myFetch( GENERATE_RSS_AP, { query: { slug: podcast.value.slug }})
    }

    if (!podcast.value)
        refresh()
    
    return {
        episodes,
        podcast,
        remove,
        gernerateRss,
        refresh,
        loading
    }
}