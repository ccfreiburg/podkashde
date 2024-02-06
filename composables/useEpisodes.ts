import {EPISODE_AP, EPISODES_AP} from '~~/base/Constants'
import type {IEpisode, IPodcast, ISerie} from '~~/base/type/*'
import { useDatas } from './useData'

const episodes = ref([] as Array<IEpisode>)

export default function useEpisodes() {
    const { loading, refresh} = useDatas( episodes, EPISODES_AP )

    if (!episodes.value)
        refresh()

    return {
        episodes,
        loading,
        refresh
    }
}


const episode = ref<IEpisode | undefined>(undefined)
const podcast = ref<IPodcast | undefined>(undefined)
const serie = ref<ISerie | undefined>(undefined)

export function useEpisode(slug:string) {
    const { refresh: dataRefresh } = useData( episode, EPISODE_AP, "?slug="+slug )
    const loading = ref(true)

    const refresh = async () => {
        loading.value = true
        await dataRefresh()
        podcast.value = episode.value?.podcast as IPodcast
        serie.value = episode.value?.serie as ISerie
        loading.value = false
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