"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentWithShared = componentWithShared;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const path_1 = require("path");
function componentWithShared(options) {
    return (tree, context) => {
        context.logger.info(`🔧 Running custom schematic with name: ${options.name}`);
        const name = core_1.strings.dasherize(options.name);
        const className = core_1.strings.classify(options.name);
        const targetPath = (0, path_1.normalize)(`${options.path || 'src/app'}/${name}`);
        context.logger.info(`📁 Target path: ${targetPath}`);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.template)(Object.assign(Object.assign({}, options), core_1.strings)),
            (0, schematics_1.move)(targetPath),
        ]);
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)(templateSource)
        ]);
    };
}
