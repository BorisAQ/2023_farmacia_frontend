import React from 'react';
import './RecetaImpresion.css';
const RecetaItemImpresion = ({medicamento, costo}) => {
  return (
    <div className='recetaImpresionItem_detalle' key ={medicamento.id}>
        <div className='recetaImpresionItem_detalle_fecha'></div>
        <div className='recetaImpresionItem_detalle_medicamento'>{medicamento.medicamento.descripcion}</div>
        <div className='recetaImpresionItem_detalle_cantidad'>{medicamento.medicamento.cantidad}</div>
        <div className='recetaImpresionItem_detalle_costo'>{costo.toFixed(2)} </div>
        <div className='recetaImpresionItem_detalle_costo'>{(costo*medicamento.medicamento.cantidad).toFixed(2)} </div>
    </div>
  );
};

export default RecetaItemImpresion;

