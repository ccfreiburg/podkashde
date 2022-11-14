import {
    WP_API_SLUG,
    WP_PER_PAGE,
    WPEPISODES_AP,
    WP_MIN_PER_PAGE,
    WP_HEADER_TOTAL
  } from "~~/base/Constants";
import ProgressInfo from "~~/base/types/ProgressInfo";
  
export interface IWpKeyValue {
    value: number;
    text: string;
    id: number;
    item: Object;
}
export class WpMetadata {
    constructor() {
        this.series =  new Array<IWpKeyValue>();
        this.speakers =new Array<IWpKeyValue>();
        this.tags = new Array<IWpKeyValue>();
    }
    public series: Array<IWpKeyValue>;
    public speakers: Array<IWpKeyValue>;
    public tags: Array<IWpKeyValue>;
}

async function wpCount(wpApiUrl: string): Promise<number> {
    var url = (wpApiUrl.includes("?")? wpApiUrl + WP_MIN_PER_PAGE.replace("?","&"): wpApiUrl + WP_MIN_PER_PAGE);
    const response = await $fetch.raw(url);
    return Number(response.headers.get(WP_HEADER_TOTAL))
}

async function wpFetchAll(wpApiUrl: string){
    var url = (wpApiUrl.includes("?")? wpApiUrl + WP_PER_PAGE.replace("?","&"): wpApiUrl + WP_PER_PAGE);
    var response = await $fetch.raw<Array<any>>(url);
    var countRows = Number(response.headers.get(WP_HEADER_TOTAL))
    var page = 1;
    var list = new Array<any>();
    response._data.forEach((row)=>list.push(row))
    while (list.length<countRows) {
        page++;
        response = await $fetch.raw<Array<any>>(url+"&page="+page);
        response._data.forEach((row)=>list.push(row))
    }
    return list;
}

async function getWpKeyValue(wpApiBaseUrl: string, category: string) {
        const list = await wpFetchAll(wpApiBaseUrl + WP_API_SLUG + category);
        return (list as Array<any>).map((item) => {
          return { value: item.id, text: item.name, ...item };
    });
}

export async function useWpMetadata(wpApiBaseUrl: string, progress: (p:ProgressInfo)=>void) {
    const wpm = useState<WpMetadata>('wpMetadata', () => new WpMetadata() )

    const refresh = async () => {
        progress({message: "Loading Series"})
        wpm.value.series = await getWpKeyValue(wpApiBaseUrl, "series");
        progress({message: "Loading Speaker"})
        wpm.value.speakers = await getWpKeyValue(wpApiBaseUrl, "speaker");
        progress({message: "Loading Tags"})
        wpm.value.tags = await getWpKeyValue(wpApiBaseUrl, "tags");
    }
    // if not init fetch and init
    if (wpm.value.series.length<1 && wpm.value.speakers.length<1 && wpm.value.tags.length<1) {
        await refresh();
    }
    return {
        wpm,
        refresh
    }
}

export async function useWpEpisodes(wpApiBaseUrl: string, seriesId: number) {
    const episodes = useState<Array<any>>('episodes_in_'+seriesId, ()=>[] )

    const refresh = async () => {
        var url = wpApiBaseUrl + WP_API_SLUG + "posts?series=" + seriesId;
        episodes.value = await wpFetchAll(url)
    }
    // if not init fetch and init
    if (episodes.value.length<1) {
        await refresh();
    }
    return episodes
}

export async function useWpEpisodeCount(wpApiBaseUrl: string, seriesId: number) {
    const count = useState<number>('episode_count_in_'+seriesId, ()=>(-1) )
    //posts?series=312&per_page=1
    const refresh = async () => {
        var url = wpApiBaseUrl + WP_API_SLUG + "posts?series=" + seriesId;
        count.value = await wpCount(url)
    }
    // if not init fetch and init
    if (count.value<0) {
        await refresh();
    }
    return count
}

