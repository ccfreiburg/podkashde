require('dotenv').config()

export const DATABASE_PATH = process.env.DATABASE_PATH ?? 'data';
export const DATA_PATH = process.env.DATA_PATH ?? 'public';
export const DATABASE_FILE = process.env.DATABASE_FILE ?? "podcasts.sqlite"
export const DATAFILES_PATH = '/files/'
export const SERVER_IMG_PATH = '/s/covers/';
export const SERVER_POSTIMG_PATH = '/s/posts/';
export const SERVER_MP3_PATH = '/s/audio/';
export const FEED_SLUG = '/s/feed/';
export const UPLOAD_TEMP_PATH = '/s/upload/';

export const ARCHIV_PATH ="archiv";

export const ROUTE_PREFIX_DEFAULT = "/api/"
export const ROUTES = {
    AUTHUSER_AP: 'auth/user',
    CHECK_TOKEN_AP: 'auth/checktoken',
    CHECK_TOKEN_PARAM: '?token=',
    COUNT_AP: 'count',
    ENUMERATIONS_AP: 'enums',
    EPISODE_AP: 'episode',
    EPISODES_AP: 'episodes',
    EPISODEWP_AP: 'episodewp',
    EPISODEMOVE_AP: 'episodemove',
    FILES_AP: 'files',
    FILES_PARAM: '?path=',
    FETCHLOCAL_AP: 'fetchfile',
    FROMARCHIVE_AP: 'fromarchive',
    GENERATE_RSS_AP: 'generaterss',
    GENERATE_RSS_PARAM: '?slug=',
    LOGIN_AP: 'auth/login',
    LOGOUT_AP: 'auth/logout',
    METADATA_AP: 'meta',
    METADATA_PARAM: '?locale=',
    PASSWORD_AP: 'auth/password',
    PODCAST_AP: 'podcast',
    PODCASTS_AP: 'podcasts',
    REFRESH_AP: 'auth/refresh',
    SERIES_AP: 'series',
    SERIE_AP: 'serie',
    UPLOAD_AP: 'upload',
    USERTOKEN_AP: 'auth/usertoken',
    USERTOKEN_PARAM: '?username=%%&type=',
}

export function getRouteSlug(route: string, prepareParam = false) {
    const prefix = process.env.ROUTE_PREFIX ?? ROUTE_PREFIX_DEFAULT
    var paramName = route.replace("AP","PARAM")
    if (prepareParam && ROUTES.hasOwnProperty(paramName))
        return prefix + ROUTES[route] + ROUTES[paramName]
    return prefix + ROUTES[route]
}

export function getTokenSecret( type: string ) : string {
    switch(type) {
        case 'REFRESH': 
            return process.env.JWT_REFRESH_TOKEN_SECRET ?? "CiHbNFoNGhFZjybkKRQidWRnJdKjcHRTT8jvNTbjaBKCKBwpyCL2LBHsXq77dP"
        case 'ACCESS': 
            return process.env.JWT_ACCESS_TOKEN_SECRET ?? "N3GzpyEGdHjb9hmEfZmfCgif3jepjk5ECHsfxzEkv53mxexMQoFSyta3oL76Fsr2"
       default: 
            return process.env.JWT_URL_TOKEN_SECRET ?? "gdQD3NPk38HTvw5T3B2CzrPyRCdJkp8NcM4D3wucFoqGp8GGB5Dm84nauFaTTyjG"
    }
}

export const INVITE_TOKEN = 'invitation';
export const INVITE_TIME = '2d';
export const PWRESET_TIME = '1d';


// export const SETPASS_LINK=  'admin/setpassword?token=';
// export const WP_API_SLUG = 'wp-json/wp/v2/';
// export const WP_PER_PAGE = '?per_page=100';
// export const WP_MIN_PER_PAGE = '?per_page=1';
// export const WP_HEADER_TOTAL = 'x-wp-total';
// export const ROUTE_NEWPODCAST = 'newpodcast';
// export const NUM_PAGINATION_LINKS = 7
// export const NUM_ITEMS_PER_PAGE = 6