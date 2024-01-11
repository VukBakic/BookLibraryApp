import mongoose from 'mongoose';
import config from 'config';
import log from '../logger';
import fs from 'fs';
import path from 'path';

function connect() {
  const dbUri = config.get('dbUri') as string;

  return mongoose
    .connect(dbUri)
    .then(() => {
      log.info('Database connected');
      var models_path = path.join(__dirname, '../model');
      try {
        fs.readdirSync(models_path).forEach(function (file) {
          require(models_path + '/' + file);
        });
        log.info('Models loaded');
      } catch (error: any) {
        console.log(error);
      }
    })
    .catch((error) => {
      log.error('db error', error);
      process.exit(1);
    });
}

export default connect;
