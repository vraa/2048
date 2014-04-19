define([
	  'jquery'
	, 'underscore'
	, 'backbone'
], function(
	  $
	, _
	, Backbone
){

	var ApplicationView = Backbone.View.extend({

		initialize : function(){
			this.render();
		},

		render : function(){
			console.log('Ready');
		}
	});

	return ApplicationView;

});