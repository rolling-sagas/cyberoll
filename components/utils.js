import { COMPONENT_TYPE } from "./common"
import mustache from 'mustache'
import { IMAGE_HOST, DEFAULT_STORY_IMAGE } from "./common"

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
        console.log(item, e)
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

export function componentsToMap(components = []) {
  let res = {}
  components.forEach(co => {
    const {type, value, name} = co
    try {
      switch(type) {
        case COMPONENT_TYPE.number: res[name] = Number(value); break;
        case COMPONENT_TYPE.object: res[name] = eval(`(${value})`); break;
        default: res[name] = value;
      }
    } catch(e) {
      console.error('[parse component fail]', e)
      res[name] = value
    }
  })
  return res
}

export function formatMessages(messages, components, beforeMsgId = '', update = {}) {
  messages = [...messages]
  if (beforeMsgId) {
    const index = messages.findIndex(m => m.id === beforeMsgId)
    if (index > -1) messages.length = index
  }
  const context = {
    ...componentsToMap(components),
    ...update,
  }
  return messages.map(m => ({
    role: m.role,
    content: mustache.render(m.content, context)
  }))
}

export function getImageUrl(id) {
  return id ? `${IMAGE_HOST}${id}/public` : DEFAULT_STORY_IMAGE
}

export function parseMarkdown(markdownText) {
  if (!markdownText) return "";

  // Helper function to escape special characters in regular expressions
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  let text = markdownText;

  // Parse titles (supports h1 to h6)
  text = text.replace(/^(#{1,6})\s(.+)$/gm, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level}>${content.trim()}</h${level}>`;
  });

  // Parse bold text
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Parse italic text
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Parse code blocks
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre><code>${escapeRegExp(code.trim())}</code></pre>`;
  });

  // Parse quotes
  text = text.replace(/^>\s(.+)$/gm, "<blockquote>$1</blockquote>");

  // Convert line breaks
  text = text.replace(/\n/g, "<br>");

  return text;
}
