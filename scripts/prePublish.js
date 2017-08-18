const copyFiles = require('./copyDir.js');
const config = require('../config/config.js');
copyFiles("./build/teddy",config.preDestUrl);