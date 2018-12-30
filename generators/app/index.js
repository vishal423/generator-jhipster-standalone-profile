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
    this.srcConfigPath = `${jhipsterConstants.SERVER_MAIN_SRC_DIR}${
      this.jhipsterAppConfig.packageFolder
    }/config/`;
    this.clientPackageManagerPrefix =
      this.jhipsterAppConfig.clientPackageManager === 'yarn' ? 'yarn' : 'npm run';
    this.clientPackageManagerOptionsPrefix =
      this.jhipsterAppConfig.clientPackageManager === 'yarn' ? '' : ' -- ';
  }

  get initializing() {
    return {
      readConfig() {
        // Read config
      },
      banner() {
        /* eslint-disable */
        this.log(
          `${chalk.green(`
    ███████  ████████     ██      ██     ██  ██████         ██      ██       ███████   ██     ██  ██████
    ██          ██       ████     ███    ██  ██    ██      ████     ██      ██     ██  ███    ██  ██
    ███████     ██      ██  ██    ██ ██  ██  ██     ██    ██  ██    ██      ██     ██  ██ ██  ██  █████
         ██     ██     ████████   ██   ████  ██    ██    ████████   ██      ██     ██  ██   ████  ██
    ███████     ██    ██      ██  ██     ██  ██████     ██      ██  ██████   ███████   ██     ██  ██████`)}`
        );
        /* eslint-disable */
        this.log(
          `Welcome to the ${chalk.bold.green('Standalone profile')} ${chalk.yellow(
            `v${standalonePackageJson.version}`
          )} configurer!`
        );
      }
    };
  }

  async prompting() {
    this.options = {
      client: this.config.get('client'),
      server: this.config.get('server')
    };
    if (
      !this.jhipsterAppConfig.skipClient &&
      this.jhipsterAppConfig.clientFramework === 'angularX' &&
      this.options.client === undefined
    ) {
      const clientPrompt = await this.prompt({
        type: 'confirm',
        name: 'client',
        message: 'Would you like to enable standalone profile on client side?'
      });
      this.options.client = clientPrompt.client || false;
    }
    if (this.options.server === undefined) {
      const serverPrompt = await this.prompt(
        {
          type: 'confirm',
          name: 'server',
          message: 'Would you like to enable standalone profile on server side?'
        });
      this.options.server = serverPrompt.server || false;
    }
    this.config.set({
      version: standalonePackageJson.version,
      client: this.options.client,
      server: this.options.server
    });
  }

  get writing() {
    return {
      handleWebAppSecurityConfiguration() {
        if (this.options.server) {
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
        }
      },
      copySpringProfileConfiguration() {
        if (this.options.server) {
          const configPath = `${jhipsterConstants.SERVER_MAIN_RES_DIR}config/application-standalone.yml`;
          this.fs.copyTpl(
            this.templatePath('application-standalone.yml.ejs'),
            this.destinationPath(configPath),
            this.jhipsterAppConfig
          );
        }
      },
      updateReadme() {
        if (this.options.server) {
          const newContent = this.fs.read(this.templatePath('README.md.ejs'));
          const existingContent = this.fs.read(this.destinationPath('README.md'), { defaults: 'dummy' });
          if (existingContent !== 'dummy') {
            let updatedContent = existingContent.replace(
              /(#?## Standalone Development([\n\t\sa-zA-Z0-9,\-: ./()[\]])*)?## Building for production\n/g,
              newContent
            );

            updatedContent = updatedContent.replace(/%clientPackageManager%/g, this.clientPackageManagerPrefix);
            this.fs.write(this.destinationPath('README.md'), updatedContent);
          }
        }
      },
      addMavenProfile() {
        if (this.options.server) {
          const buildTool = this.jhipsterAppConfig.buildTool;
          if (buildTool === 'maven') {
            const newContent = this.fs.read(this.templatePath('pom-profile.xml.ejs'));
            this.addMavenProfile('standalone', `            ${newContent.trim()}`);
          } else {
            this.error(`Unsupported build tool : ${buildTool}`);
          }
        }
      },
      updatePackageJson() {
        if (this.options.client) {
          const packageTemplate = this.fs.read(this.templatePath('package.json'));
          const existingPackageJson = this.fs.read(this.destinationPath('package.json'), { defaults: 'dummy' });

          if (existingPackageJson.indexOf('angular-in-memory-web-api') === -1) {
            let updatedContent = packageTemplate.replace(
              /%clientPackageManager%/g,
              this.jhipsterAppConfig.clientPackageManager
            );

            updatedContent = updatedContent.replace(
              /%clientPackageManagerOptionsPrefix%/g,
              this.clientPackageManagerOptionsPrefix
            );
            this.fs.extendJSON(this.destinationPath('package.json'), JSON.parse(updatedContent));
          }
        }
      },
      updateWebpackConfig() {
        if (this.options.client) {
          const existingWebpackCommonContent = this.fs.read(this.destinationPath('webpack/webpack.common.js'), {
            defaults: 'dummy'
          });

          if (existingWebpackCommonContent !== 'dummy') {
            const updatedWebpackCommonContent = existingWebpackCommonContent.replace(
              /SERVER_API_URL:\s*`''`\s*(,\n\s*BUILD_PROFILE:\s*`'\$\{options.profile\}'`)?/g,
              "SERVER_API_URL: `''`,\n                BUILD_PROFILE: `'${options.profile}'`"
            );

            this.fs.write(this.destinationPath('webpack/webpack.common.js'), updatedWebpackCommonContent);
          }

          const existingWebpackDevContent = this.fs.read(this.destinationPath('webpack/webpack.dev.js'), {
            defaults: 'dummy'
          });

          if (existingWebpackDevContent !== 'dummy') {
            const updatedWebpackDevContent = existingWebpackDevContent.replace(
              /{\s*env:\s*ENV(,\s*profile:\s*options.profile)?/g,
              '{ env: ENV, profile: options.profile'
            );

            this.fs.write(this.destinationPath('webpack/webpack.dev.js'), updatedWebpackDevContent);
          }
        }
      },
      updateFrontendFiles() {
        if (this.options.client) {
          const clientDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
          const existingConstantsContent = this.fs.read(this.destinationPath(`${clientDir}/app/app.constants.ts`), {
            defaults: 'dummy'
          });

          if (existingConstantsContent !== 'dummy' && existingConstantsContent.indexOf('BUILD_PROFILE') === -1) {
            this.fs.append(
              this.destinationPath(`${clientDir}/app/app.constants.ts`),
              'export const BUILD_PROFILE = process.env.BUILD_PROFILE;\n',
              { trimEnd: false }
            );
          }

          // update core.module
          const existingCoreModuleContent = this.fs.read(this.destinationPath(`${clientDir}/app/core/core.module.ts`), {
            defaults: 'dummy'
          });

          if (existingCoreModuleContent !== 'dummy') {
            let updatedCoreModuleContent = existingCoreModuleContent.replace(
              /(\n?import\s*\{\s*HttpClientInMemoryWebApiModule\s*\}\s*from([\n\t\sa-zA-Z0-9_,\-:\{\}.;/\()[\]'])*)?\n@NgModule\({/g,
              `\nimport { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';\nimport { InMemoryDataService } from 'app/core/in-memory-data.service';\nimport { BUILD_PROFILE } from 'app/app.constants';\n\n@NgModule({`
            );
            //(,\n\s*([\n\s\tA-Za-z0-9='_\-?.\():\{\}])*\[])?
            updatedCoreModuleContent = updatedCoreModuleContent.replace(
              /imports:\s*\[\s*\n?\s*HttpClientModule(,([\n\s\tA-Za-z0-9='_\-?.,\():\{\}])*\[]\s*)?/g,
              `imports: [\n        HttpClientModule,\n        BUILD_PROFILE === 'standalone'\n            ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500, passThruUnknownUrl: true, put204: false, post204: false })\n            : []\n    `
            );

            this.fs.write(this.destinationPath(`${clientDir}/app/core/core.module.ts`), updatedCoreModuleContent);
          }

          // update translations
          const existingI18nContent = this.fs.read(this.destinationPath(`${clientDir}/i18n/en/global.json`), {
            defaults: 'dummy'
          });

          if (existingI18nContent !== 'dummy') {
            let updatedI18nContent = existingI18nContent.replace(
              /(\n\s*"standalone":\s*"Standalone"\s*,\s*\n)?\s*"dev"\s*:\s*"Development"/g,
              `\n            "standalone": "Standalone",\n            "dev":"Development"`
            );

            this.fs.write(this.destinationPath(`${clientDir}/i18n/en/global.json`), updatedI18nContent);
          }
        }
      },
      copyInMemoryDataService() {
        if (this.options.client) {
          this.fs.copyTpl(
            this.templatePath('in-memory-data.service.ts.ejs'),
            this.destinationPath(`${jhipsterConstants.CLIENT_MAIN_SRC_DIR}/app/core/in-memory-data.service.ts`),
            this.jhipsterAppConfig
          );
        }
      }
    };
  }

  install() {
    if (this.options.client) {
      this.log(
        `Install dependencies using: ${chalk.yellow.bold(`${this.jhipsterAppConfig.clientPackageManager} install`)}`
      );

      if (this.jhipsterAppConfig.clientPackageManager === 'yarn') {
        this.yarnInstall();
      } else {
        this.npmInstall();
      }
    }
  }

  end() {
    this.log('Standalone profile successfully configured in your JHipster application.');
    if (this.options.server) {
      this.log(
        `Use command ${chalk.bold.yellow('./mvnw -Pdev,standalone')} for backend development in the standalone mode`
      );
    }
    if (this.options.client) {
      this.log(
        `Use command ${chalk.bold.yellow(
          `${this.clientPackageManagerPrefix} start:standalone`
        )} for frontend development in the standalone mode`
      );
    }
  }
};
