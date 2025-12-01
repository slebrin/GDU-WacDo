const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

let app;
let mongoServer;
let adminToken;
let createdProduct;

describe('Routes Produits (admin)', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        process.env.DB_CONNECTION_STRING = mongoServer.getUri();
        process.env.NODE_ENV = 'test';
        process.env.PORT = 0; // évite l'écoute réelle
        process.env.JWT_SECRET = 'testsecret';
        adminToken = jwt.sign({ id: 'admin-user', role: 'admin' }, process.env.JWT_SECRET);
        app = require('../../app');
        // attendre connexion mongo
        await mongoose.connection.asPromise();
    }, 30000);

    afterAll(async () => {
        await mongoose.connection.close();
        if (mongoServer) await mongoServer.stop();
    });

    describe('GET /api/products (liste vide)', () => {
        test('renvoie 200 et tableau vide initialement', async () => {
            const res = await request(app)
                .get('/api/products')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });

    describe('POST /api/products', () => {
        test('crée un produit valide', async () => {
            const payload = {
                name: 'Burger Test',
                description: 'Un burger de test',
                price: 9.5,
                available: true,
                category: 'burger'
            };
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(payload);
            expect(res.status).toBe(201);
            expect(res.body._id).toBeDefined();
            expect(res.body.name).toBe(payload.name);
            createdProduct = res.body;
        });

        test('rejette création sans nom', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 2 });
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('GET /api/products/:id', () => {
        test('récupère le produit créé', async () => {
            const res = await request(app)
                .get(`/api/products/${createdProduct._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body._id).toBe(createdProduct._id);
        });

        test('renvoie 400 pour id invalide', async () => {
            const res = await request(app)
                .get('/api/products/invalidid')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(400);
        });

        test('renvoie 404 pour id inexistant', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/products/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/products/category/:category', () => {
        test('renvoie produits par catégorie burger', async () => {
            const res = await request(app)
                .get('/api/products/category/burger')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            expect(res.body[0].category).toBe('burger');
        });
    });

    describe('PUT /api/products/:id', () => {
        test('met à jour le prix du produit', async () => {
            const newPrice = 10.99;
            const res = await request(app)
                .put(`/api/products/${createdProduct._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .field('name', createdProduct.name) // requis par validateProduct
                .field('price', newPrice.toString())
                .field('category', 'burger');
            expect(res.status).toBe(200);
            expect(res.body.price).toBe(newPrice);
            createdProduct = res.body;
        });
    });

    describe('DELETE /api/products/:id', () => {
        test('supprime le produit et confirme suppression', async () => {
            const resDelete = await request(app)
                .delete(`/api/products/${createdProduct._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(resDelete.status).toBe(200);
            const resGet = await request(app)
                .get(`/api/products/${createdProduct._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(resGet.status).toBe(404);
        });
    });
});
