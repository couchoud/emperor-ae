define([
    'module',
    'jquery',
    'underscore',
    'tpl!templates/card.html.tpl'
], function(module, $, _, card_tpl) {

    // will cache the course.json file
    var _data, _xhr;
    function _getData( callback ) {
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
    
    var _actions,
        _icons,
        _card_types,
        _cards,
        _shuffled_cards;

    var _current_card_idx = 0;

    function _parse( data ) {
        _actions = data.actions;
        _icons = data.icons;
        _card_types = data.enum_card_types;
        _cards = data.cards;

        _.each(_cards, function( card ) {
            var action_ids = card.actions,
                icon_ids = card.icons;

            card.actions = _.map(action_ids, function( action_id ) { return _.findWhere( _actions, { id : action_id }); });
            card.icons = _.map(icon_ids, function ( icon_id ) { return _.findWhere(_icons, { id : icon_id }); }); 
        });

        _shuffled_cards = _.shuffle(_cards);
        _renderCard(_shuffled_cards[0]);
    }
    
    function _renderCard( card ) {
        var obj = { card : card,  total_cards : _shuffled_cards.length, card_number: _current_card_idx + 1 },
            card = $(card_tpl(obj)).prependTo('.deck');

        card.one('click', function() {
            $(this).toggleClass('flipped')
                   .one('click', function() {
                       $(this).one('transitionend', function () {
                                    _current_card_idx++;
                                   _renderCard(_shuffled_cards[_current_card_idx]);
                                   $(this).remove();
                              })
                              .toggleClass('tossed');
                    });
                });

    }

    function _init () {

        if(window.navigator.standalone) {
            $('html').addClass('ios-standalone');
        }

        _getData(_parse);
    }
    
    _init();

    return {
        restart : function() {
        },
        destroy : function() {
            if(_xhr) {
                _xhr.abort();
                _xhr = null;
            }            
        }
    };
});
