import { PODCASTS_AP, PODCAST_AP } from "~~/base/Constants";
import IEpisode from "~~/base/types/IEpisode";
import IPodcast from "~~/base/types/IPodcast";
import IPostdata from "~~/base/types/IPostdata";
import ISerie from "~~/base/types/ISerie";

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
    const episodes = useState<Array<IEpisode>>("episodes-of-"+slug, () => [] )
    const series = useState<Array<ISerie>>("series-of-"+slug, () => [] )
    const refresh = async () => {
        const data: IPodcast = await $fetch(PODCAST_AP+"?slug="+slug)
        podcast.value = data;
        episodes.value = data.episodes
        series.value = data.series
    }
    const remove = async () => {
        const request : IPostdata = {
            method: "DELETE",
            body: {
                id: podcast.value.id
            }
        }
        await $fetch(PODCAST_AP, request)
        podcast.value = null;
    }
    if (!podcast.value) {
       await refresh()
    }
    return {
        podcast,
        episodes,
        series,
        refresh,
        remove
    }
}