import { ENUMERATIONS_AP } from '~~/base/Constants';
import Enumerations from '~~/base/Enumerations';
import type IEnumerator from '~~/base/types/IEnumerator';

const enums = ref<Array<IEnumerator>>([])

export function useEnumerations() {
    const { refresh: dataRefresh } = useDatas( enums, ENUMERATIONS_AP )
    const loading = ref(!enums.value)
    const refresh = async () => {
        loading.value = true
        await dataRefresh()
        loading.value = false
    }
    if (!Enumerations.isInitialized(enums.value)) {
      refresh();
    }
    return {
        enums,
        refresh,
        loading, 
        enumerations: {
          getLanguage: (lang_id: number): IEnumerator => Enumerations.byIdOne(Enumerations.languages(enums.value), lang_id),
          getGenre: (genre_id: number): IEnumerator => Enumerations.byIdOne(Enumerations.podcastGenres(enums.value), genre_id),
          getAuthor: (autor_id: number): IEnumerator => Enumerations.byIdOne(Enumerations.authors(enums.value), autor_id),
          getTag: (tag_id: number): IEnumerator => Enumerations.byIdOne(Enumerations.tags(enums.value), tag_id),
          getType: (type_id: number): IEnumerator => Enumerations.byIdOne(Enumerations.podcastTypes(enums.value), type_id),
          languages: () => Enumerations.languages(enums.value),
          podcastGenres: () => Enumerations.podcastGenres(enums.value),
          podcastTypes: () =>  Enumerations.podcastTypes(enums.value),
          tags: () => Enumerations.tags(enums.value),
          authors: () => Enumerations.authors(enums.value)
        }
  }
}