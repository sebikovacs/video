'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });

var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.loadNpmTasks('assemble');

	// configurable paths
	var yeomanConfig = {
		app: 'app',
		dist: 'public'
	};

	try {
		yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
	} catch (e) {}

	grunt.initConfig({
		yeoman: yeomanConfig,
		watch: {
			assemble: {
				files: [ '<%= yeoman.app %>/templates/{,*/}*.{hbs,html}' ],
				tasks: [ 'assemble:server' ]
			},
			sass: {
				files: [ '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}' ],
				tasks: [ 'sass:server' ]
			},
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'{.tmp,<%= yeoman.app %>/views}/{,*/}*.html',
					'{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
					'{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
					'<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg,mp4}'
				]
			}
		},
		connect: {
			options: {
				port: 9000,
				hostname: '0.0.0.0'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			},
			dist: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, yeomanConfig.dist)
						];
					}
				}
			}
		},
		clean: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: [
						'*'
					]
				}]
			},
			server: '.tmp'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/{,*/}*.js'
			]
		},
		assemble: {
			options: {
				layoutdir: '<%= yeoman.app %>/templates'
			},
			server: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/templates',
					src: '**/*.hbs',
					dest: '.tmp'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/templates',
					src: '**/*.hbs',
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		sass: {
			dist: {
				files: {
					'.tmp/styles/app.css': '<%= yeoman.app %>/styles/app.scss'
				}
			},
			server: {
				files: {
					'.tmp/styles/app.css': '<%= yeoman.app %>/styles/app.scss'
				}
			}
		},
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/scripts/{,*/}*.js',
						'<%= yeoman.dist %>/styles/{,*/}*.css',
						'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg,mp4}',
						'<%= yeoman.dist %>/styles/fonts/*'
					]
				}
			}
		},
		useminPrepare: {
			html: [
				'<%= yeoman.app %>/{,*/}*.{html,hbs}'
			],
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				dirs: ['<%= yeoman.dist %>']
			}
		},
		imagemin: {
			dist: {
				options: {
					cache: false
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>/images',
					//src: '{,*/}*.{png,jpg,jpeg}',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: ''
				}]
			}
		},
		htmlmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: ['*.html', 'views/*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'CNAME',
						'*.*',
						'bower_components/**/*',
						'images/{,*/}*.{gif,webp,svg,png,jpg,jpeg,mp4}',
						'styles/fonts/*'
					]
				}]
			}
		},
		concurrent: {
			server: [
				'sass:server',
				'assemble:server'
			],
			dist: [
				'sass:dist',
				'assemble:dist'
			]
		},
		buildcontrol: {
			options: {
				dir: 'public',
				commit: true,
				push: true,
				message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
			},
			dist: {
				options: {
					remote: 'git@github.com:sebikovacs/video.git',
					branch: 'gh-pages'
				}
			}
		}
	});

	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'concurrent:dist',
		'htmlmin',
		'useminPrepare',
		'copy:dist',
		//'imagemin',
		'concat',
		'cssmin',
		'uglify',
		//'rev',
		'usemin'
	]);

	grunt.registerTask('default', [
		'jshint',
		'build'
	]);

	grunt.registerTask('deploy', [
		'buildcontrol:dist'
	]);

};
