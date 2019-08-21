# Custard.js
Custard.js is a lightweight Javascript library that provides a simple, robust, standardised approach to customising online checkout pages for Shopify themes.

It's based on the design patterns and development work conducted at [Disco], especially in relation to our work on the [Submarine] platform, and is designed for use by freelancers, developers and agencies working with [Shopify Plus] merchants.


## Installation and setup
At Disco, all of our theme development work is done using ES6 modules and Webpack for bundling.
We don't tend to use [Slate] for theme development.
Custard is therefore currently quite opinionated towards our way of building themes - but we've very welcome to pull requests making the library accessible to other workflows as well.

A typical setup for us would follow these steps:

1. Add the library to our theme (`yarn add @discolabs/custard-js`);
2. Create a Webpack configuration to compile a `checkout-custom.min.js` file into the theme's `assets` directory;
3. Create a `checkout-custom` directory within our Javascript sources, add an `index.js` file and individual module files for each checkout customisation;
4. Ensure checkout customisations are enabled on our target store, and that we include a `checkout-custom.liquid` snippet in the head of our `layout/checkout.liquid` file.

More details on use  

## Usage
In the documentation below, we'll show you how to create a Custard module that adds a line of additional help text underneath the "accepts marketing" checkbox on the first step of the checkout. 

For simplicity, in the scenario below we assume that we have the following directory structure for our theme:

    .
    ├── assets
    │   ├── ...
    │   ├── checkout-custom.min.js                  # Compiled checkout customisation JS file
    │   └── ...
    ├── config    
    ├── layout
    ├── locales
    ├── snippets    
    ├── source
    │   └── checkout-custom
    │       ├── accepts-marketing-help-text.js      # Individual Custard module
    │       └── index.js                            # Entry point for checkout customisations
    ├── templates
    ├── config.yml                                  # Standard package.json defining dependencies
    ├── package.json                                # Standard package.json defining dependencies
    ├── webpack.checkout-custom.config.js           # Webpack config to compile checkout customisations
    ├── yarn.lock
    └── ...

We're assuming also that prior to jumping into the code below, we've configured Webpack (or similar) to compile our entrypoint file `source/checkout-custom/index.js` to a browser-ready minified script in `assets/checkout-custom.min.js`.

### Creating a Custard module
Our first step will be to create a new Custard module in `source/checkout-custom/accepts-marketing-help-text.js`:

```javascript
import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";

export class AcceptsMarketingHelpText extends CustardModule {

  id() {
    return 'buyer-accepts-marketing-help-text';
  }

  steps() {
    return [STEP_CONTACT_INFORMATION];
  }

  selector() {
    return '[data-buyer-accepts-marketing]';
  }

  setup() {
    this.$element.find('.checkbox__label').append(this.options.html_templates.buyer_accepts_marketing_help_text);
  }

}
```

### Combining your Custard modules
We then need to make sure our new module is included in the entrypoint file, `source/checkout-custom/index.js`, and that the entrypoint is instantiating a new `Custard` object in `window.custard`:

```javascript
import { Custard } from "@discolabs/custard-js";

import { AcceptsMarketingHelpText } from './accepts-marketing-help-text';

window.custard = new Custard([
  AcceptsMarketingHelpText
]);
```

### Initialising Custard in checkout
We're now ready to instantiate our checkout customisations within the checkout's Liquid template.
We add an `{% include 'checkout-custom' '%}` to the top of `layout/checkout.liquid`, and defined our `checkout-custom.liquid` something like this:

```html
{%- capture HTML_TEMPLATE_ACCEPTS_MARKETING_HELP_TEXT -%}
  <br />
  <small>{{ 'checkout.custom.customer_information.buyer_accepts_marketing_help_text' | t }}</small>
{%- endcapture -%}

<script type="text/javascript">
  window.custard.init(jQuery || Checkout.jQuery, Shopify.Checkout.step || (Shopify.Checkout.OrderStatus ? 'order_status' : null), {
    html_templates: {
      accepts_marketing_help_text: {{ HTML_TEMPLATE_ACCEPTS_MARKETING_HELP_TEXT | json }}
    }
  });
</script>
```


## Release History
Refer to the [release history] for a full list of changes.

## Contributions
Contributions are very much welcome! Read our [contribution guidelines] for details on submitting pull requests that will be accepted.


[Disco]: https://www.discolabs.com
[Submarine]: https://docs.getsubmarine.com
[Shopify Plus]: https://www.shopify.com/plus?ref=disco
[Slate]: #
[release history]: https://github.com/discolabs/custard-js/releases
[contribution guidelines]: https://github.com/discolabs/custard-js/blob/master/CONTRIBUTING.md
