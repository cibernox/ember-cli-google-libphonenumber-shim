/* eslint-env node */
'use strict';

const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const path = require('path');
const libphonenumberPath = path.dirname(require.resolve('google-libphonenumber/package.json'));

module.exports = {
  name: 'ember-cli-google-libphonenumber-shim',

  treeForVendor(tree) {
    let libPhoneNumberTree = new Funnel(libphonenumberPath, {
      destDir: 'google-libphonenumber',
      include: ['dist/*']
    });
    return mergeTrees([tree, libPhoneNumberTree]);
  },

  included(app, parentAddon) {
    // Quick fix for add-on nesting
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && (app.app || app.parent)) {
      app = app.app || app.parent;
    }

    // if app.import and parentAddon are blank, we're probably being consumed by an in-repo-addon
    // or engine, for which the "bust through" technique above does not work.
    if (typeof app.import !== 'function' && !parentAddon) {
      if (app.registry && app.registry.app) {
        app = app.registry.app;
      }
    }

    if (!parentAddon && typeof app.import !== 'function') {
      throw new Error('ember-font-awesome is being used within another addon or engine and is' +
        ' having trouble registering itself to the parent application.');
    }

    // https://github.com/ember-cli/ember-cli/issues/3718#issuecomment-88122543
    this._super.included.call(this, app);

    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    var target = (parentAddon || app);
    // var vendor = this.treePaths.vendor;
    target.import(path.join(libphonenumberPath, 'dist', 'libphonenumber.js'));
    target.import('vendor/libphonenumber-shims.js');
  }
};
