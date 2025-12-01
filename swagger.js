const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Déterminer le serveur actif en fonction de l'environnement
const getActiveServer = () => {
    if (process.env.NODE_ENV === 'production') {
        return {
            url: 'https://gdu-wac-do.vercel.app',
            description: 'Serveur de production'
        };
    } else {
        return {
            url: 'http://localhost:8000',
            description: 'Serveur de développement'
        };
    }
};

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GDU WacDo API",
            version: "1.0.0",
            description: "Documentation de l'API permettant de gérer les produits, les menus, les utilisateurs et les commandes.",
        },
        servers: [getActiveServer()],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Entrez votre token JWT (sans le préfixe "Bearer")'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsDoc(options);

const setupSwagger = (app) => {
    // Servir la documentation JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
    
    // Configuration personnalisée pour Vercel avec CDN
    const customHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>GDU WacDo API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
        window.onload = function() {
            SwaggerUIBundle({
                url: '/api-docs.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                validatorUrl: null,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
        </script>
    </body>
    </html>
    `;
    
    // Route personnalisée pour servir l'interface Swagger
    app.get('/api-docs', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(customHtml);
    });
};

module.exports = setupSwagger;