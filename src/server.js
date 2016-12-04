import { Server } from '@gasbuddy/service';

// ES6 native promises are kinda slow, and don't get long stack traces (used in tests)
global.Promise = require('bluebird');

new Server('medieval-web').create(__dirname).catch(() => process.exit(-1));
