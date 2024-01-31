import { EPISODES_AP, EPISODE_AP } from "~~/base/Constants";
import type IEpisode from "~~/base/types/IEpisode";
import type IPodcast from "~~/base/types/IPodcast";
import type ISerie from "~~/base/types/ISerie";

export async function useEpisodes() {
    const episodes = useState<Array<IEpisode>>('episodes', () => [] )

    const config = useRuntimeConfig()

    const refresh = async () => {
        episodes.value = await $fetch( config.public.apiBase + EPISODES_AP);
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
    const episode = useState<IEpisode | undefined>(slug, () => undefined )
    const podcast = useState<IPodcast | undefined>("podcast-of-"+slug, () => undefined )
    const config = useRuntimeConfig()

    const serie = useState<ISerie | undefined>("serie-of-"+slug, () => undefined )

    const refresh = async () => {
        episode.value = await $fetch( config.public.apiBase +  EPISODE_AP+"?slug="+slug) as IEpisode
        podcast.value = episode.value?.podcast as IPodcast
        serie.value = episode.value?.serie as ISerie
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