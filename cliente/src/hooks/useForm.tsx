import { useState } from "react";

const useForm = (initialData) =>{

    const [form, setForm] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { 
      const { name, value } = e.target;
      setForm({ ...form, [name] : value}); 
    }

    const handeSubmit =(event) => {
        event.preventDefault();
        console.log('Enviando el Formulario')
    }

    return ( {form, loading, handleChange, handeSubmit})
}

export default useForm;