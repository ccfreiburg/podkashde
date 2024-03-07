import type IPodcast from "~/base/types/IPodcast";
import {  PODCASTS_AP } from "~~/base/Constants";

const podcasts = ref([] as Array<IPodcast>)

export default function usePodcasts() {
    const { loading, refresh} = useDatas( podcasts, PODCASTS_AP )

    if (!podcasts.value || podcasts.value.length==0)
        refresh()

    return {
        podcasts,
        loading,
        refresh
    }
}