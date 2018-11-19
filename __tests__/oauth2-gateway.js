'use strict';
const path = require('path');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

describe('generator-jhipster-standalone-profile:app', () => {
  it('creates in-memory-data service file, update package json, webpack conf, constant, core module and readme', () => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, './templates/oauth2-gateway/'), dir);
      })
      .then(() => {
        assert.file([`${jhipsterConstants.CLIENT_MAIN_SRC_DIR}/app/core/in-memory-data.service.ts`]);
        assert.fileContent('package.json', /"angular-in-memory-web-api":\s*"0\.7\.0"/);
        assert.fileContent('package.json', /"@angular\/http":\s*"7\.0\.0"/);
        assert.fileContent(
          'package.json',
          /"start:standalone":\s*"yarn\s*run\s*webpack:dev\s*--env\.profile=standalone"/
        );

        assert.fileContent('README.md', /## Standalone Development/);
        assert.fileContent('README.md', /\.\/mvnw -Pdev,standalone/);
        assert.fileContent('README.md', /yarn start:standalone/);

        assert.fileContent(
          `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/app.constants.ts`,
          'export const BUILD_PROFILE = process.env.BUILD_PROFILE;'
        );

        assert.fileContent(
          `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/core/core.module.ts`,
          `import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';`
        );

        assert.fileContent(
          `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/core/core.module.ts`,
          `BUILD_PROFILE === 'standalone'`
        );

        assert.fileContent(`${jhipsterConstants.CLIENT_MAIN_SRC_DIR}i18n/en/global.json`, `"standalone": "Standalone"`);
      });
  });
});
