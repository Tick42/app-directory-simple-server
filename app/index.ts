import * as express from 'express';
import * as path from 'path';

import * as json from 'comment-json';
import { readFile, assetsDir } from './utils';
import { appReaderFactory } from './app-readers/app-reader-factory';
import { appFilterFactory } from './app-filters/app-filter-factory';
import { roleReaderFactory } from './role-readers/role-reader-factory';
// import { FDC3AppConfig } from './types/fdc3-app-config';



const app = express();
console.log(process.cwd());
readFile(path.resolve(assetsDir, 'app-config.json'), 'utf8').then(json.parse)
    .then((config) => {
        const port = config.server.port || 3000;
        console.log(JSON.stringify(config, null, 2));

        const appReader = appReaderFactory(config.appReader.type, config.appReader.config);
        const roleReader = roleReaderFactory(config.roleReader.type, config.roleReader.config);
        const appFilter = appFilterFactory(config.appFilter.type, config.appFilter.config);

        // console.log(config, port);

        // // const configurationFolder = config.appReader. process.env.APPD_CONFIG_FOLDER || './configurations';

        app.get('/appd/v1/apps/search', async (req: any, res: any, next: any) => {
            const username = req.header('impersonated_user') || req.header('user');

            const allApps = await appReader.getApps();
            console.log('all apps', allApps.length)

            const userRoles = await roleReader.getRolesForUser(username);
            console.log('user roles', userRoles);

            const filteredApps = await appFilter.filterApps(allApps, userRoles);
            console.log('filtered apps', filteredApps.length);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({applications: filteredApps}));
        });

        app.listen(port, () => {
            return console.log(`Glue42 demo AppD server listening on ${port}.`)
        });
    }).catch(err => {
        console.error(err);
    })

// function



// function fetchConfigurations(username: string) {
//     console.log(`fetching configurations for ${username}`);

//     // return readDir(configurationFolder)
//     //     .then((files: any) => files.map((fileName: string) => readFile(path.join(configurationFolder, fileName), 'utf8').then(json.parse)))
//     //     .then((promises: Promise<any>[]) => Promise.all(promises))
//     //     .then((configs: any) => {
//     //         let appConfigs = configs.reduce((acc: any, cfg: any) => acc.concat(Array.isArray(cfg) ? cfg.map(configToManifest): configToManifest(cfg)), [])
//     //         console.log(appConfigs);
//     //         return appConfigs
//     //     });

// }

