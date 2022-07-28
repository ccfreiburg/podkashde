export default interface IEnumerator {
    displaytext: string;
    shorttext: string;
    parentCategory: string;
    enumkey_id: number;
    enumvalue_id: number;
}

export function emptyEnum(enumer:IEnumerator) {
    enumer.displaytext = "";
    enumer.shorttext = "";
    enumer.parentCategory = "";
    enumer.enumkey_id = -1;
    enumer.enumvalue_id = -1;
  }

export function getEmptyEnum() : IEnumerator {
    var enumer = { 
        displaytext: "",
        shorttext: "",
        parentCategory: "",
        enumkey_id: -1,
        enumvalue_id: -1,
  }
  return enumer;
}