 export const formatFechaVista = (fechaStr) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split('-');
    return `${day}-${month}-${year}`;
  };



   export const formatFechaVistaLetras = (fechaStr) => {
    if (!fechaStr) return "";
    
    const mesesAbv = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const [year, month, day] = fechaStr.split('-');
    const mesNombre = mesesAbv[parseInt(month) - 1];
    
    return `${day} ${mesNombre} ${year}`;
  };