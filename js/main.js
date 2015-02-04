requirejs.config({
    baseUrl : 'js',
    paths : {
        "jquery": "../bower_components/jquery/dist/jquery.min",
        "underscore": "../bower_components/underscore/underscore",
        "backbone": "../bower_components/backbone/backbone",
        "text" : "../bower_components/requirejs-text/text",
        "tpl" : "../bower_components/requirejs-tpl/tpl",
        "fastclick" : "../bower_components/fastclick/lib/fastclick",
        "templates" : "../templates"
    },    
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }    
    }

});

define([
    'app',
    'fastclick'
], function ( app, FastClick ) {
   
    FastClick.attach(document.body);
    $('.card').not('.card-last').click(function() {
        $(this).toggleClass('flipped').click(function() {
                $(this).toggleClass('flipped tossed');
            });
    });

    var xStart, yStart = 0;
     
    document.addEventListener('touchstart',function(e) {
        xStart = e.touches[0].screenX;
        yStart = e.touches[0].screenY;
    });
     
    document.addEventListener('touchmove',function(e) {
        var xMovement = Math.abs(e.touches[0].screenX - xStart);
        var yMovement = Math.abs(e.touches[0].screenY - yStart);
        if((yMovement * 3) > xMovement) {
            e.preventDefault();
        }
    });    

});

