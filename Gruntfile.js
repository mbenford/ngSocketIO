module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        files: {
            js: {
                src: 'src/ng-socket-io.js',
                out: 'build/<%= pkg.name %>.js',
                outMin: 'build/<%= pkg.name %>.min.js'
            },
            spec: {
                src: 'test/ng-socket-io.spec.js'
            }
        },
        // Validates the JS file with JSHint
        jshint: {
            files: ['Gruntfile.js', ['<%= files.js.src %>'], ['<%= files.spec.src %>']],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        // Runs all unit tests with Karma
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        clean: {
            build: ['build/']
        },
        // Adds AngularJS dependency injection annotations
        ngAnnotate: {
            factories: {
                files: {
                    '<%= files.js.out %>': ['<%= files.js.src %>']
                }
            }
        },
        // Minifies the JS file
        uglify: {
            build: {
                files: {
                    '<%= files.js.outMin %>': ['<%= files.js.out %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', [
        'jshint',
        'karma'
    ]);
    grunt.registerTask('default', [
        'jshint',
        'karma',
        'clean',
        'ngAnnotate',
        'uglify'
    ]);
};