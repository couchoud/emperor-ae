/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bumpup: ['package.json', 'bower.json'],
    clean: {
        release : 'release/<%= pkg.version %>'
    },
    copy : {
        main : {
            files : [
                { src : 'data/*', dest: 'release/<%= pkg.version %>/'},
                { expand: true, 
                  flatten: true, 
                  src: ['css/fonts/*'], 
                  dest: 'release/<%= pkg.version %>/css/fonts', filter: 'isFile'}
            ]
        }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "src",
          include : ['../bower_components/requirejs/require.js'],
          mainConfigFile: "src/main.js",
          name : "main",
          out: "release/<%= pkg.version %>/js/main.js"
        }
      }
    },
    cssmin : {
        options: {
          banner: '/* v<%= pkg.version %> */'
        },        
        compress: {
            files: {
                'release/<%= pkg.version %>/stylesheets/main.css' : 'assets/stylesheets/main.css'
            }
        }
    },
    generate: {
      options: {
        basePath: '../',
        cache: ['js/app.js', 'css/style.css'],
        network: ['http://*', 'https://*'],
        fallback: ['/ /offline.html'],
        exclude: ['js/jquery.min.js'],
        preferOnline: true,
        verbose: true,
        timestamp: true,
        hash: true,
        master: ['index.html'],
        process: function(path) {
          return path.substring('build/'.length);
        }
      },
      src: [
          'build/some_files/*.html',
          'build/js/*.min.js',
          'build/css/*.css'
      ],
      dest: 'manifest.appcache'
    }    
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
		expr: true,
        immed: false,
        latedef: true,
        newcap: false,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
		predef : ['_', 'Backbone','console', 'Cordova', 'cordova', 'Connection', 'requirejs', 'define', 'require'],
        globals : {
            jQuery:true
        }
      }
    }   
});

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-manifest');

  // precommit task.
  grunt.registerTask('precommit', ['jshint', 'jasmine']);

  // default release task sequence
  var default_sequence = ['clean', 'jshint', 'requirejs', 'cssmin', 'copy:main'];

  // Default task.
  grunt.registerTask('default', default_sequence);
  
  // release task
  grunt.registerTask('release', default_sequence.concat(['bumpup']));

};
