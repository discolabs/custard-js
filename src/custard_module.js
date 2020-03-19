export default class CustardModule {
  constructor(options) {
    this.options = options;

    this.$element = null;
  }

  id() {
    throw new Error('Not implemented');
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
