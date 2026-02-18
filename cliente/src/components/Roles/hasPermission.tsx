



const getUserRole= localStorage.getItem('role');

const rolePermissions = {
    ADMINISTRADOR: ["dashboard", "usuarios", "reportes", "configuracion",  "clientes", "rutas", "seguridad", "pagos", "gastos","prestamos"],
    SUPERVISOR: ["dashboard", "reportes", "clientes", "pagos", "gastos", "prestamos","gastos"],
    OPERADOR: ["dashboard", "clientes", "prestamos", "pagos"],
    COBRADOR: ["dashboard", "prestamos", "pagos"],
  };

  const hasPermission = (action) => {
    const role = getUserRole();
    return rolePermissions[role]?.includes(action);
  };

  export default hasPermission;