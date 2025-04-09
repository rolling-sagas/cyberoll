import { COMPONENT_TYPE } from '@/utils/const';
import mustache from 'mustache';
import { IMAGE_HOST, DEFAULT_STORY_IMAGE } from '@/utils/const';
import parseString from '@iarna/toml/parse-string';

export function ArrayToKeyValue(list) {
  const result = { meta: {} };
  for (const item of list) {
    if (item.type === 'obj' || item.type === 'img') {
      try {
        const obj = JSON.parse(item.value);
        result[item.name] = obj;
        result[item.name + '_str'] = '```json\n' + item.value + '\n```';

        // add objects to meta list, so we can use them
        // in the mustache template
        if (!result.meta.hasOwnProperty(item.type)) {
          result.meta[item.type] = [];
        }
        obj.name = item.name;
        result.meta[item.type].push(obj);
      } catch (e) {
        console.log(item, e);
        console.error('json template rendering error');
      }
    } else if (item.type === 'num') {
      result[item.name] = Number(item.value);
    } else {
      result[item.name] = item.value;
    }
  }
  // console.log("key value:", list, result)
  return result;
}

export function isNumber(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
}

export function parseError(e) {
  // regex to match the prisma error code, e.g. P2025
  switch (e.code) {
    case 'P2002':
      return 'Duplicate name or id';
    case 'P2025':
      return 'Foreign key constraint failed';
    default:
      return e.message;
  }
}

export function getImageUrl(
  uri = '',
  fallbackUrl = DEFAULT_STORY_IMAGE,
  variant = 'public'
) {
  if (/^https?:\/\//.test(uri)) return uri;
  // uri 可能是json string
  const data = parseJson(uri, uri);
  return uri ? `${IMAGE_HOST}${data.id || data}/${variant}` : fallbackUrl;
}

export function getImageUrlByName(name, components = []) {
  const comp = components.find(
    (comp) => comp.type === COMPONENT_TYPE.Image && comp.name === name
  );
  return comp ? getImageUrl(comp?.value) : undefined;
}

export function getImageIdByName(name, components = []) {
  const comp = components.find(
    (comp) => comp.type === COMPONENT_TYPE.Image && comp.name === name
  );
  if (!comp) return undefined;
  const data = parseJson(comp?.value, comp?.value);
  return data?.id || data;
}

export function componentsToMap(components = [], needThrowError = false) {
  let res = {};
  components.forEach((co) => {
    const { type, value, name } = co;
    try {
      switch (type) {
        case COMPONENT_TYPE.Number:
          res[name] = Number(value);
          break;
        case COMPONENT_TYPE.Object:
          res[name] = eval(`(${value})`);
          break;
        case COMPONENT_TYPE.Toml:
          res[name] = parseString(value);
          break;
        case COMPONENT_TYPE.Image:
          res[name] = name;
          break;
        case COMPONENT_TYPE.Function:
          break;
        default:
          res[name] = value;
      }
    } catch (e) {
      console.error(`[parse component fail: componentName ${name}]`, e);
      res[name] = value;
      if (needThrowError) throw e;
    }
  });
  return res;
}

export function formatMessages(
  messages,
  components,
  beforeMsgId = '',
  update = {}
) {
  messages = [...messages];
  if (beforeMsgId) {
    const index = messages.findIndex((m) => m.id === beforeMsgId);
    if (index > -1) messages.length = index;
  }
  const context = {
    ...componentsToMap(components),
    ...update,
  };
  return messages.map((m) => ({
    role: m.role,
    content: mustache.render(m.content, context),
  }));
}

export function parseMarkdown(markdownText) {
  if (!markdownText) return '';

  // Helper function to escape special characters in regular expressions
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  let text = markdownText;

  // Parse titles (supports h1 to h6)
  text = text.replace(/^(#{1,6})\s(.+)$/gm, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level}>${content.trim()}</h${level}>`;
  });

  // Parse bold text
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Parse italic text
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Parse code blocks
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre><code>${escapeRegExp(code.trim())}</code></pre>`;
  });

  // Parse quotes
  text = text.replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>');

  // Convert line breaks
  text = text.replace(/\n/g, '<br>');

  return text;
}

export function parseJson(str, def) {
  let res = def !== undefined ? def : str;
  try {
    res = JSON.parse(str);
  } catch (e) {}
  return res;
}

export function formatNumber(num, toFixed = 1) {
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const units = [
    { value: 1e9, symbol: 'b' },
    { value: 1e6, symbol: 'm' },
    { value: 1e3, symbol: 'k' },
  ];

  const unit = units.find((u) => absNum >= u.value);
  if (unit) {
    let formattedNumber = (absNum / unit.value).toFixed(toFixed);
    formattedNumber = parseFloat(formattedNumber).toString();
    return (isNegative ? '-' : '') + formattedNumber + unit.symbol;
  } else {
    let formattedNumber = absNum.toFixed(toFixed);
    formattedNumber = parseFloat(formattedNumber).toString();
    return (isNegative ? '-' : '') + formattedNumber;
  }
}

export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const isDigit = (char) => {
  return !isNaN(parseInt(char));
};

export function generateBase64Svg(
  width,
  height,
  text,
  fontSize = '40',
  bgColor = '#dddddd',
  textColor = '#999999'
) {
  const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${bgColor}" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="${fontSize}" font-family="Arial">
      ${text}
    </text>
  </svg>`;

  const encodedSvg = encodeURIComponent(svgData)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  const base64Url = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

  return base64Url;
}
