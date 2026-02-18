import React, {useEffect, useState}  from "react"
import { Container } from "@mui/material"
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import ListadoClientes from "./ListadoClientes";

const PrinterContainer = () => {
   const [Estado, setEstado] = useState('');
    
   return (
     
        <Container sx={{my : "50px"}} >
   
            <PDFViewer  style={{width : "100%", height : "700px"}}>
                <ListadoClientes />
            </PDFViewer >
        
        </Container>
     
   )
}


export default PrinterContainer;