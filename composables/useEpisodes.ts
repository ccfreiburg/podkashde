import {EPISODE_AP, EPISODES_AP} from '~~/base/Constants'
import type {IEpisode, IPodcast, ISerie} from '~~/base/type/*'

const episodes = ref([] as Array<IEpisode>)
const episode = ref<IEpisode | undefined>(undefined)
const podcast = ref<IPodcast | undefined>(undefined)
const serie = ref<ISerie | undefined>(undefined)

export default function useEpisodes() {
    const {apiBase} = useRuntimeConfig().public
    const loading = ref(!episodes.value)

    const refresh = async () => {
        loading.value = true
        await fetch( apiBase + EPISODES_AP )
            .then(response => response.json())
            .then(response => {
                episodes.value = response
                loading.value = false
            })
    }
    if (!episodes.value)
        refresh()
    return {
        episodes,
        loading,
        refresh
    }
}

export function useEpisode(slug:string) {
    const {apiBase} = useRuntimeConfig().public
    const loading = ref(!episode.value)
    const refresh = async () => {
        loading.value = true
        await fetch( apiBase + EPISODE_AP+"?slug="+slug )
            .then(response => response.json())
            .then(response => {
                console.log(response)
                episode.value = response
                podcast.value = episode.value?.podcast as IPodcast
                serie.value = episode.value?.serie as ISerie
                loading.value = false
             })
    }
    if (!episodes.value)
        refresh()
    return {
        episode,
        podcast,
        serie,
        refresh,
        loading
    }
}