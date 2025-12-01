const express = require('express');
const { getOrders, getOrdersByStatus, getOrder, createOrder, updateOrderStatus, deleteOrder } = require('../controllers/orders.controller');
const { validateOrder, validateOrderStatus, handleValidationErrors } = require('../middleware/validators');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(auth); // protège toutes les routes orders

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer la liste des commandes (Administrateur uniquement)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authorize('admin'), getOrders);

/**
 * @swagger
 * /api/orders/status/{status}:
 *   get:
 *     summary: Récupérer les commandes par statut (Préparateur et Accueil)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           enum: [en_attente, en_preparation, preparee, livree]
 *         required: true
 *         description: Statut des commandes à récupérer
 *     responses:
 *       200:
 *         description: Commandes récupérées avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.get('/status/:status', authorize('preparateur', 'accueil'), getOrdersByStatus);

/**
 * @swagger
 * /api/orders/{orderNumber}:
 *   get:
 *     summary: Récupérer une commande par son numéro (Préparateur et Accueil)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: Numéro de la commande à récupérer
 *     responses:
 *       200:
 *         description: Commande récupérée avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:orderNumber', authorize('preparateur', 'accueil'), getOrder);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une nouvelle commande (Accueil uniquement)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [en_attente, en_preparation, preparee, livree]
 *               total:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: string
 *                     itemModel:
 *                       type: string
 *                       enum: [Product, Menu]
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *             required:
 *               - items
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authorize('accueil'), validateOrder, handleValidationErrors, createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande (Préparateur et Accueil)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [en_attente, en_preparation, preparee, livree]
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Statut de la commande mis à jour avec succès
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/status', authorize('preparateur', 'accueil'), validateOrderStatus, handleValidationErrors, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Supprimer une commande (Administrateur uniquement)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande à supprimer
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authorize('admin'), deleteOrder);

module.exports = router;