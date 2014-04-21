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
			name : 'star',
			value : 2
		} ], [ {
			name : 'heart',
			value : 2
		} ], [ {
			name : 'circle',
			value : 2
		}, {
			name : 'star',
			value : 2
		} ], [ {
			name : 'circle',
			value : 2
		}, {
			name : 'heart',
			value : 2
		} ], [ {
			name : 'star',
			value : 2
		}, {
			name : 'heart',
			value : 2
		} ], [ {
			name : 'circle',
			value : 2
		}, {
			name : 'star',
			value : 2
		} ], [ {
			name : 'circle',
			value : 2
		}, {
			name : 'heart',
			value : 2
		} ], [ {
			name : 'star',
			value : 2
		}, {
			name : 'heart',
			value : 2
		} ] ],
		initialize : function() {
			_.bindAll(this, 'start', 'randomTile', 'randomNumber', 'move',
					'moveRight', 'moveLeft', 'moveUp', 'moveDown',
					'highlightEdges');
			Backbone.on('game:start', this.start);
		},

		render : function() {
			this.$el.empty();
			var i, j, tile;
			for (i = 0; i < 4; i++) {
				for (j = 0; j < 4; j++) {
					tile = this.collection.findWhere({
						x : i,
						y : j
					});
					this.$el.append(new TileView({
						model : tile
					}).render().$el);
				}
			}
			return this;
		},

		start : function() {
			this.randomTile();
			this.randomTile();
			this.highlightEdges();
		},

		move : function(dir) {
			var moves = {
				'r' : this.moveRight,
				'l' : this.moveLeft,
				'u' : this.moveUp,
				'd' : this.moveDown
			};
			if (moves[dir]()) {
				var _this = this;
				setTimeout(function(){
					_this.randomTile();
					_this.highlightEdges();
				}, 1200);
			}
		},

		moveRight : function() {
			var j, isMoved = false;
			for (j = 2; j >= 0; j--) {
				var tiles = this.collection.where({
					y : j
				});
				for (var i = 0; i < tiles.length; i++) {
					var tile = tiles[i];
					if (tile.get('value') != 0) {
						if (this.collection.moveToFarRight(tile)) {
							isMoved = true;
						}
					}
				}
			}
			return isMoved;
		},

		moveLeft : function() {
			var j, isMoved = false;
			for (j = 1; j < 4; j++) {
				var tiles = this.collection.where({
					y : j
				});
				for (var i = 0; i < tiles.length; i++) {
					var tile = tiles[i];
					if (tile.get('value') != 0) {
						if (this.collection.moveToFarLeft(tile)) {
							isMoved = true;
						}
					}
				}
			}
			return isMoved;
		},

		moveUp : function() {
			var i, isMoved = false;
			for (i = 1; i < 4; i++) {
				var tiles = this.collection.where({
					x : i
				});
				for (var j = 0; j < tiles.length; j++) {
					var tile = tiles[j];
					if (tile.get('value') != 0) {
						if (this.collection.moveToFarUp(tile)) {
							isMoved = true;
						}
					}
				}
			}
			return isMoved;
		},

		moveDown : function() {
			var i, isMoved = false;
			for (i = 3; i >= 0; i--) {
				var tiles = this.collection.where({
					x : i
				});
				for (var j = 0; j < tiles.length; j++) {
					var tile = tiles[j];
					if (tile.get('value') != 0) {
						if (this.collection.moveToFarDown(tile)) {
							isMoved = true;
						}
					}
				}
			}
			return isMoved;
		},

		highlightEdges : function() {
			var nonEmptyTiles = this.collection.filter(function(tile) {
				return tile.get('value') != 0;
			});
			for (var i = 0; i < nonEmptyTiles.length; i++) {
				this.collection.detectEdges(nonEmptyTiles[i]);
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
			chosenTile.trigger('appear');
		},

		randomNumber : function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	});

	return GameView;
});