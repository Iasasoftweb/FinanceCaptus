import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  
    destination: function(req, file, cb){
         cb(null, 'uploads/');

    }, 
     filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
      console.log(file.originalname);
    }

   
  });
  
 
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb('Error: Tipo de archivo no soportado');
  };
  
  const SubirImagen = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limitar tamaño a 5MB
    fileFilter: fileFilter
  });
  
  export default SubirImagen