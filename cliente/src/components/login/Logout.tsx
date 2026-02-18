import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const Logout = () => {
  const navigate = useNavigate();
  console.log(localStorage.getItem('token'))
  useEffect(() => {
    // Eliminar el token de localStorage (o cualquier otro almacenamiento que uses)
    localStorage.removeItem('token');
    
    // Redirigir al login
    < Navigate to ="/login"/>;
  }, [navigate]);

  return null; // El componente no necesita renderizar nada
};

export default Logout;