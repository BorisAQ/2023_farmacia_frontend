import React from "react";
import './ServicioList.css'
import Card from "../../shared/components/UIElements/Card";

import ServicioItem from "./ServicioItem";

const ServicioList = props=>{
    if (props.items.length ===0 ){
        return <div className="ente-list center">
            <Card>
                <h2>No services found, maybe create one?</h2>
                <button>Create Service</button>
            </Card>

        </div>
    }
    return <ul className="ente-list">
        {
            props.items.map (
                service => <ServicioItem 
                    key={service.id} 
                    id={service.id}                     
                    name = {service.name} 
                    codigoSistema =  {service.codigoSistema}
                    usuarios= {service.usuarios}
                    onDelete ={
                        props.onDeletePlace
                    }
                    />)
        }
    </ul>;
};

export default ServicioList;
