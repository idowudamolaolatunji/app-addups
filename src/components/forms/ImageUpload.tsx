 
import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'

interface Props {
    name: string;
    style?: any;
    preview: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
    handleRemove: () => void;
}

function ImageUpload({ name, preview, handleChange, style, handleRemove }: Props) {
    return (
        <span className={`form--img-box ${preview ? "img--preview" : ""}`} style={style}>
            <input type='file' id={name} name={name} accept="image/jpeg, image/png, image/jpg, image/svg" onChange={handleChange} />
            <label htmlFor={name}>
                {preview ? (
                    <img src={preview} alt='Preview' className='img' style={style ? style : {}} />
                ) : (
                    <h3>Click to upload image</h3>
                )}
            </label>

            {preview && <button onClick={handleRemove} style={{ fontSize: "2rem" }} className='form--upload-btn delete'><AiOutlineDelete style={{ fontSize: "2.4rem" }} /></button>}
        </span>
    )
}

export default ImageUpload