import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import imageSize from 'image-size';

function fileFilter(req: any, file: any, cb: any) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Pogresna ekstenzija fajla.'));
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '././temp/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    req.avatar = {
      extension: path.extname(file.originalname),
      filename: file.fieldname + '-' + uniqueSuffix,
    };
    req.image = req.avatar;
    cb(null, file.fieldname + '-' + uniqueSuffix);

    // cb(null, username + path.extname(file.originalname));
  },
});

const avatarUpload = multer({ storage: storage, fileFilter: fileFilter }).any();

const validateImage = (req: Request, res: Response, next: NextFunction) => {
  avatarUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(422)
        .send({ errors: [{ field: 'avatar', message: 'Greska u fajlu.' }] });
    } else if (err) {
      return res
        .status(422)
        .send({ errors: [{ field: 'avatar', message: err.message }] });
    }
    if (!req.avatar) {
      return next();
      /*return res.status(422).send({
        errors: [
          {
            field: 'avatar',
            message: 'Polje avatar je neophodno',
          },
        ],
      });*/
    }
    imageSize(`././temp/${req.avatar.filename}`, (err, size) => {
      let width = size?.width;
      let height = size?.height;

      if (width && height) {
        if (width >= 100 && width <= 300 && height >= 100 && height <= 300) {
          return next();
        }
      }
      return res.status(422).send({
        errors: [
          {
            field: 'avatar',
            message: 'Slika mora biti u granicama (100x100 px - 300x300 px)',
          },
        ],
      });
    });
  });
};
const renameImage = (req: Request, res: Response) => {
  const avatar = req.avatar;

  let msg = 'Uspesno ste se registrovali';
  if (req.updated) msg = 'Azuriranje uspesno.';

  if (!avatar) return res.send({ success: true, message: msg });

  let oldPath = `././temp/${avatar.filename}`;
  let newPath = `././public/images/users/${req.body['username']}${avatar.extension}`;

  fs.rename(oldPath, newPath, function (err) {
    if (err) throw err;
    return res.send({ success: true, message: msg });
  });
};

const deleteImage = (avatar: any) => {
  if (!avatar) return;
  let oldPath = `././temp/${avatar.filename}`;
  fs.unlink(oldPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

const validateBookImage = (req: Request, res: Response, next: NextFunction) => {
  avatarUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(422)
        .send({ errors: [{ field: 'image', message: 'Greska u fajlu.' }] });
    } else if (err) {
      return res
        .status(422)
        .send({ errors: [{ field: 'image', message: err.message }] });
    }
    if (!req.image) {
      return next();
    }
    imageSize(`././temp/${req.image.filename}`, (err, size) => {
      let width = size?.width;
      let height = size?.height;

      if (width && height) {
        if (width >= 100 && width <= 1000 && height >= 100 && height <= 1000) {
          return next();
        }
      }
      return res.status(422).send({
        errors: [
          {
            field: 'image',
            message: 'Slika mora biti u granicama (100x100 px - 1000x1000 px)',
          },
        ],
      });
    });
  });
};
const renameBookImage = (req: Request, res: Response) => {
  const image = req.image;

  let text = image?.updated ? 'dodali' : 'azurirali';
  if (req.pending) text = 'poslali zahtev. Obavesticemo Vas ako dodamo ';
  if (!image)
    return res.send({ success: true, message: `Uspesno ste ${text} knjigu` });

  let oldPath = `././temp/${image.filename}`;
  let newPath = `././public/images/books/${req.image.img_path}`;

  fs.rename(oldPath, newPath, function (err) {
    if (err) throw err;
    return res.send({ success: true, message: `Uspesno ste ${text} knjigu` });
  });
};

export {
  validateImage,
  renameImage,
  deleteImage,
  validateBookImage,
  renameBookImage,
};
