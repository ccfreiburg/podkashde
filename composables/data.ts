import { PODCASTS_AP } from "~~/base/Constants";
import { IPodcast } from "~~/base/types/IPodcast";
import podcasts from "~~/server/api/podcasts";

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
    const podcast = useState<IPodcast>(slug, () => null)
    const { refresh: prefrsh,  podcasts } = await usePodcasts();

    const findSlug = () => podcasts.value.find( (p) => p.slug === slug )
    const refresh = () => {
        prefrsh()
        podcast.value = findSlug()
    }
    if (!podcast.value) {
        podcast.value = findSlug()
    }
    return {
        podcast,
        refresh
    }
}