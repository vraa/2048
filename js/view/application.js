define([ 'jquery', 'underscore', 'backbone', 'view/GameView', 'model/tiles',
		'model/tile', 'model/symbols', 'model/game', 'view/scoreView',
		'text!templates/over.html', 'swipe' ], function($, _, Backbone, GameView, Tiles,
		Tile, Symbols, Game, ScoreView, OverTemplate) {

	var ApplicationView = Backbone.View
			.extend({

				el : 'body',

				overTemplate : _.template(OverTemplate),

				keyMaps : {
					'38' : 'u',
					'40' : 'd',
					'37' : 'l',
					'39' : 'r',
					'swipeleft' : 'l',
					'swiperight' : 'r',
					'swipedown' : 'd',
					'swipeup' : 'u'
				},

				events : {
					'keydown' : 'handleKey',
					'click #tryAgain' : 'restart'
				},

				initialize : function() {
					this.game = new Game();
					this.gameView = new GameView({
						model : this.game,
						collection : this.seedData()
					});
					this.scoreView = new ScoreView({
						model : this.game
					});
					this.listenTo(this.game, 'over', this.gameOver);
					this.render();
					this.bindSwipe();
				},
				
				bindSwipe : function(){
					var _this = this;
					this.$el.swipe({
						swipe : function(event, direction){
							var mapped = _this.keyMaps['swipe'+direction];
							if(mapped){
								_this.gameView.move(mapped);
							}
						}
					});
				},

				render : function() {
					this.$el.find('.pad').empty().append(
							this.gameView.render().$el);
					this.gameView.start();
				},

				restart : function() {
					this.$el.find('.over').remove();
					this.initialize();
					if(ga){
						ga('send', 'event', 'game', 'retry');
					}
				},

				gameOver : function() {
					this.$el.find('.app').append(
							this.overTemplate(this.game.toJSON()));
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