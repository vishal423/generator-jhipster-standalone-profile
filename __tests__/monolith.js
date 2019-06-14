'use strict';
const path = require('path');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

describe('generator-jhipster-standalone-profile:app', () => {
  it('creates spring boot configuration file, maven profile, standalone security configuration and update readme', () => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, './templates/monolith/'), dir);
      })
      .withPrompts({ client: true, server: true })
      .on('ready', gen => {
        gen.npmInstall = () => {};
      })
      .then(() => {
        assert.file([`${jhipsterConstants.SERVER_MAIN_RES_DIR}config/application-standalone.yml`]);
        assert.fileContent('pom.xml', /dev,standalone\${profile.swagger}\${profile.no-liquibase}/);
        assert.fileContent('README.md', /## Standalone Development/);
        assert.fileContent('README.md', /\.\/mvnw -Pdev,standalone/);

        assert.fileContent('README.md', /npm run start:standalone/);

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

        assert.fileContent(
          `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}i18n/en/global.json`,
          `"standalone": "Standalone"`
        );

        assert.fileContent('package.json', /"angular-in-memory-web-api":\s*"0\.8\.0"/);
        assert.fileContent(
          'package.json',
          /"start:standalone":\s*"npm\s*run\s*webpack:dev\s*--\s*--env\.profile=standalone"/
        );

        const fileData = fs.readJSONSync('.yo-rc.json');
        if (fileData && fileData['generator-jhipster']) {
          const jhipsterConfig = fileData['generator-jhipster'];
          const srcConfigPath = `${jhipsterConstants.SERVER_MAIN_SRC_DIR}${jhipsterConfig.packageFolder}/config/`;
          assert.fileContent(
            `${srcConfigPath}SecurityConfiguration.java`,
            /@Profile\("!standalone"\)/
          );

          assert.file([`${srcConfigPath}StandaloneSecurityConfiguration.java`]);
          assert.fileContent(
            `${srcConfigPath}StandaloneSecurityConfiguration.java`,
            /@Profile\("standalone"\)/
          );
        }
      });
  });
});
