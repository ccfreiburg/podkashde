import { GENERATE_RSS_AP } from "~~/base/Constants";



export default function useRss(slug:string) {

    const generate = async () => {
        const {mediaBase} = useRuntimeConfig().public
        const myFetch = useFetchApi()

        await myFetch( GENERATE_RSS_AP, { 
            query: {
                slug,
                mediaBase
            }
        })
    }

    return {
        generate
    }
}