import { url } from "inspector"
import { allowedNodeEnvironmentFlags } from "process"
import { isAsExpression } from "typescript"
import { URL } from "url"
import { checkAuthentication } from "../services/sessionService"

export default defineEventHandler( async (event) => {
    const cookies = useCookies(event)
    console.log("hi there" + event.req.url + " "+ event.req.method)
    const urlmatcher = /^(?:(?:(([^:\/#\?]+:)?(?:(?:\/\/)(?:(?:(?:([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((?:\/?\/api(?:[^\/\?#]+\/+)*)(?:[^\?#]*)))?(\?[^#]+)?)(#.*)?/
    const match = urlmatcher.exec(event.req.url)
    if (match && event.req.method!="GET") {
        const path = match[8]
        console.log(event.req.method + " " +event.req.url+ " " + path)
        const allowedRoutes = [
            "/api/login",
            "/api/logout",
            "/api/session"
        ]
        if (!allowedRoutes.includes(path)) {
            console.log("Checking")
            if (! cookies.auth_token)
                throw new Error("Not authenticated")
            if (! await checkAuthentication(cookies.auth_token,-1)) {
                setCookie(event, 'auth_token', null)
                throw new Error("Not authenticated")
            }
        }
    }
})
  