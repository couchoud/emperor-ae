define([
    'module',
    'jquery',
    'underscore',
    'backbone'
], function(module, $, _, Backbone) {

    // will cache the course.json file
    var _data, _xhr;
    function data( callback ) {
        if(!_data) {
            _xhr = $.getJSON('data/data.json', function( data ) {
                    _data = data;
                    callback && callback(_data);
                });
        }
        else {
            callback && callback(_data);
        }
    }    

    return {
        
        _appView : null,
        initialize : function () {
            data(_.bind(this.hydrate, this));
        },
        hydrate : function( data ) {
             
        },
        start : function () {
            Backbone.history.start();
        },
        destroy : function() {
            if(_xhr) {
                _xhr.abort();
                _xhr = null;
            }            
            if(this._appView) {
                this._appView.remove();
                this._appView = null;
            }

            Backbone.history.stop();
        }
    };
});
