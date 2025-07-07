const fs = require('fs');
const path = require('path');

const baseUrl = 'src';
const tsConfigPath = path.resolve(__dirname, '../../tsconfig.paths.json');
const appRoot = path.resolve(__dirname, '../../src/app');

function toAliasKey(appRelativePath) {
  return '@' + appRelativePath.replace(/^app\//, '').replace(/\/$/, '').replace(/\//g, '/');
}

function walk(dir, appRelative = 'app') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const aliases = {};

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const entryName = entry.name;
      const fullPath = path.join(dir, entryName);
      const relativePath = `${appRelative}/${entryName}`.replace(/\\/g, '/');
      const aliasKey = toAliasKey(relativePath) + '/*';

      aliases[aliasKey] = [relativePath + '/*'];

      // Recurse into subfolders
      Object.assign(aliases, walk(fullPath, relativePath));
    }
  }

  return aliases;
}

function generatePathsConfig() {
  const paths = walk(appRoot);
  const tsconfig = {
    compilerOptions: {
      baseUrl,
      paths
    }
  };

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('✅ tsconfig.paths.json generated successfully!');
}

generatePathsConfig();
