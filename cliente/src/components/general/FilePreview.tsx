import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./preview.css";

function FileViewer({ fieldID, Uri }) {
  const [fileIsValid, setFileIsValid] = useState(false);

  const UriImage = Uri + fieldID;

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  const fileName = fieldID;
  const extension = fileName.split(".").pop();

  useEffect(() => {
    if (validExtensions.includes(extension)) {
      setFileIsValid(true); // Archivo válido, actualiza el estado
    } else {
      setFileIsValid(false); // Archivo no válido
    }
    console.log(validExtensions.includes(extension));
  }, [fieldID]);

  return (
    <div className="h-100">
      {fileIsValid ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <img src={UriImage} alt="Vista previa" width="300" height="200" />
        </div>
      ) : (
        <object
          data={UriImage}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
}

export default FileViewer;
