import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Customnavigate({to}){
    const navigate = useNavigate();
    useEffect(()=>{
        navigate(to, {replace:true});
    })
    return null;
}