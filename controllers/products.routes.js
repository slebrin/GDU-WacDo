// Sample product data
let products = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 150 },
];

exports.getProducts = (req, res) => {
    res.json(products);
}