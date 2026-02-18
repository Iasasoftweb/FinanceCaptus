import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import axios from "axios";
import { style } from "./style";


const PrnPrestamos = () => {
 
  const [NombreEmpresa, setNombreEmpresa] = useState("");
  const [imgLogo, setImgLogo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono1, setTelefono1] = useState("");
  const [telefono2, setTelefono2] = useState("");

  const uriImg = "http://localhost:8000/uploadEmpresa/";
  

  const GetEmpresas = async () => {
    const response = await axios.get(`http://localhost:8000/empresas/`);
    const data = response?.data.data || response.data[0];
    setNombreEmpresa(data.empresa);
    setImgLogo(data.logoempresa);
    setDireccion(data.direccion);
    setTelefono1(data.telefono1);
    setTelefono2(data.telefono2);
    
  };

  useEffect(() => {
    GetEmpresas();
  }, []);

  
  return (
   
    <Document>
      <Page size="A4" style={style.page}>
        <View style={style.seccion}>
        <View style={style.styleLogo}>
          <Image src={`${uriImg}${imgLogo}`} style={style.imgSize}></Image>
          <Text style={style.textTitulo}>{NombreEmpresa}</Text>
          <Text style={{ fontSize: 10, lineHeight: 0 }}>{direccion}</Text>
          <Text style={{ fontSize: 10, lineHeight: 0 }}>
            {telefono1} / {telefono2}
          </Text>
        </View>
        </View>
        
      </Page>
    </Document>
   
    
  );
};

export default PrnPrestamos;
