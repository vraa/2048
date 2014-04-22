define(
		[ 'jquery', 'underscore', 'backbone', 'model/tiles', 'model/tile',
				'model/symbols', 'model/symbol', 'view/TileView' ],
		function($, _, Backbone, Tiles, Tile, Symbols, Symbol, TileView) {

			var GameView = Backbone.View
					.extend({

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
						} ] ],
						initialize : function() {
							_.bindAll(this, 'start', 'randomTile',
									'randomNumber', 'move', 'moveRight',
									'moveLeft', 'moveUp', 'moveDown',
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
							this.randomTile(2);
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
								setTimeout(function() {
									_this.randomTile();
									_this.highlightEdges();
								}, 400);
							}
						},

						moveRight : function() {
							var col, isMoved = false;
							for (col = 2; col >= 0; col--) {
								var tiles = this.collection
										.nonEmptyTilesAtColumn(col);
								for (var row = 0, height = tiles.length; row < height; row++) {
									if (this.collection
											.moveToFarRight(tiles[row])) {
										isMoved = true;
									}
								}
							}
							return isMoved;
						},

						moveLeft : function() {
							var col, isMoved = false;
							for (col = 1; col < 4; col++) {
								var tiles = this.collection
										.nonEmptyTilesAtColumn(col);
								for (var row = 0, height = tiles.length; row < height; row++) {
									if (this.collection
											.moveToFarLeft(tiles[row])) {
										isMoved = true;
									}
								}
							}
							return isMoved;
						},

						moveUp : function() {
							var row, isMoved = false;
							for (row = 1; row < 4; row++) {
								var tiles = this.collection
										.nonEmptyTilesAtRow(row);
								for (var col = 0, width = tiles.length; col < width; col++) {
									if (this.collection.moveToFarUp(tiles[col])) {
										isMoved = true;
									}
								}
							}
							return isMoved;
						},

						moveDown : function() {
							var row, isMoved = false;
							for (row = 3; row >= 0; row--) {
								var tiles = this.collection
										.nonEmptyTilesAtRow(row);
								for (var col = 0, width = tiles.length; col < width; col++) {
									if (this.collection
											.moveToFarDown(tiles[col])) {
										isMoved = true;
									}
								}
							}
							return isMoved;
						},

						highlightEdges : function() {
							var nonEmptyTiles = this.collection.nonEmptyTiles();
							for (var i = 0; i < nonEmptyTiles.length; i++) {
								this.collection.detectEdges(nonEmptyTiles[i]);
							}
						},

						randomTile : function(num) {
							num = num ? num : 1;
							var emptyTiles = this.collection.emptyTiles();
							for (var count = 1; count <= num; count++) {
								var chosenTile = emptyTiles[this.randomNumber(
										0, emptyTiles.length - 1)];
								var randomSymbols = this.seedSymbols[this
										.randomNumber(0,
												this.seedSymbols.length - 1)];
								var symbols = new Symbols();
								for (var i = 0, numOfSymbols = randomSymbols.length; i < numOfSymbols; i++) {
									var symbol = new Symbol({
										name : randomSymbols[i].name,
										value : randomSymbols[i].value
									});
									symbols.add(symbol);
								}
								chosenTile.set({
									value : symbols.sum(),
									symbols : symbols
								});
								chosenTile.trigger('appear');
							}
						},

						randomNumber : function(min, max) {
							return Math.floor(Math.random() * (max - min + 1))
									+ min;
						}
					});

			return GameView;
		});