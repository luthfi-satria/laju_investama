import axios from "axios";
import { useState } from "react"

export const ValidateToken = (token) => {
    
    const [validToken, setValidToken] = useState(()=>{
        const APIURL = import.meta.env.VITE_APIURL+'/auth/validate-token';
        axios.get(APIURL, {
          headers: {
            Authorization: 'Bearer '+token
          }
        })
        .then((response) => {
            if(response.data){
                setValidToken(true);
            }
        })
        .catch((error) => {
            if(error){
                setValidToken(false);
            }
        });        
    });

    return [validToken, setValidToken];
}
