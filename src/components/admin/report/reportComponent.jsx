import { Helmet, HelmetProvider } from "react-helmet-async";
import ShowSweetAlert from "../../../helpers/showAlert";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ReportCard from "./fragment/reportCard";

export default function ReportComponent({
    token,
}){
    const [apiError, setApiError] = useState(false);

    useEffect(() => {},[apiError]);

    const axiosRequest = useCallback((method, path, config={}, headers={})=>{
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+'/'+path,
            headers: {
                Authorization: 'Bearer '+token,
                ...headers
            },
            ...config,
        });
    }, [token]);

    const errorHandler = useCallback((msg)=>{
        setApiError({...apiError, error:true, message: msg});
    },[apiError]);

    const errResponseHandler = useCallback((err) => {
        let errTxt = 'Input form tidak valid';
        if(err.code == 'ERR_NETWORK'){
            errTxt = err.message;
        }
        ShowSweetAlert({
            icon: 'warning',
            title: 'Request Error',
            text: errTxt
        });
    },[]);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Report</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-2xl text-white font-semibold py-2 border-b border-white">
                            Report
                        </h3>
                    </div>
                </div>
                <div className="flex-auto">
                    <ReportCard
                      token={token} 
                      axiosRequest={axiosRequest}
                      errorHandler={errorHandler}
                      errResponseHandler={errResponseHandler}  
                    />
                </div>
            </div>
        </>
    );
}