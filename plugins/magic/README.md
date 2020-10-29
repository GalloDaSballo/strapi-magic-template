# strapi-plugin-magic

Magic Plugin Integration for Strapi.

Use Magic.Links for your Strapi Users!

✨ Allows you to store your Magic Secret Key

✨ 1 Line integration 

✨ Allow authenticated API request with a bearer token issue by Magic.

## Video Guide
https://youtu.be/dcRupfuPa1U

## Installation
``` 
npm i strapi-plugin-magic
```

## Set up

### Install
``` 
npm i strapi-plugin-magic
```

### Rebuild admin
```
npm run build
```

### Add SK in Admin
Just open /admin and click on Magic, then paste your SK

### Override default permission so that Magic can generate and manage the user for you
Create the file 
`/extensions/users-permissions/config/policies/permissions.js`

Copy the "normal version"
https://raw.githubusercontent.com/strapi/strapi/master/packages/strapi-plugin-users-permissions/config/policies/permissions.js

This file allows you to customize the way in which the user get's logged in
You will add 1 line of code to log in the user by using a magic token 

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

## More info on the setup
`await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx)` is a new function that will create or find a user with the corresponding email (or publicAddress) if used.
This works because, for Strapi, the user is logged in as long as ctx.state.user is defined.

Read the docs here:
https://strapi.io/documentation/v3.x/guides/jwt-validation.html#customize-the-jwt-validation-function

## Making an Authenticated Magic Request
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
     'Authorization': `Bearer ${token}`, 
   }), 
   body: JSON.stringify({title: "He turns himself into a pickle!"})
 });
```

## Additional Functionality - Decentralized ID (Ethereum)
Magic.Link allows you to create Ethereum (and more) wallets, as soon as the user logs in.
If you prefer using their public address for authentication (promoting privacy, recommended for Dapps), you can use `useCrypto`
```javascript
await strapi.plugins['magic'].services['magic'].loginWithMagic(ctx, true) //Second parameter, called, useCrypto
```

When you set `useCrypto` to true, magic will create and find users by their address rather than by their email

All of the code you use will be the same as this field (email or username) will be consistent.

Read more about this feature here:
https://docs.magic.link/decentralized-id

## Video
Coming once code is done

## More
Plugin Sponsored by Magic Labs, Inc
https://magic.link/

Development By Alex The Entreprenerd
https://entreprenerd.xyz

Learn to Code Strapi Plugins:
https://www.youtube.com/watch?v=r7EdFVSbZSA&t=1s&ab_channel=AlextheEntreprenerd

Get 1-1 Mentoring and Coaching:
https://calendly.com/alex-entreprenerd/15min
