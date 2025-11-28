const express = require('express');
const { getMenus, getMenu, createMenu, updateMenu, deleteMenu, updateMenuProducts } = require('../controllers/menus.controller');
const { validateMenu, handleValidationErrors } = require('../middleware/validators');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(auth, authorize('admin')); // protège toutes les routes menus

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: Gestion des menus (Administrateur uniquement)
 */

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Récupérer la liste des menus
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des menus récupérée avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getMenus);

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Récupérer un menu par son ID
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du menu à récupérer
 *     responses:
 *       200:
 *         description: Menu récupéré avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Menu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getMenu);

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Créer un nouveau menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             products:
 *               type: array
 *               items:
 *                 type: string
 *             price:
 *               type: number
 *             available:
 *               type: boolean
 *           required:
 *             - name
 *             - products
 *             - price
 *     responses:
 *       201:
 *         description: Menu créé avec succès
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', validateMenu, handleValidationErrors, createMenu);

/**
 * @swagger
 * /api/menus/{id}:
 *   put:
 *     summary: Mettre à jour un menu existant
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du menu à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             products:
 *               type: array
 *               items:
 *                 type: string
 *             price:
 *               type: number
 *             available:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Menu mis à jour avec succès
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Menu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', validateMenu, handleValidationErrors, updateMenu);

/**
 * @swagger
 * /api/menus/{id}/products:
 *   patch:
 *     summary: Mettre à jour les produits d'un menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du menu à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 type: string
 *           required:
 *             - products
 *     responses:
 *       200:
 *         description: Produits du menu mis à jour avec succès
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Menu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/products', updateMenuProducts);

/**
 * @swagger
 * /api/menus/{id}:
 *   delete:
 *     summary: Supprimer un menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du menu à supprimer
 *     responses:
 *       200:
 *         description: Menu supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Menu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', deleteMenu);

module.exports = router;