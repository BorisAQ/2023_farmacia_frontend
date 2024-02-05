    import { createSlice } from "@reduxjs/toolkit";
    const initialState = {        
        userId: null,
        token: null,
        expiration: null,
        servicio: null,
        prestaciones: null
    };

    export const userSlice = createSlice({
            name:"user",
            initialState,
            reducers: {
                loginUser: (state, action) =>{
                    const {userId, token, expiration, servicio, prestaciones} = action.payload;                    
                    state.userId = userId;
                    state.token = token;
                    state.expiration = expiration;
                    state.servicio = servicio;
                    state.prestaciones = prestaciones;                    
                } ,
                logoutUser: (state, action)=>{                    
                    state.userId = null;
                    state.token = null;
                    state.expiration = null;
                    state.servicio = null;
                    state.prestaciones = null;           
                    
                }
            }   
        }
    )
    export const {loginUser, logoutUser }= userSlice.actions;
    export default  userSlice.reducer;
