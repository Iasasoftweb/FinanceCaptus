import multer from "multer";
import path from "path";


// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/clientes"); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split('.')[0] + "_" + Date.now() + path.extname(file.originalname));
  
  },
});

const upload = multer({ storage });

export default upload;
