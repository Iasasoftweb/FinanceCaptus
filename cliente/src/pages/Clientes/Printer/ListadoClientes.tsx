import React, { useState, useEffect, useRef } from "react";
import Barcode from "react-barcode";
import axios from "axios";
import "../clientes.css";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import getCliente from "../../../data/clientes/Getclientes";

const ListadoClientes = () => {
  //const ref = {ref};

  const UriEmpresa = "http://localhost:8000/empresas/estado";
  const UriImg = "http://localhost:8000/uploadEmpresa/";
  const URIs = "http://localhost:8000/clientes/estado/";

  const [empresasData, setEmpresasData] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [nombreTitulo, setNombreTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono1, setTelefono1] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [countLine, setCountLine] = useState(1);
  const [dataCliente, setDataCliente] = useState([]);

  const getEmpresa = async () => {
    try {
      const responde = await axios.get(`${UriEmpresa}`);
      
      const Data = responde?.data.data || responde.data[0];
     
      setEmpresasData(Data);
      setSelectedFileId(Data.logoempresa);
      setNombreTitulo(Data.empresa);
      setDireccion(Data.direccion);
      setTelefono1(Data.telefono1);
      setTelefono2(Data.telefono2);
      console.log(Data.telefono1)
    } catch (error) {
      console.error(error);
      setSelectedFileId(null);
    }
  };

  const getClientes = async (opcion) => {
    try {
      console.log(opcion);
      const respuesta = await axios.get(`${URIs}${opcion}`);
      setDataCliente(respuesta.data);
      console.log(respuesta.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmpresa();
    console.log(localStorage.getItem("estadoCliente"));
    getClientes(localStorage.getItem("estadoCliente"));
  }, []);

  const style = StyleSheet.create({
    page: { flexDirection: "column", backgroundColor: "#fff", display: "flex" },
    seccion: { margin: 20, padding: 20, flexGrow: 1, lineHeight: 1 },
    table: {
      display: "flex",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#a9a9a9",
    },
    tableRow: { flexDirection: "row" },
    tableCol: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#a9a9a9",
    },

    tableStartRow: {
      backgroundColor: "#0068BD",
      width: "25%",
      borderStyle: "solid",
      borderWidth: 0,
      borderColor: "#a9a9a9",
      color: "#ffff",
    },

    tableDNIRow: {
      backgroundColor: "#0068BD",
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#a9a9a9",
      color: "#ffff",
    },
    tableNombreRow: {
      backgroundColor: "#0068BD",
      width: "45%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#a9a9a9",
      color: "#ffff",
    },
    tableCell: { margin: "auto", marginTop: 5, fontSize: 9 },
    imgSize: { width: 150, height: 100 },
    styleLogo: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textTitulo: { fontSize: 15, lineHeight: 0, fontWeight: "demibold" },
  });
  return (
  
      <Document>
        <Page size="A4" style={style.page}>
          <View style={style.seccion}>
            <View style={style.styleLogo}>
              <Image
                src={`${UriImg}${selectedFileId}`}
                style={style.imgSize}
              ></Image>
              <Text style={style.textTitulo}>{nombreTitulo}</Text>
              <Text style={{ fontSize: 10, lineHeight: 0 }}>{direccion}</Text>
              <Text style={{ fontSize: 10, lineHeight: 2 }}>
                Tel: {telefono1} {telefono2 && "/"} {telefono2}{" "}
              </Text>

              <Text style={style.textTitulo}>Listado de Clientes Activos</Text>
            </View>

            <View style={style.table}>
              <View style={style.tableRow}>
                <View
                  style={{
                    width: "25px",
                    backgroundColor: "#0068BD",
                    color: "#ffff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "10px",
                      margin: " auto",
                      marginTop: "5px",
                    }}
                  >
                    #
                  </Text>
                </View>
                <View style={style.tableDNIRow}>
                  <Text
                    style={{
                      fontSize: "9px",
                      alignItems: "center",
                      margin: "auto",
                      marginTop: "5px",
                    }}
                  >
                    DNI
                  </Text>
                </View>
                <View style={style.tableNombreRow}>
                  <Text
                    style={{
                      fontSize: "9px",
                      alignItems: "center",
                      margin: "auto",
                      marginTop: "5px",
                    }}
                  >
                    Nombres
                  </Text>
                </View>
                <View style={style.tableStartRow}>
                  <Text style={style.tableCell}>Ciudad</Text>
                </View>
                <View style={style.tableStartRow}>
                  <Text style={style.tableCell}>Telefonos</Text>
                </View>
                <View style={style.tableStartRow}>
                  <Text style={style.tableCell}>Rutas</Text>
                </View>
              </View>

              {dataCliente.map((item, index) => (
                <View style={style.tableRow}>
                  <View
                    style={{
                      borderColor: "#a9a9a9",
                      borderWidth: "1",
                      borderStyle: "solid",
                    }}
                  >
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontSize: "9px",
                        padding: "2px",
                        width: "25px",
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderColor: "#a9a9a9",
                      borderWidth: "1",
                      borderStyle: "solid",
                      width: "20%",
                    }}
                  >
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontSize: "9px",
                        padding: "2px",
                      }}
                    >
                      {item.dni}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "45%",
                      borderColor: "#a9a9a9",
                      borderWidth: "1",
                      borderStyle: "solid",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "9px",
                        padding: "2px",
                        marginLeft: "0px",
                      }}
                    >
                      {item.nombres} {item.apellidos}
                    </Text>
                  </View>

                  <View style={style.tableCol}>
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontSize: "9px",
                        padding: "2px",
                      }}
                    >
                      {item.ciudad}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontSize: "9px",
                        padding: "2px",
                      }}
                    >
                      {item.telefono1}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontSize: "9px",
                        padding: "2px",
                      }}
                    >
                      {item.tbzona.nombrerutas}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>

    
  
  );
};

export default ListadoClientes;
