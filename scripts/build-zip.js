const shell = require("shelljs");
shell.exec("cp -r dist/  nw_0.14.7/");
// shell.exec("cp -r nw_0.14.7/node_modules dist/");
// shell.exec("cp -r nw_0.14.7/package.json dist/");
shell.exec(`cd dist; zip -r build.zip ./`);



