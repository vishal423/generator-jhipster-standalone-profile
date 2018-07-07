'use strict';
const path = require('path');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

describe('generator-jhipster-standalone-profile:app', () => {
  it('creates standalone profile configuration file', () => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../__tests__/templates/microservice/'), dir);
      })
      .then(() => {
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const configPath = `${resourceDir}config/application-standalone.yml`;
        assert.file([configPath]);
      });
  });
});
