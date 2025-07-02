const fs = require('fs');
const path = require('path');
const tsConfigPath = path.resolve(__dirname, '../../tsconfig.json');
const basePath = 'src/app';


const alias = {
    "@core": ['app/core/*'],
    "@shared": ['app/shared/*'],
    "@features": ['app/features/*'],
    "@styles": ['app/styles/*'],
}

function updateTsConfig() {
    if (!fs.existsSync(tsConfigPath)) {
        console.error(`tsconfig.json not found at ${tsConfigPath}`);
        return;
    }

const stripJsonComments = require('strip-json-comments').default;
const tsConfig = JSON.parse(stripJsonComments(fs.readFileSync(tsConfigPath, 'utf8')));

    if (!tsConfig.compilerOptions) {
        tsConfig.compilerOptions = {};
    }

    if (!tsConfig.compilerOptions.paths) {
        tsConfig.compilerOptions.paths = {};
    }

    for (const [aliasName, paths] of Object.entries(alias)) {
        tsConfig.compilerOptions.paths[aliasName] = paths.map(p => `${basePath}/${p}`)

    }

    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
}
updateTsConfig();