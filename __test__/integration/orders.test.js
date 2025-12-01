const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');

let app = require('../../app');
let mongoServer;
let createdProduct;
let createdOrder;

jest.mock('../../middleware/auth', () => ({
    auth: (req, res, next) => {
        req.user = { id: '607f1f77bcf86cd799439011', role: 'admin' };
        next();
    },
    authorize: (...roles) => (req, res, next) => {
        next();
    }
}));

beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
    
    // Créer un produit pour les tests de commandes
    const productPayload = {
        name: 'Burger Test',
        description: 'Un burger de test',
        price: 9.5,
        available: true,
        category: 'burger'
    };
    const res = await request(app)
        .post('/api/products')
        .send(productPayload);
    createdProduct = res.body;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('GET /api/orders', () => {
    it('returns 200 and an empty array', async () => {
        const res = await request(app)
            .get('/api/orders');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    it('creates an order', async () => {
        const payload = {
            items: [
                {
                    item: createdProduct._id,
                    itemModel: 'Product',
                    quantity: 2,
                    price: createdProduct.price
                }
            ]
        };
        const res = await request(app)
            .post('/api/orders')
            .send(payload);
        expect(res.status).toBe(201);
        expect(res.body._id).toBeDefined();
        expect(res.body.orderNumber).toBeDefined();
        expect(res.body.status).toBe('en_attente');
        expect(res.body.total).toBe(createdProduct.price * 2);
        expect(res.body.items.length).toBe(1);
        createdOrder = res.body;
    });
});

describe('GET /api/orders/:orderNumber', () => {
    it('retrieves the created order by order number', async () => {
        const res = await request(app)
            .get('/api/orders/' + createdOrder.orderNumber);
        expect(res.status).toBe(200);
        expect(res.body.orderNumber).toBe(createdOrder.orderNumber);
        expect(res.body._id).toBe(createdOrder._id);
    });
});

describe('GET /api/orders/status/:status', () => {
    it('returns orders with en_attente status', async () => {
        const res = await request(app)
            .get('/api/orders/status/en_attente');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0].status).toBe('en_attente');
    });
});

describe('PATCH /api/orders/:id/status', () => {
    it('updates the order status to en_preparation', async () => {
        const newStatus = 'en_preparation';
        const res = await request(app)
            .patch('/api/orders/' + createdOrder._id + '/status')
            .send({ status: newStatus });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(newStatus);
        createdOrder = res.body;
    });
});

describe('DELETE /api/orders/:id', () => {
    it('deletes the order and confirms deletion', async () => {
        const resDelete = await request(app)
            .delete('/api/orders/' + createdOrder._id);
        expect(resDelete.status).toBe(200);
        expect(resDelete.body.message).toBeDefined();
        
        const resGet = await request(app)
            .get('/api/orders/' + createdOrder.orderNumber);
        expect(resGet.status).toBe(404);
    });
});
