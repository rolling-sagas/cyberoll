import Mustache from "mustache";
import { nanoid } from "nanoid";

// minimal wasm build, see:
// https://github.com/justjake/quickjs-emscripten/blob/main/doc/quickjs-emscripten-core/README.md

import variant from "@jitl/quickjs-singlefile-browser-release-sync"
import { newQuickJSWASMModuleFromVariant } from "quickjs-emscripten-core"

export default class QuickJSManager {
  // Handles initialization of QuickJS runtime
  // Sets up console.log functionality in QuickJS context
  // Provides template rendering capabilities
  // Executes user scripts in isolated context
  constructor() {
    this.QuickJS = null;
    this.vm = null;
    this.subModules = [];
    this.entryModule = null;
  }

  async initialize(functions) {
    if (this.entryModule) {
      this.entryModule.dispose();
      this.entryModule = null;
    }

    if (this.vm) {
      this.vm.dispose();
    }

    if (this.QuickJS) {
      this.QuickJS.dispose();
    }

    const module = await newQuickJSWASMModuleFromVariant(variant);
    this.QuickJS = module.newRuntime();

    this.vm = this.QuickJS.newContext();
    this.setupConsole();

    // set up functions
    this.QuickJS.setModuleLoader((moduleName) => {
      const func = functions.find((func) => func.name === moduleName);
      if (!func) {
        throw new Error(`module not found: ${moduleName}`);
      }

      const funcStr = func.value;
      return funcStr;
    });
  }

  setupConsole() {
    const logHandle = this.vm.newFunction("log", (...args) => {
      const nativeArgs = args.map(this.vm.dump);
      console.log("QuickJS:", ...nativeArgs);
    });

    const consoleHandle = this.vm.newObject();
    this.vm.setProp(consoleHandle, "log", logHandle);
    this.vm.setProp(this.vm.global, "console", consoleHandle);

    logHandle.dispose();
    consoleHandle.dispose();
  }

  setupRender() {
    const instance = this.vm.getProp(this.entryModule, "default");

    this.vm
      .newFunction("render", (template, value) => {
        const nativeTemplate = this.vm.dump(template);
        const nativeValue = this.vm.dump(value);
        return this.vm.newString(Mustache.render(nativeTemplate, nativeValue));
      })
      .consume((fnHandle) => this.vm.setProp(instance, "render", fnHandle));

    instance.dispose();
  }

  setupUUID() {
    const instance = this.vm.getProp(this.entryModule, "default");

    this.vm
      .newFunction("uuid", () => {
        return this.vm.newString(nanoid());
      })
      .consume((fnHandle) => this.vm.setProp(instance, "uuid", fnHandle));

    instance.dispose();
  }

  async setupComponents(components) {
    await this.callFunction("setComponents", components);
  }

  async executeScript(scripts, components) {
    if (!this.vm) {
      throw new Error("QuickJS runtime not initialized");
    }

    if (this.entryModule) {
      this.entryModule.dispose();
      this.entryModule = null;
    }

    this.entryModule = this.vm.unwrapResult(
      this.vm.evalCode(scripts, "index.js", { type: "module" }),
    );

    this.setupRender();
    this.setupUUID();

    await this.setupComponents(components);
  }

  async callFunction(funcName, args) {
    try {
      const instance = this.vm.getProp(this.entryModule, "default");
      const func = this.vm.getProp(instance, funcName);

      let result = null;
      if (args) {
        var argHandle = this.vm.newString(JSON.stringify(args));
        result = this.vm.unwrapResult(
          this.vm.callFunction(func, instance, argHandle),
        );
        argHandle.dispose();
      } else {
        result = this.vm.unwrapResult(this.vm.callFunction(func, instance));
      }

      const resultDumped = this.vm.dump(result);
      this.cleanupHandles(result, func, instance);
      return resultDumped;
    } catch (e) {
      if (e.message === "not a function") {
        throw new Error(`Function "${funcName}" not found`);
      }

      throw e;
    }
  }

  cleanupHandles(...handles) {
    handles.forEach((handle) => handle.dispose());
  }
}
