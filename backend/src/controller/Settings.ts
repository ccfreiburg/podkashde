import * as fs from 'fs';
import { Request, Response } from "express";
import { DATABASE_PATH, DATAFILES_PATH, EXT_MENU_AP, EXT_MENU_FILTER, EXT_MENU_BASEURL } from "../tools/Configuration";
import { sendResponse } from '../tools/Controller';
import { Any, EntityMetadata } from 'typeorm';

var menu = []
var latest_locale = ""

// Copy from ccf-web-frontend
function getLink( data: any ) : string | undefined {    
    if (!data) return undefined
    if (data.url) return data.url
    if (data.page) return (data.page.locale=="de"? "/" + data.page.slug:"/" + data.page.locale + "/" + data.page.slug)
    if (data.article) return (data.article.locale=="de"? "/article/" + data.article.slug : "/" +data.article.locale + "/article/" + data.article.slug)
  return undefined
}
//

function linkGenerator( section: any ) : any {
    const linker =  item => { 
        if (!item.link || item.link.length <1) {
            const link = getLink(item)
            if (link)
                item.link = (link.startsWith("http")?link:EXT_MENU_BASEURL + link)
        }
    }
    linker(section)
    section.menu_items.forEach(element => linker(element));
    return section
}

async function getExternalMenu( locale: string ) : Promise<any> {
    if (!EXT_MENU_AP.startsWith('http')) return []
    const url = EXT_MENU_AP.replace("locale",locale)
    const result = await fetch(url)
    const ext_menu = await result.json() as Array<any>
    return ext_menu.filter(( item: any ) => !item.link || item.link.toLowerCase().indexOf(EXT_MENU_FILTER?.toLowerCase()) === -1).map(linkGenerator)
}
async function getLocalMenu( locale: string ) : Promise<any> {
    const meta = JSON.parse(fs.readFileSync(DATABASE_PATH + DATAFILES_PATH + 'meta-'+locale+'.json',{encoding:'utf8', flag:'r'}));
    return meta.menu
}

export async function getMetadata(request: Request, response: Response) {
    const locale = request.query.locale as string
    if (menu.length<1 || latest_locale!=locale) {
        latest_locale = locale
        const ext_menu = await getExternalMenu(locale)
        const loc_menu = await getLocalMenu(locale)
        menu = ext_menu.concat(loc_menu)       
    }
    sendResponse( response, { menu })
}