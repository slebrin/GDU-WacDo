const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');

let app = require('../../app');
let mongoServer;
let createdProduct;

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
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('GET /api/products', () => {
    it('returns 200 and an empty array', async () => {
        const res = await request(app)
            .get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    it('creates a product', async () => {
        const payload = {
            name: 'Burger Test',
            description: 'Un burger de test',
            price: 9.5,
            available: true,
            category: 'burger'
        };
        const res = await request(app)
            .post('/api/products')
            .send(payload);
        expect(res.status).toBe(201);
        expect(res.body._id).toBeDefined();
        expect(res.body.name).toBe(payload.name);
        createdProduct = res.body;
    });
});

describe('GET /api/products/:id', () => {
    it('retrieves the created product', async () => {
        const res = await request(app)
            .get('/api/products/' + createdProduct._id);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(createdProduct._id);
    });

    it('returns 400 for invalid id', async () => {
        const res = await request(app)
            .get('/api/products/invalidid');
        expect(res.status).toBe(400);
    });
});

describe('GET /api/products/category/:category', () => {
    it('returns products by burger category', async () => {
        const res = await request(app)
            .get('/api/products/category/burger');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0].category).toBe('burger');
    });
});

describe('PUT /api/products/:id', () => {
    it('updates the product price', async () => {
        const newPrice = 10.99;
        const res = await request(app)
            .put('/api/products/' + createdProduct._id)
            .field('name', createdProduct.name)
            .field('price', newPrice)
            .field('category', 'burger');
        expect(res.status).toBe(200);
        expect(res.body.price).toBe(newPrice);
        createdProduct = res.body;
    });
});

describe('DELETE /api/products/:id', () => {
    it('deletes the product and confirms deletion', async () => {
        const resDelete = await request(app)
            .delete('/api/products/' + createdProduct._id);
        expect(resDelete.status).toBe(200);
        const resGet = await request(app)
            .get('/api/products/' + createdProduct._id);
        expect(resGet.status).toBe(404);
    });
});