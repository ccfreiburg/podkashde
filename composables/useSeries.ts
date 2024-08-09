import { SERIES_AP } from "~~/base/Constants";
import type ISerie from "~~/base/types/ISerie";


const series = ref([] as Array<ISerie>)

export function useSeries(alsoEmptySeries = true, directLoad = true) {
    const { loading, refresh } = useDatas( series, SERIES_AP+"?empty="+alsoEmptySeries )

    if (directLoad && (!series.value || series.value.length==0))
        refresh()

    return {
        series,
        loading,
        refresh
    }
}