'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: ['app/assets/sass/{,**/}*.{scss,sass}'],
                tasks: ['default'],
                options: {
                    livereload: false
                }
            },
            js: {
                files: ['app/*.js', '!app/*.min.js', '!app/*_test.js'],
                tasks: ['default'],
                options: {
                    livereload: false
                }
            },
            components: {
                files: ['app/bower_components/**/*', 'app/components/**/*'],
                tasks: ['default'],
                options: {
                    livereload: false
                }
            },
            shared: {
                files: ['app/shared/**/*'],
                tasks: ['default'],
                options: {
                    livereload: false
                }
            }
        },

        clean: {
            dev: ["app/assets/js/min/*", "app/assets/js/min/*"],
            dist: ["app/assets/js/min/*", "app/assets/js/min/*", "build/**/*"]
        },

        copy: {
            dev: {
                files: [
                    {expand: true, flatten: true, src: ['app/bower_components/jquery/dist/jquery.min.js'], dest: 'app/assets/js/min/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/assets/fonts/**'], dest: 'build/assets/fonts/', filter: 'isFile'},

                ]
            },

            dist: {
                files: [
                    {expand: true, flatten: true, src: ['app/bower_components/jquery/dist/jquery.min.js'], dest: 'build/assets/js/min/', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/index.html'], dest: 'build/index.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/fnrw-bcw-message/bcw.main.message.error.html'], dest: 'build/components/fnrw-bcw-message/bcw.main.message.error.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/fnrw-bcw-message/bcw.main.message.html'], dest: 'build/components/fnrw-bcw-message/bcw.main.message.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/fnrw-bcw-search/bcw.list.detail.html'], dest: 'build/components/fnrw-bcw-search/bcw.list.detail.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/fnrw-bcw-search/bcw.main.html'], dest: 'build/components/fnrw-bcw-search/bcw.main.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/fnrw-bcw-search/bcw.main.list.html'], dest: 'build/components/fnrw-bcw-search/bcw.main.list.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/shared/footer/footer.html'], dest: 'build/shared/footer/footer.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/shared/header/header.html'], dest: 'build/shared/header/header.html', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/assets/images/*'], dest: 'build/assets/images/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/assets/fonts/**'], dest: 'build/assets/fonts/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/assets/js/min/*'], dest: 'build/assets/js/min/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/assets/css/min/*'], dest: 'build/assets/css/min/', filter: 'isFile'},
                ]
            }
        },
        compass: {
            options: {
                config: 'config.rb',
                bundleExec: true,
                force: true
            },
            dev: {
                options: {
                    environment: 'development'
                }
            },
            dist: {
                options: {
                    environment: 'production'
                }
            }
        },


        concat: {
            options: {
                separator: ';'
            },
            dev: {
                files:  [
                    {
                        src: ['app/bower_components/angular/angular.min.js',
                            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                            'app/bower_components/angular-ui/build/angular-ui.min.js',
                            'app/bower_components/angular-ui/build/angular-ui-ieshiv.min.js',
                            'app/bower_components/angular-resource/angular-resource.min.js',
                            'app/bower_components/angular-animate/angular-animate.min.js',
                            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
                            'app/bower_components/angular-bootstrap/ui-bootstrap-custom-0.14.3.min.js',
                            'app/bower_components/angular-bootstrap/ui-bootstrap-custom-tpls-0.14.3.min.js',
                            'app/bower_components/angulartics/dist/angulartics.min.js',
                            'app/bower_components/angulartics-google-analytics/lib/angulartics-google-analytics.js',
                            'app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
                            'app/bower_components/angular-infinite-scroll/ng-infinite-scroll.js'
                        ],

                        dest: 'app/assets/js/min/angular-plugins.min.js'
                    },
                    {
                        src: ['app/app.js', 'app/components/**/*.js', '!app/components/**/*test.js','app/shared/**/*.js', '!app/shared/**/*test.js'],
                        dest: 'app/assets/js/app.js'
                    }
                ]
            },
            dist: {
                files:  [
                    {
                        src: ['app/bower_components/angular/angular.min.js',
                            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                            'app/bower_components/angular-ui/build/angular-ui.min.js',
                            'app/bower_components/angular-ui/build/angular-ui-ieshiv.min.js',
                            'app/bower_components/angular-resource/angular-resource.min.js',
                            'app/bower_components/angular-animate/angular-animate.min.js',
                            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
                            'app/bower_components/angular-bootstrap/ui-bootstrap-custom-0.14.3.min.js',
                            'app/bower_components/angular-bootstrap/ui-bootstrap-custom-tpls-0.14.3.min.js',
                            'app/bower_components/angulartics/dist/angulartics.min.js',
                            'app/bower_components/angulartics-google-analytics/lib/angulartics-google-analytics.js',
                            'app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
                            'app/bower_components/angular-infinite-scroll/ng-infinite-scroll.js'
                        ],
                        dest: 'app/assets/js/min/angular-plugins.min.js'
                    },
                    {
                        src: ['app/app.js', 'app/components/**/*.js', '!app/components/**/*test.js','app/shared/**/*.js', '!app/shared/**/*test.js'],
                        dest: 'app/assets/js/app.js'
                    }
                ]
            }
        },
        concat_css: {
            options: {},
            dev: {
                files: [{
                    'app/assets/css/min/compiled-styles.min.css': [
                        ]
                }]
            },
            dist: {
                files: [{
                    'app/assets/css/min/compiled-styles.min.css': [
                                                            ]
                }]
            }
        },

        cssmin: {

            dev: {
                files: [{
                    cwd: 'app',
                    expand: true,
                    flatten: true,
                    src: ['bower_components/html5-boilerplate/dist/css/*.css',
                        'bower_components/html5-boilerplate/dist/css/!*.min.css',
                        'assets/css/*.css',
                        'assets/css/!*.min.css'],
                    dest: 'app/assets/css/min',
                    ext: '.min.css'
                }]
            },
            dist: {
                files: [{
                    cwd: 'app',
                    expand: true,
                    flatten: true,
                    src: ['bower_components/html5-boilerplate/dist/css/*.css',
                        'bower_components/html5-boilerplate/dist/css/!*.min.css',
                        'assets/css/*.css',
                        'assets/css/!*.min.css'],
                    dest: 'app/assets/css/min',
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            dev: {
                options: {
                    mangle: false,
                    compress: {}
                },
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'app/assets/js',
                    dest: 'app/assets/js/min',
                    src: ['**/*.js', '!**/*.min.js'],
                    rename: function(dest, src) {
                        var folder = src.substring(0, src.lastIndexOf('/'));
                        var filename = src.substring(src.lastIndexOf('/'), src.length);
                        filename = filename.substring(0, filename.lastIndexOf('.'));
                        return dest + '/' + folder + filename + '.min.js';
                    }
                },
                {
                        expand: true,
                        flatten: true,
                        cwd: 'app/',
                        dest: 'app/assets/js/min',
                        src: ['addpdwidget.js', '!addpdwidget.min.js'],
                        rename: function(dest, src) {
                            var folder = src.substring(0, src.lastIndexOf('/'));
                            var filename = src.substring(src.lastIndexOf('/'), src.length);
                            filename = filename.substring(0, filename.lastIndexOf('.'));
                            return dest + '/' + folder + filename + '.min.js';
                        }
                 }
                ]
            },
            dist: {
                options: {
                    mangle: false,
                    compress: {}
                },
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'app/assets/js',
                    dest: 'app/assets/js/min',
                    src: ['**/*.js', '!**/*.min.js'],
                    rename: function(dest, src) {
                        var folder = src.substring(0, src.lastIndexOf('/'));
                        var filename = src.substring(src.lastIndexOf('/'), src.length);
                        filename = filename.substring(0, filename.lastIndexOf('.'));
                        return dest + '/' + folder + filename + '.min.js';
                    }
                },
                 {
                        expand: true,
                        flatten: true,
                        cwd: 'app/',
                        dest: 'app/assets/js/min',
                        src: ['addpdwidget.js', '!addpdwidget.min.js'],
                        rename: function(dest, src) {
                            var folder = src.substring(0, src.lastIndexOf('/'));
                            var filename = src.substring(src.lastIndexOf('/'), src.length);
                            filename = filename.substring(0, filename.lastIndexOf('.'));
                            return dest + '/' + folder + filename + '.min.js';
                        }
                    }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask('watch', [
        'watch'
    ]);
    grunt.registerTask('default', [
        'clean:dev',
        'compass:dev',
        'concat:dev',
        'concat_css:dev',
        'cssmin:dev',
        'uglify:dev',
        'copy:dev'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist',
        'concat:dist',
        'concat_css:dist',
        'cssmin:dist',
        'uglify:dist',
        'copy:dist'
    ]);

};
