module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
			target: {
				files: [{
						expand: true,
						cwd: 'source',
	          src: 'script/*.js',
	          dest: 'build/'
	      }]
      }
    },
		cssmin: {
		  target: {
		    files: [{
					expand: true,
					cwd: 'source',
		      src: ['style/*.css'],
		      dest: 'build/',
		    }]
		  }
		},
		copy: {
		  main: {
		    files: [
		      {expand: true,cwd: 'source',src: ['image/*'], dest: 'build/'},
		    ],
		  },
		},
		minifyHtml: {
			options: {
				cdata: true
			},
			dist: {
				files: {
					'build/index.html': 'source/index.html'
				}
			}
		}
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['copy', 'cssmin' ,'uglify','minifyHtml']);

};
