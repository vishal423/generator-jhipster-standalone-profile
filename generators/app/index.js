'use strict';

const chalk = require('chalk');

const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = class extends BaseGenerator {
  get initializing() {
    return {
      readConfig() {
        this.jhipsterAppConfig = this.getJhipsterAppConfig();
        if (!this.jhipsterAppConfig) {
          this.error('.yo-rc.json not found');
        }
      },
      banner() {
        this.log(`Welcome to the ${chalk.bold.yellow('Spring boot standalone profile')} configurer!`);
      }
    };
  }

  writing() {
    this.template = (source, destination) => {
      this.fs.copyTpl(this.templatePath(source), this.destinationPath(destination), this);
    };
    const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
    const configPath = `${resourceDir}config/application-standalone.yml`;
    const applicationType = this.jhipsterAppConfig.applicationType;
    switch (applicationType) {
      case 'microservice':
        this.template('microservice-standalone.yml', configPath);
        break;
      default:
        this.error(`Unsupported application type : ${applicationType}`);
    }
  }

  end() {
    this.log('Spring boot standalone profile successfully configured in your Jhipster application.');
  }
};
