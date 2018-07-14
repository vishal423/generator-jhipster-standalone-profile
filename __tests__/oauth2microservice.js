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
        fs.copySync(path.join(__dirname, './templates/oauth2microservice/'), dir);
      })
      .then(() => {
        assert.file([`${jhipsterConstants.SERVER_MAIN_RES_DIR}config/application-standalone.yml`]);
        assert.fileContent('pom.xml', /dev,standalone\${profile.swagger}\${profile.no-liquibase}/);
        assert.fileContent('README.md', /## Standalone Development/);
        assert.fileContent('README.md', /\.\/mvnw -Pdev,standalone/);

        const fileData = fs.readJSONSync('.yo-rc.json');
        if (fileData && fileData['generator-jhipster']) {
          const jhipsterConfig = fileData['generator-jhipster'];
          const srcConfigPath = `${jhipsterConstants.SERVER_MAIN_SRC_DIR}${jhipsterConfig.packageFolder}/config/`;
          assert.fileContent(`${srcConfigPath}MicroserviceSecurityConfiguration.java`, /@Profile\("!standalone"\)/);
        }
      });
  });
});
