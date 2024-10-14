export function ArrayToKeyValue(list) {
  const result = { meta: {} }
  for (const item of list) {
    if (item.type === "obj" || item.type === "img") {
      try {
        const obj = JSON.parse(item.value)
        result[item.name] = obj
        result[item.name + "_str"] = "```json\n" + item.value + "\n```"

        // add objects to meta list, so we can use them 
        // in the mustache template
        if (!result.meta.hasOwnProperty(item.type)) {
          result.meta[item.type] = []
        }
        obj.name = item.name
        result.meta[item.type].push(obj)
      } catch (e) {
        console.log(e)
        console.error("json template rendering error")
      }
    } else if (item.type === "num") {
      result[item.name] = Number(item.value)
    } else {
      result[item.name] = item.value
    }
  }
  // console.log("key value:", list, result)
  return result
}

export function isNumber(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};

export function parseError(e) {
  // regex to match the prisma error code, e.g. P2025
  switch (e.code) {
    case "P2002":
      return "Duplicate name or id";
    case "P2025":
      return "Foreign key constraint failed";
    default:
      return e.message;
  }
}
