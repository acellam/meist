module.exports = function ( grunt ) {
    grunt.initConfig( {

        watch: {
            scripts: {
                files: [ "./src/**/*" ],
                tasks: [ "eslint" ],
                options: {
                    spawn: false,
                },
            },
        },
        eslint: {
            target: [ "./src/**/*" ],
        },

        checkDependencies: {
            this: {},
        },
    } );

    grunt.loadNpmTasks( "grunt-check-dependencies" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-eslint" );

    grunt.registerTask( "default", [ "watch" ] );
};
