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
					this.set('value', this.get('symbols').sum(), {silent:true});
				},

				merge : function(oTile) {
					var origVal = this.get('value');
					var oSymbols = oTile.get('symbols'), symbols = this
							.get('symbols'), matchedSymbol;
					for (var i = 0; i < symbols.length; i++) {
						var symbol = symbols.at(i);
						matchedSymbol = oSymbols.findWhere({
							'name' : symbol.get('name')
						});
						if (matchedSymbol) {
							matchedSymbol.set('value', matchedSymbol
									.get('value')
									+ symbol.get('value'));
						} else {
							matchedSymbol = new Symbol({
								name : symbol.get('name'),
								value : symbol.get('value')
							});
							oSymbols.add(matchedSymbol);
						}
					}
					var oX = oTile.get('x');
					var oY = oTile.get('y');
					oTile.set('value', oTile.get('symbols').sum(), {silent:true});
					oTile.set({
						x : this.get('x'),
						y : this.get('y'),
					}, {silent:true});
					oTile.trigger('translate');
					this.set({
						x : oX,
						y : oY
					}, {silent:true});
					this.empty();
					var _this = this;
					setTimeout(function(){
						if (origVal != 0) {
							_this.trigger('merge');
						}
						_this.trigger('change');
					}, 1000);
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