define([ 'jquery', 'underscore', 'backbone', 'view/GameView', 'model/tiles',
		'model/tile', 'model/symbols' ], function($, _, Backbone, GameView,
		Tiles, Tile, Symbols) {

	var ApplicationView = Backbone.View.extend({

		el : '.app',

		events : {
			'click #random' : 'random',
			'click #right' : 'moveRight',
			'click #left' : 'moveLeft',
			'click #up' : 'moveUp',
			'click #down' : 'moveDown'
		},

		initialize : function() {
			this.render();
		},

		render : function() {
			this.gameView = new GameView({
				collection : this.seedData()
			});
			this.$el.find('.pad').empty().append(this.gameView.render().$el);
			Backbone.trigger('game:start');
		},

		seedData : function() {
			var i, j, tile, tiles = new Tiles();
			for (i = 0; i < 4; i++) {
				for (j = 0; j < 4; j++) {
					tile = new Tile({
						x : i,
						y : j,
						value : 0,
						symbols : new Symbols()
					});
					tiles.add(tile);
				}
			}
			return tiles;
		},

		random : function(evt) {
			evt.preventDefault();
			this.gameView.randomTile();
		},

		moveRight : function(evt) {
			evt.preventDefault();
			Backbone.trigger('game:move', 'r');
		},

		moveLeft : function(evt) {
			evt.preventDefault();
			Backbone.trigger('game:move', 'l');
		},

		moveUp : function(evt) {
			evt.preventDefault();
			Backbone.trigger('game:move', 'u');
		},

		moveDown : function(evt) {
			evt.preventDefault();
			Backbone.trigger('game:move', 'd');
		}

	});

	return ApplicationView;

});