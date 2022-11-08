export enum ContentState {
  metadata = 1,
  episodes = 2,
  allmeta = 3,
  image = 4,
  metaandimage = 7,
  files = 8,
  metaandfiles = 11,
  all = 15,
  draft = 16,
  published = 32,
}

function bin(num : number) : string {
  const result = num.toString(2).padStart(8,'0');
  return result
}

export function hasState(contentState: ContentState, expected: ContentState) {
  var obj = bin(contentState)
  var exp = bin(expected)
  for(var i=1; i<= exp.length; i++)
    if (exp[exp.length-i]=="1" && obj[obj.length-i]=="0")
      return false
  return true
}


export function addState(contentState: ContentState, toAdd: ContentState) : ContentState {
  var obj = bin(contentState)
  var exp = bin(toAdd)
  var result = 0;
  for(var i=0; i<exp.length; i++)
    if (exp[exp.length-i-1]=="1" || obj[obj.length-i-1]=="1"){
      result += 2**i;
    }

  return result as ContentState
}