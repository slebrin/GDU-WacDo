const express = require('express');
const { getProducts, getProductsByCategory, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { validateProduct, handleValidationErrors } = require('../middleware/validators');
const { auth, authorize } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/multer');
const router = express.Router();

router.use(auth, authorize('admin')); // protège toutes les routes products

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits (Administrateur uniquement)
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer la liste des produits
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Récupérer les produits par catégorie
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *           enum: [burger, salade, boisson, dessert, option]
 *         required: true
 *         description: Catégorie des produits à récupérer
 *     responses:
 *       200:
 *         description: Produits récupérés avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/category/:category', getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit à récupérer
 *     responses:
 *       200:
 *         description: Produit récupéré avec succès
 *       400:
 *         description: ID de produit invalide
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 required: true
 *               available:
 *                 type: boolean
 *               category:
 *                 type: string
 *                 enum: [burger, salade, boisson, dessert, option]
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', uploadMiddleware.single('image'), validateProduct, handleValidationErrors, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mettre à jour un produit existant
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *               category:
 *                 type: string
 *                 enum: [burger, salade, boisson, dessert, option]
 *               image:
 *                 type: string
 *                 format: binary
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', uploadMiddleware.single('image'), validateProduct, handleValidationErrors, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', deleteProduct);

module.exports = router;