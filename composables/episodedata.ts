import { EPISODES_AP, EPISODE_AP } from "~~/base/Constants";
import IEpisode from "~~/base/types/IEpisode";

export async function useEpisodes() {
    const episodes = useState<Array<IEpisode>>('episodes', () => [] )

    const refresh = async () => {
        episodes.value = await $fetch(EPISODES_AP);
    }
    // if not init fetch and init
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
    const refresh = async () => {
        episode.value = await $fetch(EPISODE_AP+"?slug="+slug)     
    }
    if (!episode.value) {
       await refresh()
    }
    return {
        episode,
        refresh
    }
}