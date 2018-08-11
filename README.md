# generator-jhipster-standalone-profile [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![code style: prettier][prettier-image]][prettier-url]
> Add Standalone profile support in Jhipster applications

# Introduction

This is a [JHipster](https://www.jhipster.tech/) module, that is meant to be used in a JHipster application. During development, especially in micro-service architecture, to access secure micro-service endpoint, you often need to start `Jhipster Registry` and `UAA` / `OpenID connect` server. Scaling, security are not concerns during development and often adds an additional overhead.

To simplify development experience, this module adds new spring boot `standalone` profile and integrates with corresponding `standalone` maven profile. It is an add-on profile like `no-liquibase` and should be used along with main profile like `dev`.

This module supports following authentication types:
- OIDC
- UAA
- JWT

This module supports following discovery services:
- Jhipster Registry (Eureka)

# Pre-requisites

This guide assumes that you have already setup a Jhipster application.

# Installation

Use following command to globally install this module:

```bash
yarn global add generator-jhipster-standalone-profile
```

# Usage
- Navigate to Jhipster application root directory.
- Use following command to add standalone profile support:

  ```bash
  yo jhipster-standalone-profile
  ```
- Resolve conficts, if any.
- Use following command to do development in standalone mode:
  ```bash
  ./mvnw -Pdev,standalone
  ```
## License

MIT © [Vishal Mahajan]()


[npm-image]: https://badge.fury.io/js/generator-jhipster-standalone-profile.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-standalone-profile
[travis-image]: https://travis-ci.org/vishal423/generator-jhipster-standalone-profile.svg?branch=master
[travis-url]: https://travis-ci.org/vishal423/generator-jhipster-standalone-profile
[daviddm-image]: https://david-dm.org/vishal423/generator-jhipster-standalone-profile.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/vishal423/generator-jhipster-standalone-profile
[coveralls-image]: https://coveralls.io/repos/github/vishal423/generator-jhipster-standalone-profile/badge.svg
[coveralls-url]: https://coveralls.io/github/vishal423/generator-jhipster-standalone-profile
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
