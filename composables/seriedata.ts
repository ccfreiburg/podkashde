import { SERIES_AP, SERIE_AP } from "~~/base/Constants";
import ISerie from "~~/base/types/ISerie";
import IPostdata from "~~/base/types/IPostdata";


export async function useSeries() {
    const series = useState<Array<ISerie>>('serie', () => [] )

    const refresh = async () => {
        series.value = await $fetch(SERIES_AP);
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
    const refresh = async () => {
        const data: ISerie = await $fetch(SERIE_AP+"?slug="+slug)
        serie.value = data;
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
        refresh,
        remove
    }
}