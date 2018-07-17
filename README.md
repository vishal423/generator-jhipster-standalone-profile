# generator-jhipster-standalone-profile [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![code style: prettier][prettier-image]][prettier-url]
> Add Spring boot standalone profile support in Jhipster applications

# Introduction

This is a [JHipster](https://www.jhipster.tech/) module, that is meant to be used in a JHipster application. It adds spring boot `standalone` profile on top of `dev` profile to disable concerns not required during standalone development. This is particularly useful when building with microservices architecture as you don't need to start Registry, Gateway, UAA in standalone mode.

It effectively set following configurations:
- Bypass Spring security
- Disable service registration and discovery
- Enable CORS


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
