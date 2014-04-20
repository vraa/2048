define([ 'jquery', 'underscore', 'backbone', 'model/tiles', 'model/tile',
		'model/symbols', 'model/symbol', 'view/TileView' ], function($, _,
		Backbone, Tiles, Tile, Symbols, Symbol, TileView) {

	var GameView = Backbone.View.extend({

		className : 'game',
		collection : Tiles,
		seedSymbols : [ [ {
			name : 'circle',
			value : 2
		} ], [ {
			name : 'circle',
			value : 4
		} ], [ {
			name : 'circle',
			value : 8
		} ], [ {
			name : 'circle',
			value : 4
		}, {
			name : 'star',
			value : 4
		} ], [ {
			name : 'star',
			value : 4
		} ], [ {
			name : 'star',
			value : 8
		} ], [ {
			name : 'heart',
			value : 8
		} ] ],
		initialize : function() {
			_.bindAll(this, 'start', 'randomTile', 'randomNumber', 'move',
					'moveRight', 'moveLeft', 'moveUp', 'moveDown');
			Backbone.on('game:start', this.start);
			Backbone.on('game:move', this.move);
		},

		render : function() {
			this.$el.empty();
			var i, j, tile;
			for (i = 0; i < 4; i++) {
				var rowElm = $('<div>').addClass('row');
				for (j = 0; j < 4; j++) {
					tile = this.collection.findWhere({
						x : i,
						y : j
					});
					rowElm.append(new TileView({
						model : tile
					}).render().$el);
				}
				this.$el.append(rowElm);
			}
			return this;
		},

		start : function() {
			this.randomTile();
			this.randomTile();
		},

		move : function(dir) {
			var moves = {
				'r' : this.moveRight,
				'l' : this.moveLeft,
				'u' : this.moveUp,
				'd' : this.moveDown
			};
			moves[dir]();
			this.randomTile();
		},

		moveRight : function() {
			var j;
			for (j = 2; j >= 0; j--) {
				var tiles = this.collection.where({
					y : j
				});
				for (var i = 0; i < tiles.length; i++) {
					var tile = tiles[i];
					if (tile.get('value') != 0) {
						this.collection.moveToFarRight(tile);
					}
				}
			}
		},

		moveLeft : function() {
			var j;
			for (j = 1; j < 4; j++) {
				var tiles = this.collection.where({
					y : j
				});
				for (var i = 0; i < tiles.length; i++) {
					var tile = tiles[i];
					if (tile.get('value') != 0) {
						this.collection.moveToFarLeft(tile);
					}
				}
			}
		},

		moveUp : function() {
			var i;
			for (i = 1; i < 4; i++) {
				var tiles = this.collection.where({
					x : i
				});
				for (var j = 0; j < tiles.length; j++) {
					var tile = tiles[j];
					if (tile.get('value') != 0) {
						this.collection.moveToFarUp(tile);
					}
				}
			}
		},

		moveDown : function() {
			var i;
			for (i = 3; i >= 0; i--) {
				var tiles = this.collection.where({
					x : i
				});
				for (var j = 0; j < tiles.length; j++) {
					var tile = tiles[j];
					if (tile.get('value') != 0) {
						this.collection.moveToFarDown(tile);
					}
				}
			}
		},

		randomTile : function() {
			var emptyTiles = this.collection.where({
				value : 0
			});
			var chosenTile = emptyTiles[this.randomNumber(0,
					emptyTiles.length - 1)];

			var randomSeedSymbols = this.seedSymbols[this.randomNumber(0,
					this.seedSymbols.length - 1)];
			var symbols = new Symbols();
			for (var i = 0; i < randomSeedSymbols.length; i++) {
				var symbol = new Symbol({
					name : randomSeedSymbols[i].name,
					value : randomSeedSymbols[i].value
				});
				symbols.add(symbol);
			}
			chosenTile.set({
				value : symbols.sum(),
				symbols : symbols
			});
		},

		randomNumber : function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	});

	return GameView;
});