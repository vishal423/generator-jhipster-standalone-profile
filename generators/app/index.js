'use strict';

const chalk = require('chalk');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.jhipsterAppConfig = this.getJhipsterAppConfig();
    this.srcConfigPath = `${jhipsterConstants.SERVER_MAIN_SRC_DIR}${this.jhipsterAppConfig.packageFolder}/config/`;
    this.applicationType = this.jhipsterAppConfig.applicationType;
  }

  get initializing() {
    return {
      readConfig() {
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
      handleWebAppSecurityConfiguration() {
        switch (this.applicationType) {
          case 'monolith':
            this.template(
              'StandaloneSecurityConfiguration.java.ejs',
              `${this.srcConfigPath}/StandaloneSecurityConfiguration.java`,
              this,
              {},
              this.jhipsterAppConfig
            );
            this.replaceContent(
              `${this.srcConfigPath}SecurityConfiguration.java`,
              /(@Profile\("!standalone"\)\n)|(import org\.springframework\.context\.annotation\.Profile;\n)/g,
              '',
              true
            );
            this.replaceContent(
              `${this.srcConfigPath}SecurityConfiguration.java`,
              '@EnableWebSecurity\n',
              '@EnableWebSecurity\n@Profile("!standalone")\n',
              false
            );
            this.replaceContent(
              `${this.srcConfigPath}SecurityConfiguration.java`,
              'import org.springframework.context.annotation.Import;\n',
              'import org.springframework.context.annotation.Import;\nimport org.springframework.context.annotation.Profile;\n',
              false
            );
            break;
          case 'microservice':
            break;
          default:
            this.error(`Unsupported application type : ${this.applicationType}`);
        }
      },
      copySpringProfileConfiguration() {
        const configPath = `${jhipsterConstants.SERVER_MAIN_RES_DIR}config/application-standalone.yml`;

        switch (this.applicationType) {
          case 'monolith':
          case 'microservice':
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
            this.error(`Unsupported application type : ${this.applicationType}`);
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
