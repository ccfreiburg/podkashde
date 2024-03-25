import {EPISODES_AP} from '~~/base/Constants'
import type IEpisode from '~~/base/types/IEpisode'
import { useDatas } from './useData'

const episodes = ref([] as Array<IEpisode>)

export default function useEpisodes(directLoad = true) {
    const { loading, refresh} = useDatas( episodes, EPISODES_AP )

    if (directLoad && !episodes.value)
        refresh()

    return {
        episodes,
        loading,
        refresh
    }
}
