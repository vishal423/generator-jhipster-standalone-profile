# generator-jhipster-standalone-profile [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![code style: prettier][prettier-image]][prettier-url]
> Adds Standalone profile support in JHipster applications

# Introduction

This is a [JHipster](https://www.jhipster.tech/) module, that is meant to be used in a JHipster application. 

During services development, especially in micro-service architecture, to access secure micro-service endpoint, you often need to start `JHipster Registry` and `UAA` / `OpenID Connect` server. Horizontal scaling, security are not concerns during development and often adds an additional overhead. This module helps you to bypass these concerns with an add-on profile.

Similarly, during frontend development, especially in micro-services architecture, to access RESTful services, you need to start `micro-service(s)`, `gateway`, `JHipster Registry`, and `UAA` / `OpenID Connect` server. In general, you only require service contract (request, response, headers etc) and can build fully functional client applications with this information. `standalone` profile on frontend helps you to achieve this by stubbing RESTful calls.

## Services

To simplify development experience, this module adds new spring boot `standalone` profile and integrates with corresponding `standalone` maven profile. It is an add-on profile like `no-liquibase` and should be used along with main profile like `dev`.

This module supports following authentication types:
- OIDC
- UAA
- JWT

>Note: On `gateway` application type, security is not disabled.

This module supports following discovery services:
- JHipster Registry (Eureka)

## Frontend

### Angular
This module leverages angular [in-memory-web-api](https://github.com/angular/in-memory-web-api) module to intercept HTTP requests. This module stubs calls to `api/account` and `management/info` endpoints and allow you to directly access secured pages. You can follow similar approach to intercept custom entity endpoints. You need to specify custom collections under: ```src/main/webapp/app/core/in-memory-data.service.ts```.

For more details, refer [in-memory-web-api](https://github.com/angular/in-memory-web-api) documentation. 

# Pre-requisites

This guide assumes that you have already setup a JHipster application.

# Installation

Use following command to globally install this module:

```bash
yarn global add generator-jhipster-standalone-profile
```
>Note:
If you are using JHipster v4.14.x generated applications, then, use 1.x version.

# Usage
- Navigate to JHipster application root directory.
- Use following command to add standalone profile support:

  ```bash
  yo jhipster-standalone-profile
  ```
- Resolve conficts, if any.
- Use following command to start backend services in the standalone mode:
  ```bash
  ./mvnw -Pdev,standalone
  ```
- Use following command to start angular frontend in the standalone mode:
  ```bash
  yarn start:standalone
  ```
  or
  ```bash
  npm run start:standalone
  ```
## License

MIT © [Vishal Mahajan](https://twitter.com/vishal423)


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
