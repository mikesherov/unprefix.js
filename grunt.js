/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= template.today("m/d/yyyy") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      '* Copyright (c) <%= template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
  },
  concat: {
    'dist/unprefix.js': ['<banner>', '<file_strip_banner:src/unprefix.js>']
  },
  min: {
    'dist/unprefix.js.min.js': ['<banner>', 'dist/unprefix.js']
  },
  qunit: {
    files: ['test/**/*.html']
  },
  lint: {
    files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'lint qunit'
  },
  jshint: {
    options: {
      curly: true,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      sub: true,
      undef: true,
      eqnull: true,
      browser: true
    },
    globals: {
      jQuery: true,
      console: true
    }
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint qunit concat min');
