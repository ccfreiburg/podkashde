import getMenu from '../menu';

export default defineEventHandler( async (event) => {
    return getMenu()
})