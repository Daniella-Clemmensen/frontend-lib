"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentWithShared = componentWithShared;
const schematics_1 = require("@angular-devkit/schematics");
const path_1 = require("path");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const ts = __importStar(require("typescript"));
const change_1 = require("@schematics/angular/utility/change");
function componentWithShared(options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        const componentRule = yield (0, schematics_1.externalSchematic)('@schematics/angular', 'component', Object.assign(Object.assign({}, options), { style: 'scss', inlineStyle: false, inlineTemplate: false }));
        const sharedImportRule = (tree) => {
            const modulePath = (0, path_1.normalize)(`${options.path}/${options.module}`);
            const buffer = tree.read(modulePath);
            if (!buffer)
                return tree;
            const sourceText = buffer.toString('utf-8');
            const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
            const changes = (0, ast_utils_1.addImportToModule)(source, modulePath, 'SharedModule', './shared.module');
            const recorder = tree.beginUpdate(modulePath);
            for (const change of changes) {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertLeft(change.pos, change.toAdd);
                }
            }
            tree.commitUpdate(recorder);
            return tree;
        };
        return (0, schematics_1.chain)([componentRule, sharedImportRule]);
    });
}
