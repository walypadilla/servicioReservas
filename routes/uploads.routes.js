/*
    Rutas: /api/uploads
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middleware/validar-jwt.middleware');
const { UploadController } = require('../controllers/index.controller');

const router = Router();

router.use(expressFileUpload());

router.put('/user/:id', validarJWT, UploadController.fileUpload);
router.get('/user/:photo', validarJWT, UploadController.getImage);

module.exports = router;
