define([ 'backbone' ], function(Backbone) {

	var Symbol = Backbone.Model.extend({
		defaults : {
			'name' : '',
			'value' : 0
		},

		toString : function() {
			return this.get('name') + ' ' + this.get('value');
		}
	});

	return Symbol;

});