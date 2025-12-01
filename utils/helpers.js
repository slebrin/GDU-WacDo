// Calcul le total d'une commande à partir de ses articles et arrondi à 2 décimales : items: [{ quantity: Number, price: Number }]
exports.calculateOrderTotal = function(items = []) {
	const total = items.reduce((sum, item) => {
		const qty = (typeof item.quantity === 'number') ? item.quantity : 0;
		const price = (typeof item.price === 'number') ? item.price : 0;
		return sum + qty * price;
	}, 0);
	return Math.round(total * 100) / 100;
};
