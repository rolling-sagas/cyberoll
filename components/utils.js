export function ArrayToKeyValue(list) {
  const result = {}
  for (const item of list) {
    if (item.type === "obj" || item.type === "img") {
      try {
        result[item.name] = JSON.parse(item.value)
        result[item.name + "_str"] = "```json\n" + item.value + "\n```"
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

