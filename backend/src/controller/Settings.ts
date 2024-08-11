import * as fs from 'fs';
import { Request, Response } from "express";
import { DATABASE_PATH, DATAFILES_PATH, EXT_MENU_AP, EXT_MENU_FILTER, EXT_MENU_BASEURL } from "../tools/Configuration";
import { sendResponse } from '../tools/Controller';
import { Any, EntityMetadata } from 'typeorm';

var menu = []

function linkGenerator( section: any ) : any {
    const linker =  item => { 
        if (!item.link || item.link.length <1)
            if (item.page && item.page.slug && item.page.slug.length > 0)
                item.link = EXT_MENU_BASEURL + item.page.slug
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
    const locale = request.query.locale
    if (menu.length<1) {
        const ext_menu = await getExternalMenu(locale as string)
        const loc_menu = await getLocalMenu(locale as string)
        menu = ext_menu.concat(loc_menu)       
    }
    sendResponse( response, { menu })
}