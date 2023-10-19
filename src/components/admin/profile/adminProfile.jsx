import { useCallback, useEffect, useState } from 'react';
import DataRekomendasi from './fragment/data_rekomendasi';
import DataPekerjaan from './fragment/data_pekerjaan';
import DataProfile from './fragment/data_profile';
import axios from 'axios';
import ShowSweetAlert from "../../../helpers/showAlert";

export default function AdminProfile({token}){
    const [panel, setPanel] = useState({
        show: true,
        context: 'data-pribadi'
    });
    const [updateStatus, setUpdateStatus] = useState(false);

    useEffect(()=>{
        if(updateStatus){
            setTimeout(()=>{
                setUpdateStatus(false);
            },5000);
        }
    },[updateStatus])

    const axiosHandler = useCallback((method, data = {}, path='/profile', custHeaders = null) => {
        let headers = {
            Authorization: 'Bearer '+token
        };
        if(custHeaders){
            headers = {...headers, custHeaders};
        }
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+'/api/user'+path,
            headers: headers,
            data: data
        });
    },[token]);    
    return(
        <>
            <section className="relative block h-[300px]">
                <div className="absolute top-0 w-full h-full bg-center bg-cover">
                    <span id="blackOverlay" className="w-full h-full absolute opacity-50"></span>
                </div>
            </section>
            <section className="relative py-16">
                <div className="mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                        <div className="px-12">
                            <DataProfile 
                             token={token}
                             panel={panel}
                             setPanel={setPanel}
                             axiosHandler={(method, data, path)=>axiosHandler(method, data, path)}
                             swal={ShowSweetAlert}
                             updateStatus={updateStatus}
                             setUpdateStatus={(e) => setUpdateStatus(e)}
                            /> 

                            <div className="py-2 border-blueGray-200">
                                <DataRekomendasi
                                    token={token}
                                    panel={panel}
                                    setPanel={setPanel}
                                    axiosHandler={(method, data, path)=>axiosHandler(method, data, path)}
                                    swal={ShowSweetAlert}
                                    updateStatus={updateStatus}
                                    setUpdateStatus={(e) => setUpdateStatus(e)}       
                                    />
                            </div>

                            <div className="mt-2 pb-2 border-blueGray-200">
                                <DataPekerjaan
                                    token={token}
                                    panel={panel}
                                    setPanel={setPanel}
                                    axiosHandler={(method, data, path)=>axiosHandler(method, data, path)}
                                    swal={ShowSweetAlert}
                                    updateStatus={updateStatus}
                                    setUpdateStatus={(e) => setUpdateStatus(e)}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}