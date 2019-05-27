const express = require("express");
const fs = require("fs");
const path = require('path');
const util = require('util');
const json = require('comment-json');
const app = express();

const port = process.env.APPD_SERVER_PORT || 3000;
const configurationFolder = process.env.APPD_CONFIG_FOLDER || './configurations';

app.get('/appd/v1/apps/search', (req, res, next) => {
    const user = req.header('impersonated_user') || req.header('user');
    fetchConfigurations(user).then(applications => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({applications: applications}));
    }).catch(err => next(err));
});

app.listen(port,
           () => console.log(`Glue42 demo AppD server listening on ${port}. Will load configurations from ${configurationFolder} folder`));

function configToManifest(config)
{
    return {
        name: config.name,
        version: "1",
        title: config.title,
        manifestType: "Glue42",
        manifest: JSON.stringify(config)
    }
}

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

function fetchConfigurations(user)
{
    console.log(`fetching configurations for ${user}`);

    return readDir(configurationFolder)
            .then(files => files.map(fn => readFile(path.join(configurationFolder, fn), 'utf8').then(json.parse)))
            .then(p => Promise.all(p))
            .then(configs => configs.reduce((acc, cfg) => acc.concat(Array.isArray(cfg)
                                                                             ? cfg.map(configToManifest)
                                                                             : configToManifest(cfg)), []));

}

