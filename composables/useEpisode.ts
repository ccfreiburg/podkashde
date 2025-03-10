import {EPISODE_AP} from '~~/base/Constants'
import type {IEpisode} from '~~/base/types/IEpisode'
import type {IPodcast} from '~~/base/types/IPodcast'
import type {ISerie} from '~~/base/types/ISerie'

const episode = ref<IEpisode | undefined>(undefined)
const podcast = ref<IPodcast | undefined>(undefined)
const serie = ref<ISerie | undefined>(undefined)

export default function useEpisode(slug:string) {
    const { remove, refresh: dataRefresh } = useData( episode, EPISODE_AP, "?slug="+slug )
    const loading = ref(true)

    const refresh = async () => {
        loading.value = true
        await dataRefresh()
        podcast.value = episode.value?.podcast as IPodcast
        serie.value = episode.value?.serie as ISerie
        loading.value = false
    }
    if (!episode.value || episode.value.slug!==slug)
        refresh()
    return {
        episode,
        podcast,
        serie,
        remove,
        refresh,
        loading
    }
}