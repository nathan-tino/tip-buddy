# TipBuddy

This is the front-end of TipBuddy: a tool to help servers and bartenders keep track of their tips. It is not yet finished, the UI needs some polishing, but it functions and interacts with the server (TipBuddyAPI).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.4.

## Development server

The site uses HTTPS because authentication is done using cookies. This means that, in order to run the web application, you will have to:

Run `ng serve --ssl true` for a dev server - this will run without local certification and you will have to "trust" the site manually every time you load the page

--OR--

You can generate a self-trusted certificate by following these steps:

1. Run cmd as administrator

2. Install mkcert: (`https://github.com/FiloSottile/mkcert`)
    Using chocolatey:
    `choco install mkcert (cmd as admin)`

3. Install the local CA (Certificate Authority):
    `mkcert -install`
    This sets up a local CA in your system.

4. Generate certificates:
    Navigate to project directory (or just open a terminal in vsc with tip-buddy open)
    `mkcert localhost`
    This creates localhost.pem and localhost-key.pem for use in your local development server.

Now, whenever you want to run the site, use:
    `ng serve --ssl --ssl-key localhost-key.pem --ssl-cert localhost.pem`
--OR--
    `npm start` --already configured to use the above command

DO NOT check-in your generated *.pem files. They are already added to the .gitignore but double check that they don't accidentally get checked in.

Navigate to `https://localhost:4200/`. The application will automatically reload if you change any of the source files.
