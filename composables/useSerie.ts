import { SERIE_AP } from "~~/base/Constants";
import type {ISerie} from "~~/base/types/ISerie";
import type {IEpisode} from "~/base/types/IEpisode";

const episodes = ref<Array<IEpisode> | undefined>(undefined)
const serie = ref<ISerie | undefined>(undefined)

export default function useSerie(slug:string) {
    const { remove, refresh: dataRefresh } = useData( serie, SERIE_AP, "?slug="+slug )
    const loading = ref(!serie.value)

    const refresh = async () => {
        loading.value = true
        await dataRefresh()
        episodes.value = serie.value?.episodes as Array<IEpisode>
        loading.value = false
    }

    if (!serie.value || serie.value.slug!==slug)
        refresh()
    
    return {
        episodes,
        serie,
        remove,
        refresh,
        loading
    }
}