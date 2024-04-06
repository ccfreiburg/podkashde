export function strToDurationInSec(durationStr: string) {
  if (!durationStr) return -1;
  const parts = durationStr.replace(/[\.-\/\\]/g, ':').split(":");
  var pos = 0;
  var sum = 0;
  while (parts.length > 0 && parts[0].length > 0) {
    sum *= 60;
    sum += Number(parts[pos]);
    pos++;
    if (pos == parts.length) return sum;
  }
  return sum;
}
export function durationInSecToStr(duration: number | string) {
  if (typeof(duration)=="string")
    return duration;
  if (duration <= 0) return "0:00";
  var result = [
    Math.floor(duration / 60 / 60),
    Math.floor(duration / 60) % 60,
    Math.floor(duration % 60),
  ]
    .join(":")
    .replace(/\b(\d)\b/g, "0$1");
  if (result.startsWith("00:")) result = result.substring(1);
  if (result.length>5 && result.startsWith("0:")) result = result.substring(2);
  if (result.startsWith("0")) result = result.substring(1);
  if (result.startsWith(":")) result = "0" + result;
  return result;
}

const datePattern =
  /^(0?[1-9]|[1-2][0-9]|3[01])([-\/.])(0?[1-9]|1[012])\2(19|20)?(\d\d)$/gm;
const datePatter2 =
  /^(19|20)?(\d\d)([-\/.])(0?[1-9]|1[012])\3(3[01]|[12][0-9]|0?[1-9])/g;
export function strToDate(str: string): Date {
  var result = str;
  if (str.match(datePattern)) result = str.replace(datePattern, "$4$5-$3-$1");
  else {
    const match = str.match(datePatter2);
    if (match) result = match[0];
  }
  return new Date(result);
}

export function dateToIsoString(date: Date) : string {
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + (date.getDate())).slice(-2)
  );
}

export function dateToString(date: Date, locale: string) : string {
  if (locale=="de")
    return (date.getDate() + "." + date.getMonth()+1 +"." +date.getFullYear())
  else if (locale=="en")
    return (date.getMonth()+1 +"/" +date.getDate() + "/" +date.getFullYear())
  else 
    return dateToIsoString(date)
}

export function urlFriendlyString(text: string) :string {
  return saveSlugFormText(text)
}

export function saveSlugFormText(text: string, lowercase = true): string {
  var slug = (lowercase?text.toLowerCase():text);
  return slug
    .replace(/([:;\.,]+\s?)+/g, "_")
    .replace(/([!'/()*"~#@?%&\\:;,<>\*\+\|]|\DE\/EN)+/g, "")
    .replace(" deen", "")
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("Ä", "Ae")
    .replaceAll("Ö", "Oe")
    .replaceAll("Ü", "Ue")
    .replaceAll("ß", "ss")
    .replace(/\s+/g, "_");
}

export function getSaveFilename(name: string): string {
  const ext_index = name.lastIndexOf('.')
  const base = name.slice(0,ext_index)
  const ext = name.slice(ext_index)
  return saveSlugFormText(base,false)+ext
}

export function parseHTML(html) {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t.content;
}
