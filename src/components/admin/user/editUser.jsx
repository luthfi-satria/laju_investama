import { Helmet, HelmetProvider } from "react-helmet-async";
import RouteURL from "../../../constants/routesConstant";
import { useOutletContext, useParams } from 'react-router-dom';
import * as CryptoJS from 'crypto-js';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ShowSweetAlert from "../../../helpers/showAlert";
import EditUserFormComponent from "./fragment/editUserFormComponent";
import LoginAccountFORM from "./fragment/loginAccountForm";

export default function AdminEditUser(){
    const hashKey = import.meta.env.VITE_HASH_KEY;
    const token = useOutletContext();
    const {id} = useParams();

    const decryptId = () => {
        const decrypt = CryptoJS.DES.decrypt(decodeURIComponent(id), hashKey);
        const realId = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
        return realId;
    }

    const [userId, setUserId] = useState(()=>decryptId());
    const [account, setAccount] = useState(false);

    const axiosHandler = useCallback((method, data = {}, path='', custHeaders = null) => {
        let headers = {
            Authorization: 'Bearer '+token
        };
        if(custHeaders){
            headers = {...headers, custHeaders};
        }
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+'/api'+path,
            headers: headers,
            data: data
        });
    },[token]);
    
    useEffect(()=>{
        if(!account){
            axiosHandler('get',{}, '/user/profile/'+userId)
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw(data);
                }
                setAccount(data?.data);
            }).catch((err)=>{
                let errTxt = err.message;
                if(err.code == 'ERR_NETWORK'){
                    errTxt = err.message;
                }
                else{
                    const joinErr = {};
                    const errMsg = err.response?.data?.message ? err.response.data.message : err.message;
                    if(errMsg){
                        for(const e of errMsg){
                            joinErr[e.property] = e.constraints ? e.constraints.join(', ') : (e.constraint ? e.constraint.join(', '): '');
                        }
                        setErrArray(joinErr);
                    }
                }
                ShowSweetAlert({
                    icon: 'warning',
                    title: 'Request Error',
                    text: errTxt
                });
            })
        }
    },[account, axiosHandler, userId]);
    

    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.USERS.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-sm text-white font-semibold">EDIT USER</h3>
                    </div>
                </div>
                <div className="p-4 flex-auto bg-white rounded-md">
                    <div className="grid sm:grid-cols-2 gap-2">
                        {/* FORM */}
                        <div className="py-2">
                            <h3 
                                className='relative font-semibold uppercase bg-gradient-to-br px-4 py-2 bg-gray-200 border border-gray-400 cursor-pointer hover:bg-gray-300'
                            >
                                PROFIL USER
                            </h3>
                            <EditUserFormComponent 
                                account={account}
                                setAccount={setAccount}
                                axiosHandler={axiosHandler}
                            />
                        </div>

                        {/* LOGIN AKUN */}
                        <div className="py-2">
                            <h3 
                                className='relative font-semibold uppercase bg-gradient-to-br px-4 py-2 bg-gray-200 border border-gray-400 cursor-pointer hover:bg-gray-300'
                            >
                                LOGIN AKUN
                            </h3>
                            <LoginAccountFORM
                                account={account}
                                setAccount={setAccount}
                                axiosHandler={axiosHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}