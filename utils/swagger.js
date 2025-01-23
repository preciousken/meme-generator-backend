import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meme Generator API',
      version: '1.0.0',
      description: 'API documentation for the Meme Generator application',
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs }; 