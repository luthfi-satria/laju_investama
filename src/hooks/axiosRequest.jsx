import axios from "axios";
import { useState } from "react";

const error = {
    error: false,
    icon: 'info',
    message: '',
}


export const AxiosRequest = (config) => {
    const [errorResp, setErrResp] = useState(error);
    const [reqResp, setReqResp] = useState(() => {
        try{
            axios(config)
            .then(({data}) => {
                setReqResp(data);
            })
            .catch((err) =>{
                setErrResp({...errorResp, ['error']: true, ['message']: err.message});
            })
            .finally(()=>{
                setTimeout(()=>setErrResp({...errorResp, ['error']: false, ['message'] : ''}), 10000);
            })
        }catch(error){
            if(error.response){
                setErrResp({...errorResp, ['error']: true, ['message']: error.response.data.message[0].constraint[0]});
            }
            else if(error.request){
                setErrResp({...errorResp, ['error']: true, ['icon']: 'warning', ['message'] : error.request});
            }
        }
    });
    return [reqResp, errorResp];
}

