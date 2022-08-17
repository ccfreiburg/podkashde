import { ENUMERATIONS_AP } from '~~/base/Constants';
import Enumerations from '~~/base/Enumerations';
import IEnumerator from '~~/base/types/IEnumerator';

export async function useEnumerations() {
  const enums = useState<Array<IEnumerator>>(
    'enumeration',
    () => []
  );

  const refresh = async () => {
    const list = await $fetch(ENUMERATIONS_AP);
    enums.value = list;
  };
  // if not init fetch and init
  if (!Enumerations.isInitialized(enums.value)) {
    await refresh();
  }

  const getLanguage = (lang_id: number): IEnumerator => {
    return Enumerations.byIdOne(Enumerations.languages(enums.value), lang_id);
  };
  
  const getGenre = (genre_id: number): IEnumerator => {
    return Enumerations.byIdOne(Enumerations.podcastGenres(enums.value), genre_id);
  };

  const getAuthor = (genre_id: number): IEnumerator => {
    return Enumerations.byIdOne(Enumerations.authors(enums.value), genre_id);
  };

  const getTag = (genre_id: number): IEnumerator => {
    return Enumerations.byIdOne(Enumerations.tags(enums.value), genre_id);
  };

  const languages = Enumerations.languages(enums.value);
  const podcastGenres =  Enumerations.podcastGenres(enums.value);
  const podcastTypes =  Enumerations.podcastTypes(enums.value);
  const tags =  Enumerations.tags(enums.value);
  const authors =  Enumerations.authors(enums.value);

  return {
    enums,
    enumerations: {
      getLanguage,
      getGenre,
      getAuthor,
      getTag, 
      languages,
      podcastGenres,
      podcastTypes,
      tags,
      authors   
    },
    refresh,
  };
}
