// generated with AI
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Operator = require('../../models/user.model');

let app = require('../../app');
let mongoServer;
let adminUser;
let adminToken;

beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    process.env.JWT_SECRET = 'testsecret';
    await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
    
    // Créer un utilisateur admin pour les tests
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    adminUser = await Operator.create({
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
    });
    adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Authentication Tests', () => {
    describe('POST /api/users/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'admin@test.com',
                    password: 'Admin123!'
                });
            
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe('admin@test.com');
            expect(res.body.user.role).toBe('admin');
            expect(res.body.user.password).toBeUndefined(); // password ne doit pas être renvoyé
        });

        it('should reject login with invalid email', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'wrong@test.com',
                    password: 'Admin123!'
                });
            
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Email ou mot de passe incorrect');
        });

        it('should reject login with invalid password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'admin@test.com',
                    password: 'WrongPassword123!'
                });
            
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Email ou mot de passe incorrect');
        });

        it('should reject login with missing fields', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'admin@test.com'
                });
            
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('Authorization Tests', () => {
        it('should allow admin to access protected route', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should reject request without token', async () => {
            const res = await request(app)
                .get('/api/users');
            
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Accès refusé. Token manquant.');
        });

        it('should reject request with invalid token', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', 'Bearer invalidtoken123');
            
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Token invalide.');
        });

        it('should reject non-admin user accessing admin route', async () => {
            // Créer un utilisateur non-admin
            const hashedPassword = await bcrypt.hash('User123!', 10);
            const regularUser = await Operator.create({
                email: 'user@test.com',
                password: hashedPassword,
                role: 'accueil'
            });
            const userToken = jwt.sign({ id: regularUser._id, role: 'accueil' }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Accès refusé. Permissions insuffisantes.');
        });

        it('should reject expired token', async () => {
            const expiredToken = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '0s' });
            
            // Attendre 1 seconde pour que le token expire
            await new Promise(resolve => setTimeout(resolve, 1000));

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${expiredToken}`);
            
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Token invalide.');
        });
    });

    describe('POST /api/users/register (Admin only)', () => {
        it('should allow admin to register new user', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'newuser@test.com',
                    password: 'NewUser123!',
                    role: 'preparateur'
                });
            
            expect(res.status).toBe(201);
            expect(res.body.email).toBe('newuser@test.com');
            expect(res.body.role).toBe('preparateur');
        });

        it('should reject registration without admin token', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'another@test.com',
                    password: 'Password123!',
                    role: 'accueil'
                });
            
            expect(res.status).toBe(401);
        });

        it('should reject duplicate email registration', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'admin@test.com', // Email déjà existant
                    password: 'Password123!',
                    role: 'accueil'
                });
            
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Cet email est déjà utilisé');
        });
    });
});
