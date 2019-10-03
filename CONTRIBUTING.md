# Contributing to Custard
We love to accept pull requests from anyone interested in helping out with the Custard project.
Note that by participating in this project, you agree to both:

- abide by Disco's [Open Source Code of Conduct];
- license your contribution under the [MIT License].

[Open Source Code of Conduct]: https://www.discolabs.com/open-source-code-of-conduct/
[MIT License]: https://choosealicense.com/licenses/mit/


## Submitting a Pull Request
Fork, then clone the repo:

    git clone git@github.com:your-username/custard-js.git

Install all dependencies for building and running tests:

    yarn install

Make sure the tests pass:

    yarn test

Make your change. Add tests for your change. Make the tests pass:

    yarn test

Push to your fork and [submit a pull request].

**Please ask first** before embarking on any significant pull request to avoid spending lots of time working on something we may not wish to merge.

Note that we use the [git flow] branching model for development, so please complete your work on a feature branch off `develop` and open your pull requests back against `develop`.

[submit a pull request]: https://github.com/discolabs/custard-js/compare/
[git flow]: https://nvie.com/posts/a-successful-git-branching-model/


## Custard Development Philosophy
The overarching goal of Custard is to make checkout customisations as easy as possible for Shopify developers to implement, and to do so in a standardised way.
To help achieve that goal, we try to stick to the following philosophical guidelines:

- **User-Friendly**: A junior web developer new to Shopify development should be able to pick up and find the library useful within a couple of hours. Docs should be as comprehensive as possible and easy to follow.
- **Real-World Code**: Features should only be added when they've proven useful on real-world Shopify stores. Issues and feature requests made in a vacuum should be rejected until a concrete case can be made for them.
- **Opinionated**: Pick a sensible way of doing things that works for 90% of use cases and make that the default, instead of allowing many different configurations.  
