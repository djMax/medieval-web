api-starter-kit
===============
This project is a bare bones starter kit for a GasBuddy web application.

Naming
======
From the [Standards](https://github.com/gas-buddy/Standards) repo:
```
If your project hosts a public API, call it something-api. 
If your project hosts an internal service, call it something-serv. 
If your project hosts a web site, call it something-web.
```

Project Structure
===================
|Item|Contents|
|---|---|
|api|The swagger document provided by this service, and a package.json that allows publishing that specification as an independent module|
|src|ES6 source files that implement server side route handlers and any API that your front end code uses, as well as utility code for those things|
|src/handlers|Implementations of the handlers to implement your API. One directory per path part, where the last part is used as a filename, and that js file should export functions named after the verbs that your API implements on that URL. See [the simple example](src/handlers/pets.js)
|src/routes|Server side route handlers|
|config|Runtime configuration for the service|
|tests|Tests for the web app, API and any other components that need testing|
|wercker.yml|A CI pipeline which can be run using wercker.com or the wercker CLI|
|.*|Various project settings are in .babelrc, .eslintrc, and .*ignore|
|README.md|THIS FILE, WHICH YOU BETTER REPLACE WITH A DESCRIPTION OF YOUR SERVICE|

The main application startup code is contained in [src/lib/start.js](src/lib/start.js),
which creates a GbService, loads configuration and blows up if that initialization fails.
The config files contain (among other things), a list of the other GasBuddy microservices
which your service needs to use, and gb-services will take care of setting up a client for
that service for you in app.gb.services.**whatever**.

A simple test is included which can be run with ```npm test```. It uses our shared test
infrastructure to start and stop the express server on each test run and make schema
validation a bit easier.

Logging
=======
One of the things that gb-services does for you is setup a log infrastructure that includes
a "correlation id" that will survive across service calls in the infrastructure. In practice this
means two important things:

1) You should use req.gb.logger in your handlers to log stuff.
```
export function get(req, res) {
  req.gb.logger.info('The most incredible things are about to happen.');
}
```
2) Your library code should typically take a "context" parameter as the first arg if it needs to log stuff,
which handlers will pass to you (by passing req.gb).
```
export function someHelperMethod(context, someArg) {
  context.logger.info('I do what I am told');
}
```

Services
========
Connections can be made to other GasBuddy swagger-based services via the "connections:services" key in your configuration

```
  "connections": {
    "services": {
      "payment-activation": "require:@gasbuddy/payment-activation-spec"
    }
  },
```

That service would be made available as req.gb.services.PaymentActivation. If you include the keys "username"
and "password" in your endpoint definition for a service (not in serviceConnections but in "endpoints," basic
authentication will be configured for the swagger client.

```
"connections": {
  "services": {
    "endpoints": {
      "payment-activation": {
        "username": "foobar",
        "password": "keytar:aGoodKeyName"
      }
    }
  }
}
```

By default, web projects have IdentityServ available to do authentication.
