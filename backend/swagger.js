const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Job Tracker API',
    description: 'API documentation for the Job Tracker project'
  },
  host: 'localhost:5000', // Change if using a different port
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // Main entry point of your app

swaggerAutogen(outputFile, endpointsFiles, doc);