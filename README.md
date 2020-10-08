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

The Magic Plugin has a service you can use to verify if the bearer token belongs to a magic link related request.

After installing the plugin, use `loginWithMagic` like so:
```
await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)
```

## Set up
In order for Magic to work, you'll have to Customize the JWT Validation Function

Check `/extensions/users-permissions/config/policies` in this repo
The file `permissions.js` shows you the easiest way to set this up, you can't go wrong with this one
The file `permissions-from-docs.js` shows you a similar solution, done by following how the docs would do it
The file `permissions-strapi-and-magic.js` shows you how to set up both Strapi and Magic for login
The file `permissions-only-magic.js` uses exclusively Magic (faster / more consistent than having 2)

## Manual installation:
Create the file 
`/extensions/users-permissions/config/policies/permissions.js`

Copy the "normal version"
https://github.com/strapi/strapi/blob/master/packages/strapi-plugin-users-permissions/config/policies/permissions.js
The file looks like this
```
const _ = require('lodash');

module.exports = async (ctx, next) => {
  let role;
  //Add the code here
  if (ctx.state.user) {
```

Add the following code on line 5
```
  /** With Magic Changes */
  try{
    await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)
    } catch (err) {
    return handleErrors(ctx, err, 'unauthorized');
  }
  /** END With Magic Changes */
  
```

The resulting code should look like this:
```
const _ = require('lodash');

module.exports = async (ctx, next) => {
  let role;

  /** With Magic Changes */
  try{
    await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)
    } catch (err) {
    return handleErrors(ctx, err, 'unauthorized');
  }
  /** END With Magic Changes */

  if (ctx.state.user) {
    // request is already authenticated in a different way
    return next();
  }

  //etc...
```

### More info on this
https://strapi.io/documentation/v3.x/guides/jwt-validation.html#customize-the-jwt-validation-function

## Video
Coming once code is done

## More
Plugin Sponsored by
https://magic.link/

Learn to Code Strapi Plugins:
https://www.youtube.com/watch?v=r7EdFVSbZSA&t=1s&ab_channel=AlextheEntreprenerd

Get 1-1 Mentoring and Coaching:
https://calendly.com/alex-entreprenerd/15min
