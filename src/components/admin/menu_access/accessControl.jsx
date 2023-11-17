import { Helmet, HelmetProvider } from "react-helmet-async";
import ShowSweetAlert from "../../../helpers/showAlert";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AccessControlTable from "./fragment/accessControlTable";

export default function ReportComponent({
    token,
    RouteURL,
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
        setTimeout(() => {
            setApiError(false);
        }, 1000);
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
                    <title>{RouteURL.MENU_ACCESS.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-2xl text-white font-semibold py-2 border-b border-white">
                        {RouteURL.MENU_ACCESS.HELMET.title}
                        </h3>
                    </div>
                </div>
                <div className="flex-auto">
                    {apiError.error && (
                    <div className="absolute right-0 px-4 py-4 top-20 bg-red-500 text-white">
                        {JSON.stringify(apiError.message)}
                    </div>
                    )}
                    <div className="grid-1 text-sm">
                        <div className='overflow-auto'>
                            <div className="w-full mb-12">
                                <AccessControlTable 
                                    token={token} 
                                    axiosRequest={axiosRequest}
                                    errorHandler={errorHandler}
                                    errResponseHandler={errResponseHandler}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}