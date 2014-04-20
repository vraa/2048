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
			}else{
				this.$el.removeClass('empty');
			}
			this.$el.removeClass('animated grow pulse');
			return this;
		},
		
		appear : function(){
			this.$el.addClass('animated grow');
		},
		
		merge : function(){
			this.$el.addClass('animated pulse');
		}
	});

	return TileView;
});