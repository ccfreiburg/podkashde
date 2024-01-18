import { API_BASE, EPISODES_AP, EPISODE_AP } from "~~/base/Constants";
import type IEpisode from "~~/base/types/IEpisode";
import type IPodcast from "~~/base/types/IPodcast";
import type IPostdata from "~~/base/types/IPostdata";
import type ISerie from "~~/base/types/ISerie";

export async function useEpisodes() {
    const episodes = useState<Array<IEpisode>>('episodes', () => [] )

    const refresh = async () => {
        episodes.value = await $fetch( API_BASE + EPISODES_AP);
    }
    if (episodes.value.length<1) {
        await refresh();
    }
    return {
        episodes,
        refresh
    }
}

export async function useEpisode(slug:string) {
    const episode = useState<IEpisode>(slug, () => null )
    const podcast = useState<IPodcast>("podcast-of-"+slug, () => null )
    const serie = useState<ISerie>("serie-of-"+slug, () => null )

    const refresh = async () => {
        episode.value = await $fetch( API_BASE + EPISODE_AP+"?slug="+slug)     
        podcast.value = episode.value.podcast;
        serie.value = episode.value.serie;
    }

    if (!episode.value) {
       await refresh()
    }
    return {
        episode,
        podcast,
        serie,
        refresh,
    }
}