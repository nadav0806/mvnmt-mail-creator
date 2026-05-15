# Mail account creator

A simple Next.js app for creating email accounts through your mail service.

## What it does

- Collects first and last name
- Proxies a POST request to your account creation endpoint
- Displays the returned email, password, and display name
- Includes a one-click copy button for credentials

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Endpoint

The app proxies requests to:

```text
POST https://publish.mvmnt.world/create-account
```

Request body:

```json
{
  "firstName": "noah",
  "lastName": "levine"
}
```

Example success response:

```json
{
  "success": true,
  "email": "noah.levine@themailman.info",
  "password": "C7wsQHlKL^7L",
  "displayName": "noah levine"
}
```

## Build for production

```bash
npm run build
npm start
```

## Deploy

This app can be deployed directly from GitHub.
