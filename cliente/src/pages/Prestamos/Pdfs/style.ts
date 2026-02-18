import { StyleSheet } from "@react-pdf/renderer";

export const style = StyleSheet.create({
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
})