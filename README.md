# strapi-magic-template

Template folder as we develop the Magic Plugin that allows using Magic.Link for making authenticated requests to Strapi

## Video Guide
https://youtu.be/dcRupfuPa1U

## Installation

### Clone the Repo
```
git clone https://github.com/GalloDaSballo/strapi-magic-dev/
```

### Install Strapi Deps
``` 
npm i
```

There's a postinstall script that will install dependencies for the plugin and rebuild the admin
Check the package.json for more info

### Run Strapi
```
npm run develop
```


## Set up
This repo is already set up for you

Open /admin
Add your Magic SK

You can also add you Magic SK through a .env file, using the key MAGIC_KEY, see .env.example

Open /public/magic.html
Add you Magic PK

Visit http://localhost:1337/magic.html
Add your email

Use the JWT to make an authenticated request

## Architecture
In order for Magic to work, you have to Customize the JWT Validation Function

Check `/extensions/users-permissions/config/policies` in this repo
The file `permissions.js` shows you the recommended way to set up the permissions - An older way has a security vulnerability
The file `permissions-strapi-and-magic.js` shows you how to set up both Strapi and Magic for login (same as permissions.js)
The file `permissions-only-magic.js` uses exclusively Magic (faster / more consistent than having 2)

## Manual installation:
Create the file 
`/extensions/users-permissions/config/policies/permissions.js`

Copy the "normal version", then edit the handling of the catch on line 26: 
https://github.com/strapi/strapi/blob/master/packages/strapi-plugin-users-permissions/config/policies/permissions.js

The file looks like this
```
'use strict';

const _ = require('lodash');

module.exports = async (ctx, next) => {
  let role;

  if (ctx.state.user) {
    // request is already authenticated in a different way
    return next();
  }

  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
    try {
      const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);

      if (id === undefined) {
        throw new Error('Invalid token: Token did not contain required fields');
      }

      // fetch authenticated user
      ctx.state.user = await strapi.plugins[
        'users-permissions'
      ].services.user.fetchAuthenticatedUser(id);
    } catch (err) {
      return handleErrors(ctx, err, 'unauthorized'); //EDIT HERE
    }
```

Replace line 26 with the following
```javascript
    /** With Magic Changes */
    try{
        await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)
    } catch (err) {
        return handleErrors(ctx, err, 'unauthorized');
    }
    /** END With Magic Changes */
```

### The resulting code should look like this:

https://github.com/GalloDaSballo/strapi-magic-template/blob/main/extensions/users-permissions/config/policies/permissions.js


You can test the integration by retrieving a Magic ID Token
```javascript
//By logging in
const token = await m.auth.loginWithMagicLink({ email: 'hello@example.com' });

//By requesting the token, works if you are already logged in
const token = await m.user.getIdToken();
```

Then make a request
```javascript
fetch(`${STRAPI_URL}/articles`, { 
   method: 'post', 
   headers: new Headers({
     'Authorization': 'Bearer `${token}`, 
   }), 
   body: JSON.stringify({title: "He turned himself into a pickle"})
 });
```

## Demo Repo
https://github.com/GalloDaSballo/strapi-magic-demo

### More info on this
https://strapi.io/documentation/v3.x/guides/jwt-validation.html#customize-the-jwt-validation-function

## Architecture
The Magic Plugin allows you to store your Secret Key

The Magic Plugine exposes a service you can use to verify if the bearer token belongs to a magic link related request.

After installing the plugin, use `loginWithMagic` like so:
```javascript
await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)
```

The service will attach the (Created or Retrieved user with the specific email) to the ctx.state.user object, hence logging the user in

## Security Considerations

### This plugin creates users automatically
This plugin automatically registers new users when they make their first request.
For the majority of website, this is a advantage.

For some websites it may not, if you do not wish to allow users to register via Magic Link, but only log in (using magic link as proof that the user can use that specific email), then submit an Issue or seek 1-1 mentoring for a custom solution.

### You are responsible for updating the permissions.js file
We purposefully have you set it up so you can more granularly customize the file.
Check periodicaly here and in the (https://github.com/strapi/strapi)[Strapi Monorepo] for changes to permissions.js

## More
Plugin Sponsored by
https://magic.link/

Learn to Code Strapi Plugins:
https://www.youtube.com/watch?v=r7EdFVSbZSA&t=1s&ab_channel=AlextheEntreprenerd

Get 1-1 Mentoring and Coaching:
https://calendly.com/alex-entreprenerd/15min
