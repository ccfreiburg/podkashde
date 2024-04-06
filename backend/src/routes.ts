import { deleteQuery, getAll, getExtMany, getExtQuery, getExtQueryAll, getQuery, simpleSave, simpleSaveMultiple } from "./controller/All";
import { checkRefreshToken, checkToken, getUserToken, login, logout, setPassword } from "./controller/Auth";
import { count } from "./controller/Count";
import { setEnums } from "./controller/Enums";
import { moveEpisodeAction, saveEpisodeAction } from "./controller/Episodes";
import { copyFromLocalArchive, downloadFileAction, fetchFileAction, uploadFile } from "./controller/Files";
import Enumerator from "./entities/Enumerator";
import Episode from "./entities/Episode";
import Podcast from "./entities/Podcast";
import Serie from "./entities/Serie";
import { getRouteSlug } from "./tools/Configuration";
import { getMetadata } from "./controller/Settings";
import { generateRssAction } from "./controller/Podcast";
import { migrateEpisode } from "./controller/Migrate";
import { updateSerieAfterEpisodeChange } from "./controller/Serie";

/**
 * All application routes.
 */
export const AuthRoutes = [
    {
        path: getRouteSlug("USERTOKEN_AP"),
        method: "get",
        action: getUserToken
    },
    {
        path: getRouteSlug("REFRESH_AP"),
        method: "post",
        action: checkRefreshToken
    },
    {
        path: getRouteSlug("PASSWORD_AP"),
        method: "post",
        action: setPassword
    },
    {
        path: getRouteSlug("CHECK_TOKEN_AP"),
        method: "get",
        action: checkToken
    },
    {
        path: getRouteSlug("ENUMERATIONS_AP"),
        method: "post",
        action: setEnums
    }, 
    {
        path: getRouteSlug("EPISODE_AP"),
        method: "delete",
        action:  (req, res) => deleteQuery(Episode,req,res)
    }, 
    {
        path: getRouteSlug("EPISODE_AP"),
        method: "post",
        action: saveEpisodeAction
    },    
    {
        path: getRouteSlug("EPISODEMOVE_AP"),
        method: "post",
        action: moveEpisodeAction
    }, 
    {
        path: getRouteSlug("PODCAST_AP"),
        method: "post",
        action: (req, res) => simpleSave<Podcast>(Podcast, req, res)
    }, 
    {
        path: getRouteSlug("PODCAST_AP"),
        method: "delete",
        action:  (req, res) => deleteQuery(Podcast,req,res)
    }, 
    {
        path: getRouteSlug("SERIE_AP"),
        method: "delete",
        action:  (req, res) => deleteQuery(Serie,req,res)
    },
    {
        path: getRouteSlug("SERIES_AP"),
        method: "post",
        action:  (req, res) => simpleSaveMultiple<Serie>(Serie,req,res)
    },     
    {
        path: getRouteSlug("SERIE_AP"),
        method: "post",
        action:  (req, res) => updateSerieAfterEpisodeChange(req,res)
    }, 
    {
        path: getRouteSlug("FETCHLOCAL_AP"),
        method: "post",
        action:  fetchFileAction
    }, 
    {
        path: getRouteSlug("FROMARCHIVE_AP"),
        method: "post",
        action:  copyFromLocalArchive
    }, 
    {
        path: getRouteSlug("UPLOAD_AP"),
        method: "post",
        action:  uploadFile
    },
    {
        path: getRouteSlug("GENERATE_RSS_AP"),
        method: "get",
        action:  generateRssAction
    }, 
    {
        path: getRouteSlug("EPISODEWP_AP"),
        method: "post",
        action:  migrateEpisode
    }, 
]

export const AppRoutes = [
    {
        path: getRouteSlug("LOGIN_AP"),
        method: "post",
        action: login
    },
    {
        path: getRouteSlug("LOGOUT_AP"),
        method: "post",
        action: logout
    },
    {
        path: getRouteSlug("COUNT_AP"),
        method: "get",
        action: count
    },
    {
        path: getRouteSlug("ENUMERATIONS_AP"),
        method: "get",
        action: (req, res) => getAll(Enumerator, req, res)
    },
    {
        path: getRouteSlug("EPISODE_AP"),
        method: "get",
        action: (req, res) => getQuery(Episode, ["podcast", "serie"], req, res)
    }, 
    {
        path: getRouteSlug("EPISODES_AP"),
        method: "get",
        action: (req, res) => getExtMany(Episode, ["podcast", "serie"], req, res)
    }, 
    {
        path: getRouteSlug("PODCASTS_AP"),
        method: "get",
        action: (req, res) => getAll(Podcast, req, res)
    }, 
    {
        path: getRouteSlug("PODCAST_AP"),
        method: "get",
        action: (req, res) => getQuery(Podcast, ["episodes"], req, res)
    }, 
    {
        path: getRouteSlug("SERIES_AP"),
        method: "get",
        action: (req, res) => getExtQueryAll(Serie, {
                                    where: {},
                                    order: {
                                    lastEpisode: 'DESC'
                                    },
                                    relations: ['episodes'],
                                }, req, res)
    }, 
    {
        path: getRouteSlug("SERIE_AP"),
        method: "get",
        action: (req, res) => getQuery(Serie, ["episodes" ], req, res)
    }, 
    {
        path: getRouteSlug("FILES_AP"),
        method: "get",
        action:  downloadFileAction
    }, 
    {
        path: getRouteSlug("METADATA_AP"),
        method: "get",
        action: getMetadata
    }
];