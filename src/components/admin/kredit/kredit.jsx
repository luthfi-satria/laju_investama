import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ShowSweetAlert from "../../../helpers/showAlert";
import { Route, Routes } from "react-router-dom";
import KreditTableComponent from "./fragment/kreditTableComponent";
import KreditDetailComponent from './fragment/kreditDetailComponent';
import KreditFormComponent from "./fragment/kreditFormComponent";

export default function AdminTransaksi({
    token,
    RouteURL
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

    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.KREDIT.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-2xl text-white font-semibold py-2 border-b border-white">
                            {RouteURL.KREDIT.HELMET.title}
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
                                <Routes>
                                    <Route path='' element={
                                        <KreditTableComponent 
                                            token={token} 
                                            axiosRequest={axiosRequest}
                                            errorHandler={errorHandler}
                                            errResponseHandler={errResponseHandler}                        
                                        />
                                    }/>
                                    <Route path="baru" element={
                                        <KreditFormComponent
                                            axiosRequest={axiosRequest}
                                            errorHandler={errorHandler}
                                            errResponseHandler={errResponseHandler}
                                        />
                                    }/>
                                    <Route path="detail/*" element={
                                        <KreditDetailComponent
                                            axiosRequest={axiosRequest}
                                            errorHandler={errorHandler}
                                            errResponseHandler={errResponseHandler}
                                        />
                                    }/>
                                    <Route path="edit/*" element={
                                        <KreditFormComponent
                                            axiosRequest={axiosRequest}
                                            errorHandler={errorHandler}
                                            errResponseHandler={errResponseHandler}
                                        />
                                    }/>
                                </Routes>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}