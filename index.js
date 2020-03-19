export const STEP_CONTACT_INFORMATION = 'contact_information';
export const STEP_SHIPPING_METHOD = 'shipping_method';
export const STEP_PAYMENT_METHOD = 'payment_method';
export const STEP_REVIEW = 'review';
export const STEP_THANK_YOU = 'thank_you';
export const STEP_ORDER_STATUS = 'order_status';
export const STEPS_ALL = [
  STEP_CONTACT_INFORMATION,
  STEP_SHIPPING_METHOD,
  STEP_PAYMENT_METHOD,
  STEP_REVIEW,
  STEP_THANK_YOU,
  STEP_ORDER_STATUS
];

export class Custard {
  constructor(moduleClasses) {
    this.moduleClasses = moduleClasses;
  }

  init($, step, options = {}) {
    this.$ = $;
    this.step = step;
    this.options = options;

    // Instantiate module classes.
    this.modules = this.moduleClasses.map(moduleClass => {
      return new moduleClass($, step, options);
    });

    // Call beforeInit hook for each of modules
    this.beforeModulesInit();

    // Register event listeners.
    this.$(document).on(
      'page:load page:change',
      this.pageChangeHandler.bind(this)
    );
  }

  beforeModulesInit() {
    this.modules.forEach(module => {
      if (module.steps().includes(this.step)) {
        if (typeof module.beforeInit === 'function') {
          module.beforeInit();
        }
      }
    });
  }

  pageChangeHandler(event) {
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

export class CustardModule {
  constructor($, step, options) {
    this.$ = $;
    this.step = step;
    this.options = options;

    this.$element = null;
  }

  id() {
    throw 'Not implemented';
  }

  steps() {
    return [];
  }

  selector() {
    return 'document';
  }

  beforeInit() {}

  init() {
    this.$element = this.$(this.selector());

    // Bail if already initialised.
    if (this.$element.hasClass(this.id())) {
      return;
    }

    // Setup
    this.$element.addClass(this.id());
    this.setup();
  }

  setup() {}
}
