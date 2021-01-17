import {useState} from 'react';

export const  useForm = (callback , initialState = {}) => {

    //UseState

    const [values , setValues]= useState(initialState)

     // handleSubmit
    const handleSubmit = (e) => {
        e.preventDefault()
        callback()
    }

    // HandleChange
    const handleChange = (e) => {
        setValues({...values , [e.target.name]: e.target.value})
    }

    return {
        handleSubmit,
        handleChange,
        values
    }
}