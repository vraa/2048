define([ 'jquery', 'underscore', 'backbone', 'view/GameView', 'model/tiles',
		'model/tile', 'model/symbols', 'model/game', 'view/scoreView' ],
		function($, _, Backbone, GameView, Tiles, Tile, Symbols, Game,
				ScoreView) {

			var ApplicationView = Backbone.View.extend({

				el : 'body',

				keyMaps : {
					'38' : 'u',
					'40' : 'd',
					'37' : 'l',
					'39' : 'r'
				},

				events : {
					'keydown' : 'handleKey'
				},

				initialize : function() {
					this.game = new Game();
					this.render();
				},

				render : function() {
					this.gameView = new GameView({
						model : this.game,
						collection : this.seedData()
					});
					this.scoreView = new ScoreView({
						model : this.game
					});
					this.$el.find('.pad').empty().append(
							this.gameView.render().$el);
					this.gameView.start();
				},

				seedData : function() {
					var i, j, tile, tiles = new Tiles();
					for (i = 0; i < 4; i++) {
						for (j = 0; j < 4; j++) {
							tile = new Tile({
								x : i,
								y : j,
								value : 0,
								symbols : new Symbols(),
								edges : []
							});
							tiles.add(tile);
						}
					}
					return tiles;
				},

				handleKey : function(evt) {
					var mapped = this.keyMaps[evt.which];
					if (mapped) {
						evt.preventDefault();
						this.gameView.move(mapped);
					}
				}

			});

			return ApplicationView;

		});