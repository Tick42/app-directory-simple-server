import * as express from 'express';
import * as path from 'path';

import * as json from 'comment-json';
import { readFile, assetsDir } from './utils';
import { appReaderFactory } from './app-readers/app-reader-factory';
import { appFilterFactory } from './app-filters/app-filter-factory';
import { roleReaderFactory } from './role-readers/role-reader-factory';
// import { LDAPRoleReader } from './role-readers/ldap-role-reader';
import { UserInfo } from './types/role-reader-type';
import {RoleEditor} from '../role-editor-ui';

const app = express();

// app.use((req,res, next) => {
//     if (!req.headers.authorization) {
//         sspiServer =  new t42NodeSSPI.NodeSSPIServer('Negotiate')
//         console.log('First req');
//         res.setHeader('www-authenticate', 'Negotiate');
//         res.status(401)
//         res.end();
//     } else {
//         let ct = Buffer.from(req.headers.authorization.split(' ')[1], 'base64')
//         sspiServer.token(ct)
//             .then(st => {
//                 if (st.done) {
//                     console.log('got challenge response');
//                     req.connection['user'] = sspiServer.fqdn()
//                     console.log(sspiServer);
//                     debugger;
//                     next();
//                     return;
//                 } else {
//                     console.log('send challenge');
//                     res.status(401);
//                     res.setHeader('www-authenticate', 'Negotiate '+st.data.toString('base64'))
//                     res.end();
//                 }
//             }).catch(err => {
//                 console.log('error');
//                 console.log(err);
//             })
//     }
// })

app.use(function (req, res, next) {
    // console.log('req', req.headers);
    var nodeSSPI = require('node-sspi')
    var nodeSSPIObj = new nodeSSPI({
        authoritative: true,
        offerSSPI: true,
        offerBasic: false,
        retrieveGroups: true,
        sspiPackagesUsed: ['Negotiate']
    })
    nodeSSPIObj.authenticate(req, res, function (err) {
        res.finished || next()
    })
})

app.get('/', (req, res,next) =>{
    console.log(req.connection['user']);
    console.log(req.connection['userGroups']);
    res.end('bla');
})
readFile(path.resolve(assetsDir, 'app-config.json'), 'utf8').then(json.parse)
    .then((config) => {
        const port = config.server.port || 3000;
        // console.log(JSON.stringify(config, null, 2));
        let roleEditor = new RoleEditor(config.appFilter.config, assetsDir);
        roleEditor.start();


        const appReader = appReaderFactory(config.appReader.type, config.appReader.config);
        const roleReader = roleReaderFactory(config.roleReader.type, config.roleReader.config);
        const appFilter = appFilterFactory(config.appFilter.type, config.appFilter.config);

        // console.log(roleReader instanceof LDAPRoleReader);


        app.get('/appd/v1/apps/search', async (req: any, res: any, next: any) => {
            // let username = req.header('impersonated_user') || req.header('user');
            let userInfo: UserInfo = {
                user: req.connection['user'],
                groups: req.connection['userGroups']
            }

            const allApps = await appReader.getApps();
            console.log('all apps', allApps.length)

            const userRoles = await roleReader.getRolesForUser(userInfo);
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

    // app.use(expressAuthNegotiate())
    // app.use((req, res, next) => {
    //     console.log(req['auth'].token);
    //     console.log(kerberos);

    //     Ssip.SecurityCredentials.acquire("Negotiate", "", function(err, security_credentials) {
    //         console.log(err, security_credentials);
    //         Ssip.SecurityContext.initialize(security_credentials, "HTTP/", "", function(err, security_context) {
    //             console.log(security_context);
    //         });
    //     })

    //     next();
    // })



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

