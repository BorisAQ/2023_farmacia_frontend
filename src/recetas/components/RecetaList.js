import React from "react";
import './RecetaList.css'
import Card from "../../shared/components/UIElements/Card";
import RecetaItem from "./RecetaItem";


const RecetaList = props=>{
    if (props.recetas.length ===0 ){
        return <div className="ente-list center">
            <Card>
                <h2>No se encontraron recetas</h2>
                <button>+ RECETA</button>
            </Card>

        </div>
    }
    return <ul className="ente-list">
        {
            props.recetas.map (
                receta => <RecetaItem 
                    key={receta.id} 
                    id={receta.id}  
                    fecha = {receta.fecha}
                    usuario = {receta.usuario.name}
                    medicamentos = {receta.medicamentos}
                    persona = {receta.persona.apellidosNombres}                    
                    />)
        }
    </ul>;
};

export default RecetaList;
