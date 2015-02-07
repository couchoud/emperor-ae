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
        _blitz_cards,
        _action_cards,
        _shuffled_cards;

    var _current_card_idx = 0,
        _blitz_card_amt = null;

    function _parse( data ) {
        _actions = data.actions;
        _icons = data.icons;
        _card_types = data.enum_card_types;
        _cards = data.cards;
        _blitz_cards = [];

        _.each(_cards, function( card ) {
            var action_ids = card.actions,
                icon_ids = card.icons;
            
            if(card.type === _card_types.BLITZ) {
                _blitz_cards.push(card);
            }
            _blitz_cards
            card.actions = _.map(action_ids, function( action_id ) { return _.findWhere( _actions, { id : action_id }); });
            card.icons = _.map(icon_ids, function ( icon_id ) { return _.findWhere(_icons, { id : icon_id }); }); 
        });

        _action_cards = _.difference(_cards, _blitz_cards);

        console.debug('######## ACTION CARDS ########');
        console.debug(_action_cards);
        console.debug('######## BLITZ CARDS ########');
        console.debug(_blitz_cards);
    }
    
    function _renderCard( card ) {
        var obj = { card : card,  total_cards : _shuffled_cards.length, card_number: _current_card_idx + 1 },
            card = $(card_tpl(obj)).prependTo('.deck');

        card.one('click', function() {
            $(this).toggleClass('flipped')
                   .one('click', function() {
                       $(this).one('webkitTransitionEnd transitionend', function () {
                                    _current_card_idx++;
                                   _renderCard(_shuffled_cards[_current_card_idx]);
                                   $(this).remove();
                              })
                              .toggleClass('tossed');
                    });
                });

        if((_current_card_idx + 1) === _shuffled_cards.length) {
            $('.deck').addClass('empty');
        }

    }

    function _deal() {
        _current_card_idx = 0;
        var _deck = _action_cards.concat(_.sample(_blitz_cards, _blitz_card_amt)); 
        _shuffled_cards = _.shuffle(_deck);
        _renderCard(_shuffled_cards[_current_card_idx]);
        
        console.debug('######## SHUFFLED CARDS ########');
        console.debug(_shuffled_cards);
        console.debug('length: ' + _shuffled_cards.length);
            
    }

    function _init () {

        $('.btn-start').click(function() {
            $('.menu').addClass('hidden');
            $('.difficulty').removeClass('hidden');
        });

        $('.btn-amt').click(function() {
            _blitz_card_amt = parseInt($(this).data('amt'),10);
            $('.difficulty').addClass('hidden');
            _deal();
        });

        $('.btn-shuffle').click(function() {
            $('.deck').removeClass('empty');
            _deal();
        });

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
