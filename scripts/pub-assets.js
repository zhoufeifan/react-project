const shell = require("shelljs");
const {name,version} = require('../package.json');
const path = require('path');
const distPath = path.resolve(`../../cashier-assets/${name}/${version}/`);
shell.exec(`mkdir -p ${distPath}`);
shell.exec(`cp -r dist/  ${distPath}/`);
shell.exec(`cd ../../cashier-assets;git pull;git add *;git ci -am ..;git push;cd -`);
