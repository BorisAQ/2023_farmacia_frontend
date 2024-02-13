import React from 'react';
import './RecetaImpresion.css';
const RecetaItemImpresion = ({medicamento}) => {
  return (
    <div className='recetaImpresionItem_detalle' key ={medicamento.id}>
        <div className='recetaImpresionItem_detalle_fecha'></div>
        <div className='recetaImpresionItem_detalle_medicamento'>{medicamento.medicamento.descripcion}</div>
        <div className='recetaImpresionItem_detalle_cantidad'>{medicamento.cantidad}</div>
        <div className='recetaImpresionItem_detalle_costo'>{medicamento.medicamento.costo} </div>
        <div className='recetaImpresionItem_detalle_costo'>{medicamento.medicamento.costo*medicamento.cantidad} </div>
    </div>
  );
};

export default RecetaItemImpresion;

