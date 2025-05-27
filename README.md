JUST RUN NPM INSTALL AND AUTOMATICALY CONFIGURES FOR U

CHECK .ENV.EXAMPLE FOR CONFIG SETTINGS

DONT FORGET TO INCLUDE METRO CONFIG.JS

const {getDefaultConfig} = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("cjs");
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
    
IN ORDER FOR EXPORTS TO PROPERLY BE CALLED
