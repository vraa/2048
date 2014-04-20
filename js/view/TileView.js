define([ 'jquery', 'underscore', 'backbone', 'model/tile', 'view/SymbolView',
		'text!templates/tile.html' ], function($, _, Backbone, Tile,
		SymbolView, TileTemplate) {

	var TileView = Backbone.View.extend({

		model : Tile,
		template : _.template(TileTemplate),
		className : 'tile',

		initialize : function() {
			this.listenTo(this.model, 'change', this.render);
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
			return this;
		}
	});

	return TileView;
});