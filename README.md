## Overview

This package contains a simple REST server that implements the FDC3 App directory and is compatible with Glue Desktop. This
basic implementation just logs the user that GD requests the data for (either from the `impersonated_user` or `user` headers) and returns
the same set of data for all requests.  

## Prerequisites

npm
Node 10 (probably can run with a lower one as well)

## Running

```cmd
npm i
npm run start
```

## Configuration

### Configuring the server

#### Port 

By default the server will listen on port 3000. The environment variable `APPD_SERVER_PORT` can be used to override that.

#### Application configuration files

Add your app configurations to the `configurations` folder. Those files will be read and converted on each request.

### Configuring Glue Desktop

If your Glue Desktop copy is not configured to use Rest Service you need to Edit `config/system.json` file (located in GlueDesktop directory)

1.  Add `rest-app-config-settings` under configuration:

```json
"gw": {        
        ...
        "configuration":               
        {
            ...
            "rest-app-config-settings": {
                "enabled": true,
                "application-settings": {
                    "applications-url": "http://localhost:3000/appd/v1/apps/search",
                    "client": "negotiate",
                    "impersonation-enabled": true
                },
                "acs-identity": {
                    "authentication": "desktop"
                }
            }
        }
    }
```

2. Add a new entry to `appStores` top-level array:

```json

  "appStores": [
        {
            "type": "cm",
            "details": {
                "url": "--placeholder--"
            }
        }
  ]

```