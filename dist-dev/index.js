/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/app-filters/app-filter-factory.ts":
/*!***********************************************!*\
  !*** ./app/app-filters/app-filter-factory.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_app_filter_1 = __webpack_require__(/*! ./sqlite-app-filter */ "./app/app-filters/sqlite-app-filter/index.ts");
function appFilterFactory(type, config) {
    if (type === 'SQLite') {
        return new sqlite_app_filter_1.SQLiteAppFilter(config);
    }
    throw new Error(`Unknown app filter type "${type}"`);
}
exports.appFilterFactory = appFilterFactory;


/***/ }),

/***/ "./app/app-filters/sqlite-app-filter/index.ts":
/*!****************************************************!*\
  !*** ./app/app-filters/sqlite-app-filter/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
const sqlite3 = __webpack_require__(/*! sqlite3 */ "sqlite3");
const path = __webpack_require__(/*! path */ "path");
const utils_1 = __webpack_require__(/*! ../../utils */ "./app/utils.ts");
const sqlite = sqlite3.verbose();
const appsForRolesQuery = `SELECT roles.id, roles.name, GROUP_CONCAT('['||applications.id || ', "' || applications.name || '", "' || applications.display_name || '"]', ',') as apps
from roles
LEFT OUTER JOIN applications_for_role on applications_for_role.role_id = roles.id
INNER JOIN applications on applications_for_role.application_id = applications.id
WHERE roles.name IN ?
GROUP BY roles.id`;
class SQLiteAppFilter {
    constructor(config) {
        this.db = new sqlite.Database(path.join(utils_1.assetsDir, config.db));
    }
    filterApps(apps, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedAppsPerRole = yield this.getAppsForRoles(roles);
            return apps.filter(app => {
                return allowedAppsPerRole.find(allowedApp => allowedApp.name === app.appId);
            });
        });
    }
    getAppsForRoles(roles) {
        return new Promise((res, rej) => {
            let q = appsForRolesQuery.replace('?', `('${roles.join("', '")}')`);
            this.db.all(q, (err, rows) => {
                if (err) {
                    rej(err);
                }
                else {
                    let allApps = [];
                    rows.forEach(row => {
                        allApps = allApps.concat(JSON.parse(`[${row.apps}]`));
                    });
                    allApps = allApps.map((rawApp) => {
                        return {
                            name: rawApp[1],
                            title: rawApp[2]
                        };
                    });
                    res(allApps);
                }
            });
        });
    }
}
exports.SQLiteAppFilter = SQLiteAppFilter;


/***/ }),

/***/ "./app/app-readers/app-reader-factory.ts":
/*!***********************************************!*\
  !*** ./app/app-readers/app-reader-factory.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const file_app_reader_1 = __webpack_require__(/*! ./file-app-reader */ "./app/app-readers/file-app-reader/index.ts");
const http_app_reader_1 = __webpack_require__(/*! ./http-app-reader */ "./app/app-readers/http-app-reader/index.ts");
function appReaderFactory(type, config) {
    if (type === 'file') {
        return new file_app_reader_1.FileAppReader(config);
    }
    else if (type === 'url') {
        return new http_app_reader_1.HttpAppReader(config);
    }
    throw new Error(`Unknown app reader type "${type}"`);
}
exports.appReaderFactory = appReaderFactory;


/***/ }),

/***/ "./app/app-readers/file-app-reader/index.ts":
/*!**************************************************!*\
  !*** ./app/app-readers/file-app-reader/index.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ../../utils */ "./app/utils.ts");
const path = __webpack_require__(/*! path */ "path");
const json = __webpack_require__(/*! comment-json */ "comment-json");
class FileAppReader {
    constructor(config) {
        this.config = config;
    }
    getApps() {
        return utils_1.readDir(path.join(utils_1.assetsDir, this.config.folder))
            .then((files) => files.map((fileName) => utils_1.readFile(path.join(utils_1.assetsDir, this.config.folder, fileName), 'utf8').then(json.parse)))
            .then((promises) => Promise.all(promises))
            .then((configs) => {
            let appConfigs = configs.reduce((acc, cfg) => acc.concat(Array.isArray(cfg) ? cfg.map(utils_1.configToManifest) : utils_1.configToManifest(cfg)), []);
            return appConfigs;
        });
    }
}
exports.FileAppReader = FileAppReader;


/***/ }),

/***/ "./app/app-readers/http-app-reader/index.ts":
/*!**************************************************!*\
  !*** ./app/app-readers/http-app-reader/index.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class HttpAppReader {
    constructor(config) {
    }
    getApps() {
        return new Promise((res, rej) => {
            res();
        });
    }
}
exports.HttpAppReader = HttpAppReader;


/***/ }),

/***/ "./app/index.ts":
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
const express = __webpack_require__(/*! express */ "express");
const path = __webpack_require__(/*! path */ "path");
const json = __webpack_require__(/*! comment-json */ "comment-json");
const utils_1 = __webpack_require__(/*! ./utils */ "./app/utils.ts");
const app_reader_factory_1 = __webpack_require__(/*! ./app-readers/app-reader-factory */ "./app/app-readers/app-reader-factory.ts");
const app_filter_factory_1 = __webpack_require__(/*! ./app-filters/app-filter-factory */ "./app/app-filters/app-filter-factory.ts");
const role_reader_factory_1 = __webpack_require__(/*! ./role-readers/role-reader-factory */ "./app/role-readers/role-reader-factory.ts");
const role_editor_ui_1 = __webpack_require__(/*! ../role-editor-ui */ "./role-editor-ui/index.ts");
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
    var nodeSSPI = __webpack_require__(/*! node-sspi */ "node-sspi");
    var nodeSSPIObj = new nodeSSPI({
        authoritative: true,
        offerSSPI: true,
        offerBasic: false,
        retrieveGroups: true,
        sspiPackagesUsed: ['Negotiate']
    });
    nodeSSPIObj.authenticate(req, res, function (err) {
        res.finished || next();
    });
});
app.get('/', (req, res, next) => {
    console.log(req.connection['user']);
    console.log(req.connection['userGroups']);
    res.end('bla');
});
utils_1.readFile(path.resolve(utils_1.assetsDir, 'app-config.json'), 'utf8').then(json.parse)
    .then((config) => {
    const port = config.server.port || 3000;
    // console.log(JSON.stringify(config, null, 2));
    let roleEditor = new role_editor_ui_1.RoleEditor(config.appFilter.config, utils_1.assetsDir);
    roleEditor.start();
    const appReader = app_reader_factory_1.appReaderFactory(config.appReader.type, config.appReader.config);
    const roleReader = role_reader_factory_1.roleReaderFactory(config.roleReader.type, config.roleReader.config);
    const appFilter = app_filter_factory_1.appFilterFactory(config.appFilter.type, config.appFilter.config);
    // console.log(roleReader instanceof LDAPRoleReader);
    app.get('/appd/v1/apps/search', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // let username = req.header('impersonated_user') || req.header('user');
        let userInfo = {
            user: req.connection['user'],
            groups: req.connection['userGroups']
        };
        const allApps = yield appReader.getApps();
        console.log('all apps', allApps.length);
        const userRoles = yield roleReader.getRolesForUser(userInfo);
        console.log('user roles', userRoles);
        const filteredApps = yield appFilter.filterApps(allApps, userRoles);
        console.log('filtered apps', filteredApps.length);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ applications: filteredApps }));
    }));
    app.listen(port, () => {
        return console.log(`Glue42 demo AppD server listening on ${port}.`);
    });
}).catch(err => {
    console.error(err);
});
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


/***/ }),

/***/ "./app/role-readers/ldap-role-reader/index.ts":
/*!****************************************************!*\
  !*** ./app/role-readers/ldap-role-reader/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// import * as ActiveDirectory from 'activedirectory';
class LDAPRoleReader {
    // private ad: any;
    constructor(config) {
        // const ldapConfig = {
        //   url: 'ldap://dc02.pirinsoft.bg',
        //   baseDN: 'dc=pirinsoft,dc=bg',
        //   username: 'aatanasov@pirinsoft.bg',
        //   password: [80, 97, 114, 111, 108, 97, 49, 33].map(code => String.fromCharCode(code)).join('')
        // }
        // this.ad =  new ActiveDirectory(ldapConfig.url, ldapConfig.baseDN, ldapConfig.username, ldapConfig.password, {});
    }
    getRolesForUser(userInfo) {
        return new Promise((res, rej) => {
            res(userInfo.groups);
            // this.ad.getGroupMembershipForUser(username, (err, groups) => {
            //   if (err) {
            //     rej(err);
            //   } else {
            //     if (Array.isArray(groups)) {
            //       res(groups.map((g) => g.cn))
            //     } else {
            //       res([]);
            //     }
            //   }
            // })
        });
    }
}
exports.LDAPRoleReader = LDAPRoleReader;


/***/ }),

/***/ "./app/role-readers/role-reader-factory.ts":
/*!*************************************************!*\
  !*** ./app/role-readers/role-reader-factory.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_role_reader_1 = __webpack_require__(/*! ./sqlite-role-reader */ "./app/role-readers/sqlite-role-reader/index.ts");
const ldap_role_reader_1 = __webpack_require__(/*! ./ldap-role-reader */ "./app/role-readers/ldap-role-reader/index.ts");
function roleReaderFactory(type, config) {
    if (type === 'SQLite') {
        return new sqlite_role_reader_1.SQLiteRoleReader(config);
    }
    else if (type === 'ActiveDirectory') {
        return new ldap_role_reader_1.LDAPRoleReader(config);
    }
    else {
        throw new Error('Invalid RoleReader type: ' + type);
    }
}
exports.roleReaderFactory = roleReaderFactory;


/***/ }),

/***/ "./app/role-readers/sqlite-role-reader/index.ts":
/*!******************************************************!*\
  !*** ./app/role-readers/sqlite-role-reader/index.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = __webpack_require__(/*! sqlite3 */ "sqlite3");
const path = __webpack_require__(/*! path */ "path");
const utils_1 = __webpack_require__(/*! ../../utils */ "./app/utils.ts");
const sqlite = sqlite3.verbose();
const rolesForUserQuery = `Select users.id, users.username, GROUP_CONCAT('[' || roles.id || ',"' || roles.name || '"]') as roles
from users
LEFT OUTER JOIN user_roles on users.id = user_roles.user_id
INNER JOIN roles on user_roles.role_id = roles.id
where users.username = $username
group by users.id`;
class SQLiteRoleReader {
    constructor(config) {
        this.db = new sqlite.Database(path.join(utils_1.assetsDir, config.db));
    }
    getRolesForUser(userInfo) {
        return new Promise((res, rej) => {
            this.db.get(rolesForUserQuery, { $username: userInfo.user }, (err, row) => {
                if (err) {
                    rej(err);
                }
                else {
                    if (row) {
                        let roles = JSON.parse(`[${row.roles}]`).map((role) => role[1]);
                        res(roles);
                    }
                    else {
                        res([]);
                    }
                }
            });
        });
    }
}
exports.SQLiteRoleReader = SQLiteRoleReader;


/***/ }),

/***/ "./app/utils.ts":
/*!**********************!*\
  !*** ./app/utils.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ "fs");
const util = __webpack_require__(/*! util */ "util");
const path = __webpack_require__(/*! path */ "path");
const readDir = util.promisify(fs.readdir);
exports.readDir = readDir;
const readFile = util.promisify(fs.readFile);
exports.readFile = readFile;
const isDev = !!process.env.dev;
exports.isDev = isDev;
const assetsDir = isDev ? path.join(__dirname, '../assets') : path.join(process.cwd(), 'assets');
exports.assetsDir = assetsDir;
const configToManifest = (config) => {
    return {
        appId: config.name,
        name: config.name,
        version: "1",
        title: config.title,
        manifestType: "Glue42",
        manifest: JSON.stringify(config)
    };
};
exports.configToManifest = configToManifest;

/* WEBPACK VAR INJECTION */}.call(this, "app"))

/***/ }),

/***/ "./role-editor-ui/index.ts":
/*!*********************************!*\
  !*** ./role-editor-ui/index.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
Object.defineProperty(exports, "__esModule", { value: true });
// import * as http from 'http';
const express = __webpack_require__(/*! express */ "express");
const sqlite3 = __webpack_require__(/*! sqlite3 */ "sqlite3");
const path = __webpack_require__(/*! path */ "path");
const sqlite = sqlite3.verbose();
class RoleEditor {
    constructor(config, assetsDir) {
        // console.log();
        console.log(path.join(assetsDir, config.db));
        this.db = new sqlite.Database(path.join(assetsDir, config.db));
        console.log(this.db);
        this.startServer();
    }
    start() {
    }
    startServer() {
        this.expressApp = express();
        this.expressApp.use(express.static(path.join(process.cwd(), __dirname, 'public')));
        this.expressApp.use(express.json());
        console.log(__dirname);
        this.registerEndPoints();
        this.expressApp.listen(3001);
    }
    registerEndPoints() {
        this.expressApp.get('/users', this.getUsers.bind(this));
        this.expressApp.get('/roles', this.getRoles.bind(this));
        this.expressApp.put('/add-role', this.addRole.bind(this));
        this.expressApp.put('/remove-role', this.removeRole.bind(this));
        console.log(path.join(process.cwd(), __dirname, './public/index.html'));
        // this.expressApp.get('/*', (req, res) => {
        //   res.sendFile(path.join(process.cwd(), __dirname, './public/index.html'));
        // })
    }
    getUsers(req, res) {
        this.db.all(usersQuery, (err, users) => {
            console.log(users);
            let grouped = users.reduce((acc, curr) => {
                acc[curr.userName] = acc[curr.userName] || { id: curr.userId, name: curr.userName, roles: [] };
                acc[curr.userName].roles.push(curr.roleName);
                return acc;
            }, {});
            res.json(Object.keys(grouped).map(userName => grouped[userName]));
        });
    }
    getRoles(req, res) {
        console.log('get roles');
        this.db.all(rolesQuery, (err, roles) => {
            res.json(roles);
        });
    }
    addRole(req, res) {
        let { userId, roleId } = req.body;
        console.log(userId, roleId);
        if (typeof userId !== 'number' || typeof roleId !== 'number') {
            res.status(400);
            res.json('Invalid input data');
        }
        let addUserRoleQuery = `
    INSERT INTO user_roles
    VALUES (${userId}, ${roleId})`;
        this.db.run(addUserRoleQuery, (err, result) => {
            if (err) {
                res.status(400);
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    removeRole(req, res) {
        let { userId, roleId } = req.body;
        if (typeof userId !== 'number' || typeof roleId !== 'number') {
            res.status(400);
            res.json('Invalid input data');
        }
        let removeUserRoleQuery = `
    DELETE FROM user_roles
    WHERE user_id=${userId} AND role_id=${roleId}`;
        this.db.run(removeUserRoleQuery, (err, result) => {
            if (err) {
                res.status(400);
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
}
exports.RoleEditor = RoleEditor;
const usersQuery = `SELECT users.id as userId, users.username as userName, roles.name as roleName, roles.id as roleId
FROM users
LEFT OUTER JOIN user_roles ON user_roles.user_id = users.id
INNER JOIN roles on user_roles.role_id = roles.id`;
const rolesQuery = `SELECT * from roles`;

/* WEBPACK VAR INJECTION */}.call(this, "role-editor-ui"))

/***/ }),

/***/ "comment-json":
/*!*******************************!*\
  !*** external "comment-json" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("comment-json");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "node-sspi":
/*!****************************!*\
  !*** external "node-sspi" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-sspi");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map