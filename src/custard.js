import { STEP_SHIPPING_METHOD } from './constants';
import CustardModule from './custard_module';

export default class Custard {
  constructor(modules) {
    this.modules = modules;
  }

  init($, step, options = {}) {
    this.$ = $;
    this.step = step;
    this.options = options;

    this.attachAdditionalContext();
    this.callBeforeInit();
    this.registerEventListeners();
  }

  attachAdditionalContext() {
    this.modules = this.modules
      .map(module => {
        if (module instanceof CustardModule) {
          module.$ = this.$;
          module.step = this.step;
          module.options = Object.assign(this.options, module.options);
          return module;
        }

        if (typeof module === 'function') {
          const Module = module;
          return new Module(this.$, this.step, this.options);
        }

        return null;
      })
      .filter(module => module === null);
  }

  callBeforeInit() {
    this.modules.forEach(module => {
      if (module.steps().includes(this.step)) {
        if (typeof module.beforeInit === 'function') {
          module.beforeInit();
        }
      }
    });
  }

  registerEventListeners() {
    this.$(document).on(
      'page:load page:change',
      this.pageChangeHandler.bind(this)
    );
  }

  pageChangeHandler() {
    this.modules.forEach(module => {
      if (module.steps().includes(this.step)) {
        if (
          this.step === STEP_SHIPPING_METHOD &&
          this.isPollRefreshElementPresent()
        ) {
          return;
        }

        module.init();
      }
    });
  }

  isPollRefreshElementPresent() {
    return this.$('[data-poll-refresh]').length;
  }
}
