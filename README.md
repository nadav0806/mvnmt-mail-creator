# MVMNT Mail Creator

A Vercel-ready Next.js app that creates email accounts through your mail service.

## What it does

- Collects first and last name
- Proxies a POST request to your account creation endpoint
- Displays the returned email, password, and display name
- Includes a one-click copy button for credentials
- Keeps the frontend compatible with Vercel by using a route handler proxy

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

## Deploy to Vercel

This app is compatible with Vercel as-is:

- uses the App Router
- uses a route handler for the upstream API proxy
- has no custom server requirement
- can be deployed directly from GitHub
