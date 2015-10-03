/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // Required Orbit imports
  app.import('bower_components/orbit.js/orbit.amd.js', {
    exports: {'orbit': ['default']}
  });
  app.import('bower_components/orbit.js/orbit-common.amd.js', {
    exports: {'orbit-common': ['default']}
  });

  return app.toTree();
};
