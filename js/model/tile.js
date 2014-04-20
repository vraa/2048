define([ 'backbone', 'model/symbols', 'model/symbol' ], function(Backbone,
		Symbols, Symbol) {

	var Tile = Backbone.Model
			.extend({

				defaults : {
					value : 0,
					x : 0,
					y : 0,
					edges : []
				},

				empty : function() {
					this.set('symbols', new Symbols(), {
						silent : true
					});
					this.set('edges', [], {
						silent : true
					});
					this.set('value', this.get('symbols').sum());
				},

				merge : function(oTile) {
					var origVal = this.get('value');
					var oSymbols = oTile.get('symbols'), symbols = this
							.get('symbols'), matchedSymbol;
					for (var i = 0; i < oSymbols.length; i++) {
						var oSymbol = oSymbols.at(i);
						matchedSymbol = symbols.findWhere({
							'name' : oSymbol.get('name')
						});
						if (matchedSymbol) {
							matchedSymbol.set('value', matchedSymbol
									.get('value')
									+ oSymbol.get('value'));
						} else {
							matchedSymbol = new Symbol({
								name : oSymbol.get('name'),
								value : oSymbol.get('value')
							});
							symbols.add(matchedSymbol);
						}
					}
					this.set('value', this.get('symbols').sum());
					if (origVal != 0) {
						this.trigger('merge');
					}
					oTile.trigger('translate', {
						x : this.get('x'),
						y : this.get('y')
					});
				},

				canMerge : function(oTile) {
					return this.get('value') == oTile.get('value')
							&& this.containSymbol(oTile);
				},

				containSymbol : function(oTile) {
					var oSymbols = oTile.get('symbols'), symbols = this
							.get('symbols'), matched;
					for (var i = 0; i < oSymbols.length; i++) {
						matched = symbols.findWhere({
							'name' : oSymbols.at(i).get('name')
						});
						if (matched) {
							return true;
						}
					}
					return false;
				},

				toString : function() {
					return this.get('x') + ' ' + this.get('y') + ' '
							+ this.get('value');
				}

			});

	return Tile;
});