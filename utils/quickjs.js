import Mustache from 'mustache';
import { nanoid } from 'nanoid';
import variant from '@jitl/quickjs-singlefile-browser-release-sync';
import { newQuickJSWASMModuleFromVariant } from 'quickjs-emscripten-core';

export default class QuickJSManager {
  constructor() {
    this.QuickJSModule = null;
    this.runtime = null;
    this.context = null;
    this.entryModule = null;
  }

  /**
   * Initialize the QuickJS runtime with custom functions
   */
  async initialize(customModules) {
    this.disposeAll();
    const QuickJSModule = await newQuickJSWASMModuleFromVariant(variant);
    this.runtime = QuickJSModule.newRuntime();
    this.context = this.runtime.newContext();

    this.setupConsoleLogger();
    this.setupModuleLoader(customModules);
  }

  /**
   * Dispose all QuickJS instances
   */
  async disposeAll() {
    if (this.entryModule) {
      this.entryModule.dispose();
      this.entryModule = null;
    }

    if (this.context) {
      this.context.dispose();
      this.context = null;
    }

    if (this.runtime) {
      this.runtime.dispose();
      this.runtime = null;
    }
  }

  /**
   * Set up console logging functionality
   */
  setupConsoleLogger() {
    const consoleHandle = this.context.newObject();
    const log = this.context.newFunction('log', (...args) => {
      const nativeArgs = args.map(this.context.dump);
      console.log('QuickJS:', ...nativeArgs);
    });

    this.context.setProp(consoleHandle, 'log', log);
    this.context.setProp(this.context.global, 'console', consoleHandle);

    [log, consoleHandle].forEach((handle) => handle.dispose());
  }

  /**
   * Set up module loader for custom functions
   */
  setupModuleLoader(customFunctions) {
    this.runtime.setModuleLoader((moduleName) => {
      const module = customFunctions.find((fn) => fn.name === moduleName);
      if (!module) {
        throw new Error(`Module not found: ${moduleName}`);
      }
      return module.value;
    });
  }

  /**
   * Set up Mustache template rendering
   */
  setupTemplateRenderer() {
    if (!this.entryModule) {
      return
    }
    const instance = this.context.getProp(this.entryModule, 'default');
    const renderFn = this.context.newFunction('render', (template, value) => {
      const nativeTemplate = this.context.dump(template);
      const nativeValue = this.context.dump(value);
      return this.context.newString(
        Mustache.render(nativeTemplate, nativeValue)
      );
    });

    this.context.setProp(instance, 'render', renderFn);
    [instance, renderFn].forEach((handle) => handle.dispose());
  }

  /**
   * Set up UUID generation
   */
  setupUUIDGenerator() {
    if (!this.entryModule) {
      return
    }
    const instance = this.context.getProp(this.entryModule, 'default');
    const uuidFn = this.context.newFunction('uuid', () => {
      return this.context.newString(nanoid());
    });

    this.context.setProp(instance, 'uuid', uuidFn);
    [instance, uuidFn].forEach((handle) => handle.dispose());
  }

  /**
   * Execute scripts with components
   */
  async executeScript(scripts, components) {
    if (!this.context) {
      throw new Error('QuickJS runtime not initialized');
    }

    try {
      const res = this.context.evalCode(scripts, 'index.js', {
        type: 'module',
      });
      this.entryModule = this.context.unwrapResult(res);
    } catch (e) {
      this.entryModule = null;
      throw e;
    }

    this.setupTemplateRenderer();
    this.setupUUIDGenerator();
    await this.setComponents(components);
  }

  /**
   * Set components
   */
  async setComponents(components) {
    return this.callFunction('setComponents', components);
  }

  /**
   * Call a function with optional arguments
   */
  async callFunction(functionName, args = null) {
    if (!this.entryModule) {
      return
    }
    try {
      const instance = this.context.getProp(this.entryModule, 'default');
      const targetFunction = this.context.getProp(instance, functionName);
      if (this.context.typeof(targetFunction) !== 'function') {
        console.error('[callFunction skiped]', `${functionName} is not a function`)
        return
      }

      let result;
      if (args) {
        const argsHandle = this.context.newString(JSON.stringify(args));
        result = this.context.unwrapResult(
          this.context.callFunction(targetFunction, instance, argsHandle)
        );
        argsHandle.dispose();
      } else {
        result = this.context.unwrapResult(
          this.context.callFunction(targetFunction, instance)
        );
      }

      const finalResult = this.context.dump(result);
      [result, targetFunction, instance].forEach((handle) => handle.dispose());

      return finalResult;
    } catch (error) {
      if (error.message === 'not a function') {
        throw new Error(`Function "${functionName}" not found`);
      }
      throw error;
    }
  }
}
