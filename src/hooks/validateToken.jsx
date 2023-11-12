import axios from "axios";
import { useCallback, useEffect, useState } from "react"

export const ValidateToken = (token) => {
    
    const [validToken, setValidToken] = useState(false);
    const [ServErr, setServErr] = useState(false);

    const requestValidToken = useCallback(() => {
        const APIURL = import.meta.env.VITE_APIURL+'/api/auth/validate-token';
        return axios.get(APIURL, {
          headers: {
            Authorization: 'Bearer '+token
          }
        });
    },[token]);

    useEffect(()=>{
        if(token && !ServErr){
            requestValidToken()
            .then(({data}) => {
                if(data?.data){
                    setValidToken(data?.data?.payload);
                }
            })
            .catch((error) => {
                setValidToken(false);
                setServErr(true);
                throw error;
            });
        }
    },[token, requestValidToken, ServErr]);

    return [validToken, setValidToken];
}
