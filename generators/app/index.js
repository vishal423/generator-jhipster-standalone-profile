'use strict';

const chalk = require('chalk');
const standalonePackageJson = require('../../package.json');

const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    if (this.destinationPath('.yo-rc.json')) {
      const fileData = this.fs.readJSON(this.destinationPath('.yo-rc.json'));
      if (fileData && fileData['generator-jhipster']) {
        this.jhipsterAppConfig = fileData['generator-jhipster'];
      } else {
        this.error('.yo-rc.json not found');
      }
    }
    this.srcConfigPath = `${jhipsterConstants.SERVER_MAIN_SRC_DIR}${this.jhipsterAppConfig.packageFolder}/config/`;
  }

  get initializing() {
    return {
      readConfig() {
        // Read config
      },
      banner() {
        /* eslint-disable */
        this.log(`${chalk.green('███████  ████████     ██      ██     ██  ██████         ██      ██       ███████   ██     ██  ██████ ')}`);
        this.log(`${chalk.green('██          ██       ████     ███    ██  ██    ██      ████     ██      ██     ██  ███    ██  ██     ')}`);
        this.log(`${chalk.green('███████     ██      ██  ██    ██ ██  ██  ██     ██    ██  ██    ██      ██     ██  ██ ██  ██  █████  ')}`);
        this.log(`${chalk.green('     ██     ██     ████████   ██   ████  ██    ██    ████████   ██      ██     ██  ██   ████  ██     ')}`);
        this.log(`${chalk.green('███████     ██    ██      ██  ██     ██  ██████     ██      ██  ██████   ███████   ██     ██  ██████ ')}`);
        /* eslint-disable */
        this.log(`Welcome to the ${chalk.bold.green('Standalone profile')} ${chalk.yellow(`v${standalonePackageJson.version}`)} configurer!`);
      }
    };
  }

  get writing() {
    return {
      handleWebAppSecurityConfiguration() {
        const existingContent = this.fs.read(this.destinationPath(`${this.srcConfigPath}SecurityConfiguration.java`), {
          defaults: 'dummy'
        });
        if (existingContent !== 'dummy') {
          if (
            existingContent.indexOf('@EnableWebSecurity') !== -1 ||
            existingContent.indexOf('@EnableResourceServer') !== -1
          ) {
            this.fs.copyTpl(
              this.templatePath('StandaloneSecurityConfiguration.java.ejs'),
              this.destinationPath(`${this.srcConfigPath}StandaloneSecurityConfiguration.java`),
              this.jhipsterAppConfig
            );

            if (existingContent.indexOf('@Profile("!standalone")') === -1) {
              let updatedContent = existingContent.replace(
                /@EnableWebSecurity\n(@Profile\("!standalone"\)\n)?/g,
                '@EnableWebSecurity\n@Profile("!standalone")\n'
              );
              updatedContent = updatedContent.replace(
                /@EnableResourceServer\n(@Profile\("!standalone"\)\n)?/g,
                '@EnableResourceServer\n@Profile("!standalone")\n'
              );

              if (updatedContent.indexOf('import org.springframework.context.annotation.Profile;') === -1) {
                updatedContent = updatedContent.replace(
                  /import\sorg\.springframework\.context\.annotation\.Configuration;\n(import\sorg\.springframework\.context\.annotation\.Profile;\n)?/g,
                  'import org.springframework.context.annotation.Configuration;\nimport org.springframework.context.annotation.Profile;\n'
                );
              }
              this.fs.write(this.destinationPath(`${this.srcConfigPath}SecurityConfiguration.java`), updatedContent);
            }
          }
        }
      },
      copySpringProfileConfiguration() {
        const configPath = `${jhipsterConstants.SERVER_MAIN_RES_DIR}config/application-standalone.yml`;
        this.fs.copyTpl(
          this.templatePath('application-standalone.yml.ejs'),
          this.destinationPath(configPath),
          this.jhipsterAppConfig
        );
      },
      updateReadme() {
        const newContent = this.fs.read(this.templatePath('README.md.ejs'));
        const existingContent = this.fs.read(this.destinationPath('README.md'), { defaults: 'dummy' });
        if (existingContent !== 'dummy') {
          const updatedContent = existingContent.replace(
            /(## Standalone Development([\n\t\sa-zA-Z0-9,\-: ./()[\]])*)?## Building for production\n/g,
            newContent
          );
          this.fs.write(this.destinationPath('README.md'), updatedContent);
        }
      },
      addMavenProfile() {
        const buildTool = this.jhipsterAppConfig.buildTool;
        if (buildTool === 'maven') {
          const newContent = this.fs.read(this.templatePath('pom-profile.xml.ejs'));
          this.addMavenProfile('standalone', `            ${newContent.trim()}`);
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
