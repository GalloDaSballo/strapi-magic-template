# strapi-magic-dev

Temporary folder as we develop the Magic Plugin that allows using Magic.Link for making authenticated requests to Strapi

## Installation
TEMP STEPS
```
git clone https://github.com/GalloDaSballo/strapi-magic-dev/
```

Install Strapi Deps
``` 
yarn
```

Install Plugin Deps
```
cd plugins/magic-v1
yarn
cd ../..
```

Run Strapi
```
yarn develop
```


## Architecture
Simple Plugin which name will be strapi-plugin-magic
This way the plugin will load automatically

The plugin will expose a service that will verify if the given request belongs to a magic link user, abstracting away the Magic Admin SDK

## Set up
Add the SERVICE CALL to the 
`/extensions/users-permissions/config/policies/permissions.js`

This way once Strapi Validation fails, you can use Magic's
Alternatively, just use Magic.

## Video
Coming once code is done

## More
https://magic.link/
