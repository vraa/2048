define(
		[ 'backbone', 'model/symbols', 'model/symbol' ],
		function(Backbone, Symbols, Symbol) {

			var Tile = Backbone.Model
					.extend({

						defaults : {
							value : 0,
							x : 0,
							y : 0,
							edges : []
						},

						empty : function() {
							this.set({
								'symbols' : new Symbols(),
								'edges' : [],
								'value' : 0
							}, {
								silent : true
							});
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
							if (symbols.length > 0) {
								oTile.set('value', oTile.get('symbols').sum(),
										{
											silent : true
										});
							}
							var oX = oTile.get('x');
							var oY = oTile.get('y');
							oTile.set({
								x : this.get('x'),
								y : this.get('y'),
							}, {
								silent : true
							});
							oTile.trigger('translate');
							this.set({
								x : oX,
								y : oY
							}, {
								silent : true
							});
							if (origVal != 0) {
								this.empty();
							}
							var _this = this;
							setTimeout(function() {
								if (origVal != 0) {
									_this.trigger('merge');
								}
								_this.trigger('change');
							}, 300);
						},

						canMerge : function(oTile) {
							return this.get('value') == oTile.get('value')
									&& this.containSymbol(oTile);
						},

						containSymbol : function(oTile) {
							var oSymbols = oTile.get('symbols').pluck('name'), symbols = this
									.get('symbols').pluck('name');
							return _.intersection(symbols, oSymbols).length > 0;

						},

						toString : function() {
							return this.get('x') + ' ' + this.get('y') + ' '
									+ this.get('value');
						}

					});

			return Tile;
		});