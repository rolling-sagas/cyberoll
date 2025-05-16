import Handlebars from 'handlebars/dist/handlebars';

export function registerWithConfig(configs = {}) {
  Handlebars.unregisterHelper('withConfig');

  Handlebars.registerHelper('withConfig', function (path, options) {
    try {
      const config = configs[path];
      if (!config) throw new Error(`Config not found: ${path}`);
      // Makes config available inside the block
      return options.fn(config);
    } catch (err) {
      console.warn(err);
      return options.fn();
    }
  });
}

export function renderTemplate(template, data) {
  return Handlebars.compile(template)(data);
}

Handlebars.registerHelper('eachKey', function (obj, options) {
  let result = '';
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += options.fn({ key: key, value: obj[key] });
    }
  }
  return result;
});

Handlebars.registerHelper('isEqual', function (a, b) {
  return a === b;
});

export default Handlebars;
