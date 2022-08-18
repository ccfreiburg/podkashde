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
  if (result.startsWith("00:0")) result = result.substring(4);
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

export function dateToIsoString(date: Date) {
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + (date.getDay() + 1)).slice(-2)
  );
}

export function saveSlugFormText(text: string): string {
  var slug = text.toLowerCase();
  return slug
    .replace(/([!'/()*"~#@?%&\\:;.,<>\*\+\|]|\DE\/EN)+/g, "")
    .replace(" deen", "")
    .replace("ä", "ae")
    .replace("ö", "oe")
    .replace("ü", "ue")
    .replace("ß", "ss")
    .replace(/\s+/g, "-");
}
