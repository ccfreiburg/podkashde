import { ENUMERATIONS_AP } from '~~/base/Constants';
import Enumerations from '~~/base/Enumerations';
import IEnumerator from '~~/base/types/IEnumerator';

export async function useEnumerations() {
  const enumerations = useState<Enumerations>(
    'enumeration',
    () => new Enumerations()
  );

  const refresh = async () => {
    const list = await $fetch(ENUMERATIONS_AP);
    const enumers = new Enumerations();
    enumers.addList(list);
    enumerations.value = enumers;
  };
  // if not init fetch and init
  if (!enumerations.value.isInitialized) {
    await refresh();
  }

  const getLanguage = (lang_id: number): IEnumerator => {
    return Enumerations.byIdOne(enumerations.value.languages, lang_id);
  };
  const getGenre = (genre_id: number): IEnumerator => {
    return Enumerations.byIdOne(enumerations.value.podcastGenres, genre_id);
  };
  return {
    enumerations,
    getLanguage,
    getGenre,
    refresh,
  };
}
