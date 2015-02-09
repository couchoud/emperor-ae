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
        _shuffled_deck,
        _deck,
        _current_card;

    var _blitz_card_amt = null;

    var _$main = $('.main'),
        _$menu = $('.menu'),
        _$difficulty = $('.difficulty'),
        _$deck = $('.deck'),
        _$notification = $('.notification');

    var _$btnStart = $('.btn-start'),
        _$btnBlitzAmt = $('.btn-amt'),
        _$btnPauseMenu = $('.btn-pause-menu'),
        _$btnPauseMenuClose = $('.btn-close'),
        _$btnShuffle = $('.btn-shuffle');

    var _transEvent;

    function _whichTransitionEvent(){
        var t,
            el = document.createElement('fakeelement'),
            transitions = {
              'transition':'transitionend',
              'OTransition':'oTransitionEnd',
              'MozTransition':'transitionend',
              'WebkitTransition':'webkitTransitionEnd',
              'msTransitionEnd' : 'MSTransitionEnd'
            };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }        

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

            card.actions = _.map(action_ids, function( action_id ) { return _.findWhere( _actions, { id : action_id }); });
            card.icons = _.map(icon_ids, function ( icon_id ) { return _.findWhere(_icons, { id : icon_id }); }); 
        });

        _action_cards = _.difference(_cards, _blitz_cards);
    }

    function _shuffleIntoDeck ( card_obj ) {
        var insertion_point = Math.floor(Math.random()*_shuffled_deck.length);
        _shuffled_deck.splice(insertion_point, 0, card_obj);
    }
    
    function _flipCard( card ) {
        card = $(card);
        card.one(_transEvent, function() {
                $(this).one('click', function() {
                    if(_current_card.type === _card_types.BLITZ) {
                        var that = $(this),
                            prompt = $(this).find('.blitz-prompt');
                        $(this).find('.btn-yes').one('click', function() { 
                            _shuffleIntoDeck(_current_card);
                            prompt.toggleClass('hidden');
                            _tossCard(that);
                        });
                        $(this).find('.btn-no').one('click', function() { 
                            prompt.toggleClass('hidden');
                            _tossCard(that);
                        });
                        prompt.toggleClass('hidden');
                    }
                    else {
                        _tossCard(this);
                    }
                });
            })
            .toggleClass('flipped');

    }

    function _tossCard ( card ) {
        card = $(card);
        card.one(_transEvent, function () {
                _removeCard(card);
                _nextCard();
              })
              .toggleClass('tossed');       
    }

    function _removeCard( card ) {
        card = $(card);
        card.off().remove();
    }

    function _renderCard( card ) {
        var obj = { card : card,  total_cards : _deck.length, card_number: _deck.length - _shuffled_deck.length },
            card_el = $(card_tpl(obj)).prependTo('.deck');

        card_el.one('click', function() {
                _$notification.addClass('hidden');
                _flipCard( this );
            });
    }

    function _nextCard() {
        if(_shuffled_deck.length) {
            _current_card = _shuffled_deck.shift();
           _renderCard(_current_card);
        }
        else {
            _current_card = null;
            _$deck.addClass('empty');
        }
    }

    function _deal() {
        _deck = _action_cards.concat(_.sample(_blitz_cards, _blitz_card_amt));
        _shuffled_deck = _.shuffle(_deck);
        _$notification.removeClass('hidden');
        _nextCard(); 
    }

    function _init () {
        
        _transEvent = _whichTransitionEvent();

        _$btnStart.click(function() {
            _$menu.addClass('hidden');
            _$difficulty.removeClass('hidden');
        });

        _$btnBlitzAmt.click(function() {
            _blitz_card_amt = parseInt($(this).data('amt'),10);
            _$difficulty.addClass('hidden');
            _deal();
        });

        _$btnShuffle.click(function() {
            _$deck.removeClass('empty');
            _deal();
        });
        _$btnPauseMenu.click(function() {
            _$main.addClass('paused');
        });
        _$btnPauseMenuClose.click(function() {
            _$main.removeClass('paused');
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
