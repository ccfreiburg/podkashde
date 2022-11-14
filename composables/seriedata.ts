import { SERIES_AP, SERIE_AP } from "~~/base/Constants";
import ISerie from "~~/base/types/ISerie";
import IPostdata from "~~/base/types/IPostdata";
import IEpisode from "~~/base/types/IEpisode";


export async function useSeries(alsoEmptySeries = false) {
    const series = useState<Array<ISerie>>('series_'+alsoEmptySeries, () => [] )

    const refresh = async () => {
        series.value = await $fetch(SERIES_AP+"?empty="+alsoEmptySeries);
    }
    // if not init fetch and init
    if (series.value.length<1) {
        await refresh();
    }
    return {
        series,
        refresh
    }
}

export async function useSerie(slug:string) {
    const serie = useState<ISerie>(slug, () => null )
    const episodes = useState<Array<IEpisode>>("episodes-of-"+slug, () => [] )

    const refresh = async () => {
        const data: ISerie = await $fetch(SERIE_AP+"?slug="+slug)
        serie.value = data;
        episodes.value = data.episodes
    }
    const remove = async () => {
        const request : IPostdata = {
            method: "DELETE",
            body: {
                id: serie.value.id
            }
        }
        await $fetch(SERIE_AP, request)
        serie.value = null;
    }
    if (!serie.value) {
       await refresh()
    }
    return {
        serie,
        episodes,
        refresh,
        remove
    }
}