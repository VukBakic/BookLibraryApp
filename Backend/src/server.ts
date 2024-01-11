import express from 'express';
import config from 'config';
import cors from 'cors';

import session from 'express-session';

import connect from './db/connect';
import log from './logger';

import fs from 'fs';
import path from 'path';

const app = express();

app.use(
  session({
    secret: 'development key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static('public'));

app.use(cors());
app.use(express.json());

const port = config.get('port') as number;

const routePath = path.join(__dirname, 'routes');

fs.readdirSync(routePath).forEach(async (filename: string) => {
  let route = path.join(routePath, filename);
  try {
    const item = await import(route);
    app.use(`/api/${filename.replace('.routes.ts', '')}`, item.default);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  log.info(`Initial Application running on port ${port}.`);
  connect();
});
