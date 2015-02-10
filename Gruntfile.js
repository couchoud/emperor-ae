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
                { src : 'favicon.ico', dest: 'release/<%= pkg.version %>/'},
                { src : 'platform/index.html', dest: 'release/<%= pkg.version %>/index.html'},
                { expand: true, 
                  flatten: true, 
                  src: ['fonts/*'],
                  dest: 'release/<%= pkg.version %>/fonts', filter: 'isFile'},
                { expand: true, 
                  flatten: true, 
                  src: ['img/*'],
                  dest: 'release/<%= pkg.version %>/img', filter: 'isFile'}
            ]
        }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "js",
          include : ['../bower_components/requirejs/require.js'],
          mainConfigFile: "js/main.js",
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
                'release/<%= pkg.version %>/css/main.css' : 'css/*.css'
            }
        }
    },  
    manifest: {
        generate: {
          options: {
            basePath: './',
            master: ['index.html']
          },
          src: [
              'release/<%= pkg.version %>/js/*.js',
              'release/<%= pkg.version %>/css/*.css',
              'release/<%= pkg.version %>/fonts/*.*',
              'release/<%= pkg.version %>/img/*.*',
              'release/<%= pkg.version %>/data/*.json'
          ],
          dest: 'release/<%= pkg.version %>/redjak.appcache'
        }
    },
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
  var default_sequence = ['clean', 'jshint', 'requirejs', 'cssmin', 'copy:main', 'manifest'];

  // Default task.
  grunt.registerTask('default', default_sequence);
  
  // release task
  grunt.registerTask('release', default_sequence.concat(['bumpup']));

};
