define([ 'jquery', 'underscore', 'backbone', 'model/tile', 'view/SymbolView',
		'text!templates/tile.html' ], function($, _, Backbone, Tile,
		SymbolView, TileTemplate) {

	var TileView = Backbone.View.extend({

		model : Tile,
		template : _.template(TileTemplate),
		className : 'tile',

		initialize : function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'appear', this.appear);
			this.listenTo(this.model, 'merge', this.merge);
			this.listenTo(this.model, 'translate', this.translate);
		},

		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			if (this.model.get('value') != 0) {
				this.$el.find('.wrap').append(new SymbolView({
					collection : this.model.get('symbols')
				}).render().$el);
			}

			if (this.model.get('value') == 0) {
				this.$el.addClass('empty');
			} else {
				this.$el.removeClass('empty');
			}
			this.$el.attr({
				'data-x' : this.model.get('x'),
				'data-y' : this.model.get('y')
			});
			this.$el.removeClass('animated grow pulse');
			return this;
		},

		appear : function() {
			this.$el.addClass('animated grow');
		},

		merge : function() {
			this.$el.addClass('animated pulse');
		},

		translate : function(to) {
			this.model.empty();
			return;
			var toTileElm = $('.tile[data-x="' + to.x + '"][data-y="' + to.y
					+ '"]');
			var tX = toTileElm.position().left;
			var tY = toTileElm.position().top;
			var fX = this.$el.position().left;
			var fY = this.$el.position().top;

			var ninjaTile = $('<div>').addClass('tile ninja');
			ninjaTile.css({
				top : fY,
				left : fX
			});
			$('.game').append(ninjaTile);
			ninjaTile.animate({
				top : tY,
				left : tX
			}, 1000);
			
		}
	});

	return TileView;
});