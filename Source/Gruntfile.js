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
            dev: ["app/assets/js/**/*", "app/assets/css/**/*"],
            dist: ["build/**/*"]
        },

        copy: {
            dev: {
                files: [
                    {expand: true, flatten: true, src: ['app/bower_components/jquery/dist/jquery.min.js'], dest: 'app/assets/js/min/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/bower_components/jquery/dist/jquery.min.js.map'], dest: 'app/assets/js/min/', filter: 'isFile'},
                ]
            },

            dist: {
                files: [
                    {expand: true, flatten: true, src: ['app/bower_components/jquery/dist/jquery.min.js'], dest: 'build/assets/js/min/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/bower_components/jquery/dist/jquery.min.js.map'], dest: 'build/assets/js/min/', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/index.html'], dest: 'build/index.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/test-iframe.html'], dest: 'build/test-iframe.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/list/templates/list.detail.html'], dest: 'build/components/list/templates/list.detail.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/list/templates/list.main.html'], dest: 'build/components/list/templates/list.main.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/list/templates/search.main.html'], dest: 'build/components/list/templates/search.main.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/messages/templates/error.messages.html'], dest: 'build/components/messages/templates/error.messages.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/messages/templates/info.messages.html'], dest: 'build/components/messages/templates/info.messages.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/messages/templates/disclosures.messages.html'], dest: 'build/components/messages/templates/disclosures.messages.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/messages/templates/broker.messages.html'], dest: 'build/components/messages/templates/broker.messages.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/components/messages/templates/investment-adviser.messages.html'], dest: 'build/components/messages/templates/investment-adviser.messages.html', filter: 'isFile'},

                    {expand: false, flatten: true, src: ['app/shared/footer/footer.html'], dest: 'build/shared/footer/footer.html', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/shared/header/header.html'], dest: 'build/shared/header/header.html', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/assets/images/*'], dest: 'build/assets/images/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/assets/images/webform/*'], dest: 'build/assets/images/webform/', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/ie9/js/xdomain.min.js'], dest: 'build/ie9/js/xdomain.min.js', filter: 'isFile'},
                    {expand: false, flatten: true, src: ['app/ie9/proxy.html'], dest: 'build/ie9/proxy.html', filter: 'isFile'},
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
                            'app/bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
                            'app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
                            'app/bower_components/ng-scrollbars/dist/scrollbars.min.js',
                            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                            'app/bower_components/angular-ui/build/angular-ui.min.js',
                            'app/bower_components/angular-ui/build/angular-ui-ieshiv.min.js',
                            'app/bower_components/ui-router-extras/release/ct-ui-router-extras.min.js',
                            'app/bower_components/angular-animate/angular-animate.min.js',
                            'app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
                            'app/bower_components/angular-touch/angular-touch.min.js',
                            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
                            'app/bower_components/angulartics/dist/angulartics.min.js',
                            'app/bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',



                        ],

                        dest: 'app/assets/js/min/angular-plugins.min.js'
                    },
                    {
                        src: ['app/app.module.js'],
                        dest: 'app/assets/js/app.module.js'
                    },
                    {
                        src: ['app/components/core/core.module.js',
                            'app/components/core/core.constants.js',
                            'app/components/core/core.config.js',
                            'app/components/core/core.factories.js',
                            'app/components/core/core.services.js'],
                        dest: 'app/assets/js/bc2210.core.js'
                    },
                    {
                        src: ['app/components/list/list.module.js',
                            'app/components/list/search.controller.js',
                            'app/components/list/list.controller.js',
                            'app/components/list/list.detail.controller.js'],
                        dest: 'app/assets/js/bc2210.list.js'

                    },
                    {
                        src: ['app/components/messages/messages.module.js',
                            'app/components/messages/messages.controller.js'],
                        dest: 'app/assets/js/bc2210.messages.js'

                    },
                    {
                        src: ['app/components/stickyscroll/stickyscroll.module.js',
                            'app/components/stickyscroll/stickyscroll.directive.js'],
                        dest: 'app/assets/js/bc2210.stickyscroll.js'

                    }

                ]
            },
            dist: {
                files:  [
                    {
                        src: ['app/bower_components/angular/angular.min.js',
                            'app/bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
                            'app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
                            'app/bower_components/ng-scrollbars/dist/scrollbars.min.js',
                            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                            'app/bower_components/angular-ui/build/angular-ui.min.js',
                            'app/bower_components/angular-ui/build/angular-ui-ieshiv.min.js',
                            'app/bower_components/ui-router-extras/release/ct-ui-router-extras.min.js',
                            'app/bower_components/angular-animate/angular-animate.min.js',
                            'app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
                            'app/bower_components/angular-touch/angular-touch.min.js',
                            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
                            'app/bower_components/angulartics/dist/angulartics.min.js',
                            'app/bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',



                        ],
                        dest: 'app/assets/js/min/angular-plugins.min.js'
                    },
                    {
                        src: ['app/app.module.js'],
                        dest: 'app/assets/js/app.module.js'
                    },
                    {
                        src: ['app/components/core/core.module.js',
                            'app/components/core/core.constants.js',
                            'app/components/core/core.config.js',
                            'app/components/core/core.factories.js',
                            'app/components/core/core.services.js'],
                        dest: 'app/assets/js/bc2210.core.js'
                    },
                    {
                        src: ['app/components/list/list.module.js',
                            'app/components/list/search.controller.js',
                            'app/components/list/list.controller.js',
                            'app/components/list/list.detail.controller.js'],
                        dest: 'app/assets/js/bc2210.list.js'

                    },
                    {
                        src: ['app/components/messages/messages.module.js',
                            'app/components/messages/messages.controller.js'],
                        dest: 'app/assets/js/bc2210.messages.js'

                    },
                    {
                        src: ['app/components/stickyscroll/stickyscroll.module.js',
                            'app/components/stickyscroll/stickyscroll.directive.js'],
                        dest: 'app/assets/js/bc2210.stickyscroll.js'

                    }
                ]
            }
        },
        concat_css: {
            options: {},
            dev: {
                files: [{
                    'app/assets/css/min/compiled-styles.min.css': [
                        'app/assets/libs/animate/animate.min.css',
                        'app/assets/libs/bootstrap-3.3.6-dist/css/bootstrap.min.css',
                        'app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
                        ]
                }]
            },
            dist: {
                files: [{
                    'app/assets/css/min/compiled-styles.min.css': [
                        'app/assets/libs/animate/animate.min.css',
                        'app/assets/libs/bootstrap-3.3.6-dist/css/bootstrap.min.css',
                        'app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'
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
                        src: ['addbcwidget.js', '!addbcwidget.min.js'],
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
                        src: ['addbcwidget.js', '!addbcwidget.min.js'],
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
