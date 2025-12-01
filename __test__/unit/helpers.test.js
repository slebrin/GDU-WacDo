const { calculateOrderTotal } = require('../../utils/helpers');

describe('calculateOrderTotal', () => {
    it('calculate a simple total', () => {
        const items = [
            { quantity: 2, price: 5 }, // 10
            { quantity: 1, price: 3.5 } // 3.5
        ];
        expect(calculateOrderTotal(items)).toBe(13.5);
    });

    it('rounded two decimals', () => {
        const items = [
            { quantity: 3, price: 0.3333 }, // 0.9999
            { quantity: 1, price: 0.005 } // 0.005
        ]; // 1.0049 => 1.00 after rounding
        expect(calculateOrderTotal(items)).toBe(1.00);
    });
});
