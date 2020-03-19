export default class CustardModule {
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
