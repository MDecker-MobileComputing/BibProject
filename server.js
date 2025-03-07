import express from 'express';
import { JSONFilePreset } from 'lowdb/node';
import { middleware } from './middleware.js';
import bookController from './controllers/bookController.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { publishChange } from './mqttClient.js';

const PORT_NUMMER = 3000;

const app = express();
app.use(express.json());

const defaultDataObj = {
  books: []
};
const db = await JSONFilePreset('db.json', defaultDataObj);

app.use(middleware.middlewareApiKeyCheck);
app.use(middleware.middlewareLogger);
app.use(middleware.middlewareRequestZaehler);

app.use('/books', bookController);

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (req.method === 'POST' && res.statusCode === 201) {
      publishChange('kurs1234mueller/book', { url: `/books/${data.isbn}`, action: 'created', data });
    } else if (req.method === 'PUT' && res.statusCode === 200) {
      publishChange('kurs1234mueller/book', { url: `/books/${req.params.isbn}`, action: 'updated', data });
    } else if (req.method === 'DELETE' && res.statusCode === 204) {
      publishChange('kurs1234mueller/book', { url: `/books/${req.params.isbn}`, action: 'deleted' });
    }
    originalJson.call(this, data);
  };
  next();
});

app.use(express.static('public'));

app.listen(PORT_NUMMER, () => {
  console.log(`Web-Server lauscht auf Port ${PORT_NUMMER}\n`);
});