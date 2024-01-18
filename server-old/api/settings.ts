import fs from 'fs'
import { DATA_PATH } from '~~/base/Constants';
import getSettings from '../settings';

export default defineEventHandler( async (event) => {
    return getSettings()
})