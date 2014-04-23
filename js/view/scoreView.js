define([ 'jquery', 'underscore', 'backbone', 'model/game' ], function($, _,
		Backbone, Game) {

	var ScoreView = Backbone.View.extend({

		el : '#score',

		model : Game,

		initialize : function() {
			this.listenTo(this.model, 'change', this.render);
			this.render();
		},

		render : function() {
			this.$el.find('strong').html(this.model.get('score')).addClass(
					'animated pulse').removeClass('animated pulse');
		}

	});

	return ScoreView;
});