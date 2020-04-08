## Overview

This package contains a simple `REST` server that implements the FDC3 App directory and is compatible with Glue42 Desktop. This basic implementation just logs the user for which Glue42 Desktop requests the data (either from the `impersonated_user` or `user` headers) and returns the same set of data for all requests.  

## Prerequisites

To run this `REST` server, you need to install `npm` and  `Node.js v10.0.0` (would probably run with a lower version as well).

## Configuration

### Running the Server

To start the `REST` server, run the following commands:

```cmd
npm i           // to install the dependencies
npm run start   // to run the server
```

### Port 

By default, the server will listen on port `3000`. The environment variable `APPD_SERVER_PORT` can be used to override this setting.

### Application Configuration Files

The server comes with a list of apps. Their configurations are stored in the `configurations` folder and can be modified. Add your app configuration to the `configurations` folder. These files will be read and converted on each request.

### Configuring Glue42 Desktop

If your Glue42 Desktop copy is not configured to retrieve its configuration from a remote source, you will need to edit the `system.json` file (located in the `%LOCALAPPDATA%\Tick42\GlueDesktop\config` directory).

1. Add a new entry to the `appStores` top-level array:

```json
"appStores": [
    {
        "type": "rest",
        "details": {
            "url": "http://localhost:3000/appd/v1/apps/search",
            "auth": "no-auth",
            "pollInterval": 30000,
            "enablePersistentCache": true,
            "cacheFolder": "%LocalAppData%/Tick42/UserData/%GLUE-ENV%-%GLUE-REGION%/gcsCache/"
        }
    }
]
```

The only requred properties are `type`, which should be set to `rest`, and `url`, which is the address of the remote application store. Details [here](https://docs.glue42.com/glue42-concepts/application-management/overview/index.html#application_stores-rest_service_app_stores)
