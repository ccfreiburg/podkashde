import type IEpisode from "~/base/types/IEpisode";
import type IPodcast from "~/base/types/IPodcast";
import {  PODCASTS_AP, PODCAST_AP } from "~~/base/Constants";


const podcasts = ref([] as Array<IPodcast>)

export function usePodcasts() {
    const { loading, refresh} = useDatas( podcasts, PODCASTS_AP )

    if (!podcasts.value || podcasts.value.length==0)
        refresh()

    return {
        podcasts,
        loading,
        refresh
    }
}

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

    if (!podcast.value)
        refresh()
    
    return {
        episodes,
        podcast,
        remove,
        refresh,
        loading
    }
}