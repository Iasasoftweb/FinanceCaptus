import React, { useRef, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { HiddenInput, Label, ProfilePictureContainer } from "./styles";

//import { HiddenInput, ProfilePictureContainer, Label } from "./styles.tsx";

const ProfilePicture = ({ register }) => {
  const hiddenInputRef = useRef();

  const { ref: registerRef, ...rest } = register("profilePicture");
 
  const [preview, setPreview] = useState();
  const [imgGet, setImgGet] = useState();


  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    
    const urlImage = URL.createObjectURL(file);
    setPreview(urlImage);
    setImgGet(file)
      
    const formData = new FormData
      formData.append('imgDNI1', imgGet);
      
     
          
  };



  const onUpload = () => {
    hiddenInputRef.current.click();
  };

  const uploadButtonLabel = preview ? "Cambiar Imagen" : "Subir Imagen";

  return (
    <ProfilePictureContainer>
      <Label className="clFont">Imagen de Cliente</Label>

      <HiddenInput
        type="file"
        name="profilePicture"
        {...rest}
        onChange={handleUploadedFile}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
      />

      <Avatar src={preview} sx={{ width: 80, height: 80 }}  />

      <Button variant="contained" onClick={onUpload} color="success" className="clFont text-white mt-2">
        {uploadButtonLabel}
      </Button>
    </ProfilePictureContainer>
  );
};

export default ProfilePicture;