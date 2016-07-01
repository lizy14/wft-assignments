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
	          src: 'source/script/*.js',
	          dest: 'build/'
	      }]
      }
    },
		cssmin: {
		  target: {
		    files: [{
					expand: true,
		      src: ['source/style/*.css'],
		      dest: 'build/',
		    }]
		  }
		},
		copy: {
		  main: {
		    files: [
		      {src: ['source/image/*'], dest: 'build/'},
					{src: ['source/index.html'], dest: 'build/'},
		    ],
		  },
		},
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['copy', 'cssmin' ,'uglify']);

};
