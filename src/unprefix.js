/*
 * unprefix.js
 * https://github.com/rick/unprefix.js
 *
 * Copyright (c) 2012 Rick Waldron <waldron.rick@gmail.com>
 * Licensed under the MIT license.
 */

(function( window ) {

  var unprefix,
      Unprefix,
      prefixes = {
        raw: {
          // These may be redundant, but much easier to
          // keep track of what prefixes we are testing with
          css: " -moz- -ms- -o- -webkit- ",
          dom: "moz ms o O webkit Webkit",
          api: "Moz MS O WebKit"
        },
        all: [],
        cached: {
          // api: found
        }
      },
      temp = [];

   temp.concat(

     // This kind of sucks...
     prefixes.raw.css.split(" "),
     prefixes.raw.dom.split(" "),
     prefixes.raw.api.split(" ")

   ).forEach(function( value ) {
    // Skip prefixes that are already accounted for
    if ( !~prefixes.all.indexOf(value) ) {
      prefixes.all.push( value );
    }
  });

  prefixes.all.sort();

  Unprefix = function() {
    var k = -1;

    this.length = prefixes.all.length;

    while ( k < prefixes.all.length ) {
      this[ ++k ] = prefixes.all[ k ];
    }
  };

  // Borrow methods from Array.prototype
  [ "pop", "shift", "unshift", "slice", "push", "join" ].forEach(function( method ) {
    Unprefix.prototype[ method ] = Array.prototype[ method ];
  });

  // Grant read access to cached apis
  Unprefix.prototype.cached = function( key ) {
    return prefixes.cached[ key ] || prefixes.cached;
  };

  // Returns a prefixed expanded string of properties
  Unprefix.prototype.expand = function( prop ) {
    return this.join( prop + " " ) + prop;
  };

  // Define the main translation function
  Unprefix.prototype.translate = function( object, api ) {
    var tests, test,
        alt = api,
        k = 0;

    // If we've already looked this up and stored it,
    // return from the cache to avoid unnec redundant processing
    // May be unnec.?
    if ( prefixes.cached[ api ] ) {
      return object[ prefixes.cached[ api ] ];
    }

    // If we received a lowercased api/prop, create an
    // alternate uppercase api to lookup
    if ( api[0] === api[0].toLowerCase() ) {
      alt = api[0].toUpperCase() + api.slice(1);
    }

    tests = ( api + " " + this.expand(alt) ).split(" ");

    while ( k < tests.length ) {
      test = tests[ k ];

      if ( test && test in object ) {
        //  Cache the found API
        prefixes.cached[ api ] = test;

        return object[ test ];
      }
      k++;
    }
  };

  var instance = new Unprefix();

  // Expose the Unprefixed instance
  window.unprefix = function( object, api ) {
    if ( !arguments.length ) {
      return instance;
    }

    return instance.translate( object, api );
  };

  // If this is an actual window with a document,
  // Initialize awesome new APIs
  if ( window.document ) {
    [
      // window apis
      { lookin: window, find: "URL" },
      { lookin: window, find: "Blob" },
      { lookin: window, find: "BlobBuilder" },
      { lookin: window, find: "performance" },

      // navigator apis
      { lookin: navigator, find: "getUserMedia" },
      { lookin: navigator, find: "geolocation" },
      { lookin: navigator, find: "pointer" },
      { lookin: navigator, find: "onLine" },

      // document apis
      { lookin: document, find: "cancelFullscreen" },
      { lookin: document, find: "currentFullscreenElement" },
      { lookin: document, find: "fullscreen" },
      { lookin: document, find: "hidden" },
      { lookin: document, find: "visitbilityState" },

      // boilerplate
      { lookin: {}, find: "foo" }

    ].forEach(function( api ) {

      // Assign the spec name to the correct api object
      // eg. window.URL = window.webkitURL
      api.lookin[ api.find ] = instance.translate( api.lookin, api.find );
    });

    window.unprefix.cached = function( key ) {
      return prefixes.cached[ key ] || prefixes.cached;
    };
  }

}( this ));
