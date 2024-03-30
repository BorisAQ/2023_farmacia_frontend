import React, {useEffect, useState, useContext, useRef } from 'react';
import { useReactToPrint} from 'react-to-print';
import './RecetaList.css'
import RecetaItem from "./RecetaItem";

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { Link } from 'react-router-dom';
import './RecetaImpresion.css';
import { AiFillPlusSquare  } from "react-icons/ai";
import RecetaItemImpresion from './RecetaItemImpresion';
const RecetaList  = props=>{
    const auth = useContext(AuthContext);
    const [recetas, setloadedRecetas]= useState([]);
    const [fechaInicial, setFechaInicial] = useState(new Date().toISOString());
    const [fechaFinal, setFechaFinal] = useState(new Date().toISOString());
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const printRefSD = useRef(null);
    const printRefMSC = useRef(null);
    const handlePrinterSD = useReactToPrint ({
        content:  ()=>printRefSD.current
    });
    const handlePrinterMSC = useReactToPrint ({
        content:  ()=>printRefMSC.current
    });
    useEffect(() => {  
        const fetchRecetas = async () => {
          try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/recetas/${auth.servicio.codigoSistema}/recetas?fechainicial=${fechaInicial}&fechafinal=${fechaFinal}`,
                'GET',null
              ,
               {          
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + auth.token,                
              }
            );                              
            setloadedRecetas(responseData);                
          } catch (err) {}
        };
        fetchRecetas();
        
    
      }, [fechaFinal, fechaInicial]);
    
    
      const actualizarFechaInicial = (e)=>{
        setFechaInicial (e.target.value)
        
      };

      const actualizarFechaFinal = (e)=>{        
        setFechaFinal(e.target.value);
      };



/*    if (recetas.length ===0 ){
        return <div className="ente-list center">
            <Card>
                <h2>No se encontraron recetas</h2>
                <button>+ RECETA</button>
            </Card>

        </div>
    }*/
    return <React.Fragment>  
                                          
        
        <div id ="menu" className="busqueda_contenedor">        
                <div className='fechaDiv'>                    
                    <input id ="idfechaInicio" 
                        className='fechaIntro'
                        type= "date"  
                        onChange={actualizarFechaInicial}
                        defaultValue={new Date().toLocaleDateString('en-CA')}/>                    
                </div>
                <div className='fechaDiv'>
                    
                    <input id ="idfechaFin" 
                        className='fechaIntro'
                        type= "date"  defaultValue={new Date().toLocaleDateString('en-CA')}
                        onChange={actualizarFechaFinal}
                    />

                </div>  
 
                <div className='nuevoDiv'>        
                     <Link className="buttonRecetaNuevo"
                        disabled={isLoading} to={`/recetas/new`}><span className='mostrarBusqueda'>NUEVO </span><AiFillPlusSquare />
                    </Link>
                </div>
                                             
                         
        </div>
        <div id= 'recetas' className="contenedorLista">
            
                    {
                        
                       recetas.recetas &&  (recetas.recetas.map (
                            receta => <RecetaItem 
                                key={receta.id} 
                                id={receta._id}  
                                fecha = {receta.fecha}
                                usuario = {receta.usuario.name}
                                medicamentos = {receta.medicamentos}
                                persona = {receta.persona}  
                                costoSD = {receta.costoSD}
                                costoMSC = {receta.costoMSC}                              
                                />))
                    }
                
        </div>

        <div className={`form-control`}>
            <button onClick ={handlePrinterSD} className='button'>IMPRIMIR PROFORMA SD</button>                                                  
        </div>                               
        <div ref = {printRefSD} className='print-agreement'>
                <div id='impresionSD' className='impresion_contenedor' >
                    <header className='impresion_contenedor_header'>
                        <h3 className='impresion_contenedor_header'>Recetas emitidas en {auth.servicio.name} SD-MSC</h3>
                        <h4 className='impresion_contenedor_header'>
                             Desde: {fechaInicial.substring(0,10)} hasta: {fechaFinal.substring(0,10)}
                        </h4>
                        <h3>Costo total: {recetas.costoTotalSD}</h3>
                    </header>
                    <main>                        
                        <article className='recetaImpresion'>
                            <div className='recetaImpresion_fecha'>
                                Fecha
                            </div>
                            <div className='recetaImpresion_apellidos_nombres'> 
                                Detalle
                            </div>
                            <div className='recetaImpresion_cantidad'> 
                                Cantidad
                            </div>
                            <div className='recetaImpresion_costo'> 
                                CU
                            </div>  
                            <div className='recetaImpresion_costo'> 
                                Costo
                            </div>                                                        
                        </article>
                        {                        
                        recetas.recetas &&  (recetas.recetas.filter((receta)=>receta.costoSD >0).map (
                             receta =>  <article key={receta._id} className='recetaImpresionItem'>                          
                                            <div className='recetaImpresionItem_cabecera'>
                                                <div className='recetaImpresionItem_cabecera_fecha'>{receta.fecha.substring(0,10)}</div>
                                                <div className='recetaImpresionItem_cabecera_apellidos_nombres'>{receta.persona.apellidosNombres}</div>
                                            </div>
                                            <div >         
                                                {
                                                    receta.medicamentos && receta.medicamentos.filter((medicamento)=>medicamento.medicamento.costoSD >0).map (
                                                        medicamento => <RecetaItemImpresion key = {medicamento._id} medicamento ={medicamento} costo = {medicamento.medicamento.costoSD}/>
                                                    )                                                   
                                                }                                                                                                                                                                                                  
                                            </div>
                                            <div className='recetaImpresionItem_pie'>
                                                    <div className='recetaImpresionItem_cabecera_fecha'></div>
                                                    <div className='recetaImpresionItem_detalle_medicamento'>TOTAL</div>
                                                    <div className='recetaImpresionItem_detalle_cantidad'></div>
                                                    <div className='recetaImpresionItem_detalle_costo'></div>
                                                    <div className='recetaImpresionItem_detalle_costo'>{receta.costoSD.toFixed(2)} </div>
                                            </div>
                                        </article>    ))
                        }                                 
                    </main>                   
                </div>
        </div>
        <div className={`form-control`}>
            <button onClick ={handlePrinterMSC} className='button'>IMPRIMIR PROFORMA MSC</button>                                                  
        </div>                               
        <div ref = {printRefMSC} className='print-agreement'>        
                <div id='impresionMSC' className='impresion_contenedor' >
                    <header className='impresion_contenedor_header'>
                        <h3 className='impresion_contenedor_header'>Recetas emitidas en {auth.servicio.name} MSC </h3>
                        <h4 className='impresion_contenedor_header'>
                             Desde: {fechaInicial.substring(0,10)} hasta: {fechaFinal.substring(0,10)}
                        </h4>
                        <h3>Costo total: {recetas.costoTotalMSC }</h3>
                    </header>
                    <main>                        
                        <article className='recetaImpresion'>
                            <div className='recetaImpresion_fecha'>
                                Fecha
                            </div>
                            <div className='recetaImpresion_apellidos_nombres'> 
                                Detalle
                            </div>
                            <div className='recetaImpresion_cantidad'> 
                                Cantidad
                            </div>
                            <div className='recetaImpresion_costo'> 
                                CU
                            </div>  
                            <div className='recetaImpresion_costo'> 
                                Costo
                            </div>                                                        
                        </article>

                        {                        
                        recetas.recetas &&  (recetas.recetas.filter((receta)=>receta.costoMSC >0).map (
                             receta =>  <article key={receta._id} className='recetaImpresionItem'>                          
                                            <div className='recetaImpresionItem_cabecera'>
                                                <div className='recetaImpresionItem_cabecera_fecha'>{receta.fecha.substring(0,10)}</div>
                                                <div className='recetaImpresionItem_cabecera_apellidos_nombres'>{receta.persona.apellidosNombres}</div>
                                            </div>
                                            <div >         
                                                {
                                                    receta.medicamentos && receta.medicamentos.filter((medicamento)=>medicamento.medicamento.costoMSC >0).map (
                                                        medicamento => <RecetaItemImpresion key = {medicamento._id} medicamento ={medicamento} costo = {medicamento.medicamento.costoMSC}/>
                                                    )                                                   
                                                }                                                                                                                                                                                                  
                                            </div>
                                            <div className='recetaImpresionItem_pie'>
                                                    <div className='recetaImpresionItem_cabecera_fecha'></div>
                                                    <div className='recetaImpresionItem_detalle_medicamento'>TOTAL</div>
                                                    <div className='recetaImpresionItem_detalle_cantidad'></div>
                                                    <div className='recetaImpresionItem_detalle_costo'></div>
                                                    <div className='recetaImpresionItem_detalle_costo'>{receta.costoMSC.toFixed(2)} </div>
                                            </div>
                                        </article>    ))
                        }                                 
                    </main>                   
                </div>
            </div>

            
    </React.Fragment>
    
        
};

export default RecetaList;
