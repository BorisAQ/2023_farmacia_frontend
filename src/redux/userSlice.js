    import { createSlice } from "@reduxjs/toolkit";
    const initialState = {
        name:"",
        userName:"",
        email:""
    };

    export const userSlice = createSlice({
            name:"user",
            initialState,
            reducers: {
                addUser: (state, action) =>{
                    const {name, userName, email} = action.payload;
                    state.name = name;
                    state.userName = userName;
                    state.email = email;
                } ,
                changeEmail: (state, action)=>{
                    const email = action.payload;
                    state.email = email;
                    
                }
            }   
        }
    )
    export const {addUser, changeEmail }= userSlice.actions;
    export default  userSlice.reducer;
