import {  PODCASTS_AP, PODCAST_AP } from "~~/base/Constants";
import type IEpisode from "~~/base/types/IEpisode";
import type IPodcast from "~~/base/types/IPodcast";
import type IPostdata from "~~/base/types/IPostdata";
import type ISerie from "~~/base/types/ISerie";

export async function usePodcasts() {
    const podcasts = useState<Array<IPodcast>>('podcasts', () => [] )
    const config = useRuntimeConfig()

    const refresh = async () => {
        podcasts.value = await $fetch( config.public.apiBase + PODCASTS_AP);
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
    const podcast = useState<IPodcast | undefined>(slug, () => undefined )
    const episodes = useState<Array<IEpisode>>("episodes-of-"+slug, () => [] )
    const config = useRuntimeConfig()

    const refresh = async () => {
        const data: IPodcast = await $fetch( config.public.apiBase + PODCAST_AP+"?slug="+slug)
        podcast.value = data;
        episodes.value = data.episodes as Array<IEpisode>
    }
    const remove = async () => {
        const request : IPostdata = {
            method: "DELETE",
            body: {
                id: podcast.value?.id
            }
        }
        await $fetch( config.public.apiBase + PODCAST_AP, request as any)
        podcast.value = undefined;
    }
    if (!podcast.value) {
       await refresh()
    }
    return {
        podcast,
        episodes,
        refresh,
        remove
    }
}