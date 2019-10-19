# Custard.js
Custard.js is a lightweight Javascript library that provides a simple, robust, standardised approach to customising online checkout pages for Shopify themes.

It's based on the design patterns and development work conducted at [Disco Labs], especially in relation to our work on the [Submarine] platform, and is designed for use by freelancers, developers and agencies working with [Shopify Plus] merchants.
These design patterns, in combination with this Javascript library, comprise the **Custard Approach** for Shopify checkout customisations.

Custard aims to:
* **Modularise Customisations**: Provides a simple, standardised pattern for defining individual customisations as independent "modules", making customisations more maintainable and reusable.
* **Extract Boilerplate**: Standardises initialisation and event detection code inside the Javascript framework so that you don't have to deal with it for each customisation you'd like to add.
* **Handle Checkout Quirks:** Deals with things like asynchronous shipping rate loading on the shipping method checkout step, or re-rendering customisations when Shopify dynamically updates the page, without the developer needing to worry about it.
* **Keep HTML in HTML:** Provides a nice pattern for defining any HTML you want to add to the Checkout DOM inside a Liquid template, letting you use the power of Liquid and keeping your templates in the one location.

## Installation and setup
At Disco, all of our theme development work is done using ES6 modules and Webpack for bundling.
We don't tend to use [Slate] for theme development.
Custard is therefore currently quite opinionated towards our way of building themes - but we've very welcome to pull requests making the library accessible to other workflows as well.

A typical setup for us would follow these steps:

1. Add the library to our theme (`yarn add @discolabs/custard-js`);
2. Create a Webpack configuration to compile a `checkout-custom.min.js` file into the theme's `assets` directory (please review the [Troubleshooting] section below for a common Webpack gotcha);
3. Create a `checkout-custom` directory within our Javascript sources, add an `index.js` file and individual module files for each checkout customisation;
4. Ensure checkout customisations are enabled on our target store, and that we include a `checkout-custom.liquid` snippet in the head of our `layout/checkout.liquid` file.


## Usage
In the documentation below, we'll show you how to create a Custard module that adds a line of additional help text underneath the "accepts marketing" checkbox on the first step of the checkout. 

<img width="572" alt="custard-help-text-example" src="https://user-images.githubusercontent.com/702485/63477410-57f9c200-c4c8-11e9-888a-25d10dd44d85.png">

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
    │   ├── ...
    │   ├── checkout-custom.liquid                  # Liquid initialisation snippet for customisations
    │   └── ...    
    ├── source
    │   └── checkout-custom
    │       ├── accepts-marketing-help-text.js      # Individual Custard module
    │       └── index.js                            # Entry point for checkout customisations
    ├── templates
    ├── config.yml                                  # Standard Theme Kit configuration file
    ├── package.json                                # Standard package.json defining dependencies
    ├── webpack.checkout-custom.config.js           # Webpack config to compile checkout customisations
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
We add an `{%- include 'checkout-custom' -%}` to the top of `layout/checkout.liquid`, and define our `checkout-custom.liquid` something like this:

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

## Troubleshooting
Solutions for any common stumbling blocks are provided here.
If you run into anything yourselves, please raise an issue or open a pull request.

### Browser console reports `Class constructor CustardModule cannot be invoked without 'new'`
Custard.js is made available as a pure ES6 module - it's not transpiled to ES5 as part of its NPM publishing process, which is common for many NPM modules.
This means that for browser usage, care has to be taken to ensure that your build process does the work of transpiling Custard to your target Javascript environment.

In a Webpack setup, transpilation is almost always managed by [Babel], but there are usually rules in the Webpack configuration that exclude the `node_modules` directory from transpilation (as they're usually already distributed as ES5 modules).
That will usually look something like this:

```js
module.exports = {
  entry: "./checkout-custom/index.jsx",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "../assets/checkout-custom.js"
  }
};
```

With this configuration, Babel won't transpile the Custard.js library and you'll be left with an awkward mix in the output bundle, leading to the browser console reporting `Class constructor CustardModule cannot be invoked without 'new'` errors.
To resolve this error, we just need to make sure that Babel does transpile Custard by making sure the `exclude` directive for the Babel loader doesn't apply to Disco's modules:

```js
module.exports = {
  entry: "./checkout-custom/index.jsx",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!@discolabs)/,
        loader: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "../assets/checkout-custom.js"
  }
};
```

Once you've made the change above, your target bundle should be happily transpiled to ES5.

## Release History
Refer to the [release history] for a full list of changes.

## Contributions
Contributions are very much welcome! Read our [contribution guidelines] for details on submitting pull requests that will be accepted.


[Disco Labs]: https://www.discolabs.com
[Submarine]: https://docs.getsubmarine.com
[Shopify Plus]: https://www.shopify.com/plus?ref=disco
[Slate]: https://github.com/Shopify/slate
[Troubleshooting]: #troubleshooting
[Babel]: https://babeljs.io
[release history]: https://github.com/discolabs/custard-js/releases
[contribution guidelines]: https://github.com/discolabs/custard-js/blob/master/CONTRIBUTING.md
