'use strict';

const chalk = require('chalk');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = class extends BaseGenerator {
  get initializing() {
    return {
      readConfig() {
        this.jhipsterAppConfig = this.getJhipsterAppConfig();

        if (!this.jhipsterAppConfig.jhipsterVersion.startsWith('4.14')) {
          this.error('This module supports Jhipster applications generated with v4.14.x');
        }
        if (!this.jhipsterAppConfig) {
          this.error('.yo-rc.json not found');
        }
      },
      banner() {
        this.log(`Welcome to the ${chalk.bold.yellow('Spring boot standalone profile')} configurer!`);
      }
    };
  }

  get writing() {
    return {
      copySpringProfileConfiguration() {
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const configPath = `${resourceDir}config/application-standalone.yml`;
        const applicationType = this.jhipsterAppConfig.applicationType;
        switch (applicationType) {
          case 'microservice':
          case 'monolith':
            this.template('application-standalone.yml.ejs', configPath, this, {}, this.jhipsterAppConfig);
            this.render('README.md.ejs', content => {
              this.replaceContent(
                'README.md',
                /## Standalone Development([\n\t\sa-zA-Z0-9,\-: ./()[\]])*## Building for production/g,
                '## Building for production',
                true
              );
              this.replaceContent('README.md', /## Building for production\n/, content, true);
            });
            break;
          default:
            this.error(`Unsupported application type : ${applicationType}`);
        }
      },
      addMavenProfile() {
        const buildTool = this.jhipsterAppConfig.buildTool;
        if (buildTool === 'maven') {
          this.render('pom-profile.xml.ejs', rendered => {
            this.addMavenProfile('standalone', `            ${rendered.trim()}`);
          });
        } else {
          this.error(`Unsupported build tool : ${buildTool}`);
        }
      }
    };
  }

  end() {
    this.log('Spring boot standalone profile successfully configured in your Jhipster application.');
    this.log(`Use command ${chalk.bold.yellow('./mvnw -Pdev,standalone')} to do development in the standalone mode`);
  }
};
