import { PODCASTS_AP, PODCAST_AP } from "~~/base/Constants";
import IEpisode from "~~/base/types/IEpisode";
import { IPodcast } from "~~/base/types/IPodcast";

export async function usePodcasts() {
    const podcasts = useState<Array<IPodcast>>('podcasts', () => [] )

    const refresh = async () => {
        podcasts.value = await $fetch(PODCASTS_AP);
    }
    // if not init fetch and init
    if (podcasts.value.length<1) {
        await refresh();
    }
    return {
        podcasts,
        refresh
    }
}

export async function usePodcast(slug:string) {
    const podcast = useState<IPodcast>(slug, () => null )
    const refresh = async () => {
        podcast.value = await $fetch(PODCAST_AP+"?slug="+slug)     
    }
    if (!podcast.value) {
       await refresh()
    }
    return {
        podcast,
        refresh
    }
}