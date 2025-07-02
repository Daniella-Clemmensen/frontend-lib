const fs = require('fs');
const path = require('path');
const stripJsonComments = require('strip-json-comments').default;

const tsConfigPath = path.resolve(__dirname, '../../tsconfig.json');
const basePath = 'app'; // Because baseUrl is "src", we start paths from "app/"

const alias = {
    "@core": ['core/*'],
    "@shared": ['shared/*'],
    "@features": ['features/*'],
    "@styles": ['styles/*'],
};

function updateTsConfig() {
  if (!fs.existsSync(tsConfigPath)) {
    console.error(`tsconfig.json not found at ${tsConfigPath}`);
    return;
  }

  const rawConfig = fs.readFileSync(tsConfigPath, 'utf8');
  const tsConfig = JSON.parse(stripJsonComments(rawConfig));

  tsConfig.compilerOptions = tsConfig.compilerOptions || {};
  tsConfig.compilerOptions.baseUrl = 'src';
  tsConfig.compilerOptions.paths = tsConfig.compilerOptions.paths || {};

  Object.keys(tsConfig.compilerOptions.paths).forEach((key) => {
    if (
      key.startsWith('@core') ||
      key.startsWith('@shared') ||
      key.startsWith('@features') ||
      key.startsWith('@styles')
    ) {
      delete tsConfig.compilerOptions.paths[key];
    }
  });

  for (const [aliasName, paths] of Object.entries(alias)) {
    tsConfig.compilerOptions.paths[`${aliasName}/*`] = paths.map(
      (p) => `${basePath}/${p}`
    );
  }

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  console.log('✅ TypeScript path aliases successfully updated.');
}

updateTsConfig();
