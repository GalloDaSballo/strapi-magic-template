# strapi-plugin-magic

Magic Plugin Integration for Strapi.

Use Magic.Links for your Strapi Users!

Allows you to store your Magic Secret Key
1 Line integration 
Allow authenticated API request with a bearer token issue by Magic.

## Installation

With npm
``` 
npm i strapi-plugin-magic
```

With yarn
```
yarn add strapi-plugin-magic
```

## Set up
### Rebuild admin
```
npm run build
```

```
yarn build
```

### Add SK in Admin
Just open /admin and click on Magic, then paste your SK

### Override default permission so that Magic can generate and manage the user for you
See section below

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

Add the following code on line 5 of `/extensions/users-permissions/config/policies/permissions.js`
```javascript
    /** With Magic Changes */
    await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)
    /** END With Magic Changes */
  
```

The resulting code should look like this:
```javascript
const _ = require('lodash');

module.exports = async (ctx, next) => {
  let role;

  /** With Magic Changes */
  await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)
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

Development By
https://entreprenerd.xyz

Learn to Code Strapi Plugins:
https://www.youtube.com/watch?v=r7EdFVSbZSA&t=1s&ab_channel=AlextheEntreprenerd

Get 1-1 Mentoring and Coaching:
https://calendly.com/alex-entreprenerd/15min
