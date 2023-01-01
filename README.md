This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

## Guide

### Secret Management and Authentication

- If content script needs to talk to a server, sending request from it will usually not work, as its request still bound by host page's CORS
- More, collecting credentials or storing the authentication secrets in content-script is bad as page's DOM and storage APIs shared

Secure Flows

- Collect user's credential in a trusted user interface, such as a popup page or options page. (anything chrome-extension://ID)
- Authenticate with the credentials from trusted page.
- Store the authentication token with `chrome.storage API`
- Now background service worker can access secret and send authenticated requests to server
- Content script can indirectly send authenticated requests via message relay
- 1. Content script uses extension message API to send a message to background indicating type of auth-request to send
- 2. Background script accesses the token from storage and sends auth-request
- 3. Upon response, background script collects it and sends it back up to the requesting content script
- 4. Content script receives response payload via message API
