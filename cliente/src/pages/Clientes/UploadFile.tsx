import * as React from "react"
import { useState } from "react"
import useForm from "../../hooks/useForm";

function ImageUpload() {
    const [image, setImage] = useState('');

    function handleImage(e) {
        setImage(e.target.file[0])
    }
    
    return (
        <div>
            <input type="file" name="file" onChange={handleImage} />
        </div>
    ) 

}
