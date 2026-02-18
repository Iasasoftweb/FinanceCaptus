import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crea el contexto
export const ClientesContext = createContext();

// Proveedor del contexto
export const ClientesProvider = ({ children }) => {
    const [clientes, setClientes] = useState([]);


    
     const URIs = "http://localhost:8000/clientes/";

    // Función para obtener la lista de clientes
    const fetchClientes = async () => {
        try {
            const response = await axios.get(`${URIs}`);
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    // Llama a fetchClientes cuando se monta el proveedor
    useEffect(() => {
        fetchClientes();
    }, []);

    return (
        <ClientesContext.Provider value={{ clientes, fetchClientes }}>
            {children}
        </ClientesContext.Provider>
    );
};