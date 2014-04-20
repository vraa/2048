define([ 'backbone', 'model/tile' ], function(Backbone, Tile) {

	var Tiles = Backbone.Collection.extend({
		model : Tile,

		moveToFarRight : function(tile) {
			var firstNonEmptyTile = null, farEmptyTile = null, j, i, nxtTile;
			i = tile.get('x');
			for (j = tile.get('y') + 1; j < 4; j++) {
				nxtTile = this.findWhere({
					x : i,
					y : j
				});
				if (nxtTile.get('value') != 0) {
					firstNonEmptyTile = nxtTile;
					break;
				}
			}

			for (j = firstNonEmptyTile != null ? firstNonEmptyTile.get('y') - 1
					: 3; j > tile.get('y'); j--) {
				nxtTile = this.findWhere({
					x : i,
					y : j
				});
				if (nxtTile.get('value') == 0) {
					farEmptyTile = nxtTile;
					break;
				}
			}

			if (firstNonEmptyTile != null && firstNonEmptyTile.canMerge(tile)) {
				firstNonEmptyTile.merge(tile);
			} else if (farEmptyTile != null) {
				farEmptyTile.merge(tile);
			}

		}
	});

	return Tiles;
});