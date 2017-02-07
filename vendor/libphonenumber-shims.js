(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['libphonenumber'] };
  }

  define('libphonenumber', [], vendorModule);
})();
