const config = require('../ossConfig.json');
const assetConfig = config.asset;
const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const co = require('co');
const chalk = require('chalk');

async function getFiles(parentName, dirPath) {
    const files = fs.readdirSync(dirPath);
    let fileArr = [];
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dirPath, files[i]);
        const itemIsDir = await isDir(filePath);
        const fileName = path.join(parentName, files[i]);
        if (itemIsDir) {
            fileArr = fileArr.concat(await getFiles(fileName, filePath));
        } else {
            fileArr.push(fileName);
        }
    }
    return fileArr;
}

async function isDir(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (error, stat) => {
            if (error) {
                reject(error);
            } else {
                resolve(stat.isDirectory());
            }
        });
    });
}

async function getAssets(destPath,dirPath) {
    let files = [];
    if (await isDir(dirPath)){
        files = await getFiles('',dirPath);
    }else {
        files.push(dirPath);
    }
    const assets = files.filter(item => {
        return assetConfig.exts.some(ext => item.endsWith(ext));
    });
    return assets.map(item => {
        return {
            name: path.join(destPath,item),
            path: path.join(dirPath, item)
        };
    });
}

async function uploadAsset(asset) {
    const client = new OSS({
        region: assetConfig.region,
        accessKeyId: assetConfig.accessKeyId,
        accessKeySecret: assetConfig.accessKeySecret,
        bucket: assetConfig.bucket
    });
    const stream = fs.createReadStream(asset.path);
    return new Promise((resolve, reject) => {
        co(function*() {
            const result = yield client.putStream(asset.name, stream);
            resolve(result.url);
        });
    });
}

async function uploadAssets(assets) {
    const spinner = ora('uploading assets');
    spinner.start();
    for (let i = 0; i < assets.length; i++) {
        await uploadAsset(assets[i]);
    }
    spinner.stop();
    console.log(chalk.green('发布成功!'));
}


let upload = async function () {
    const dirPath = process.cwd();
    const destPath = assetConfig.destDir;
    const srcPath = path.join(dirPath, assetConfig.sourceDir);
    let assets = await getAssets(destPath,srcPath);
    await uploadAssets(assets);
}
upload();



