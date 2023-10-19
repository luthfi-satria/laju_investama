import { useCallback, useEffect, useState } from 'react';
import ShowSweetAlert from "../../../helpers/showAlert";
import { useOutletContext } from 'react-router-dom';
import DataProfile from '../../admin/profile/fragment/data_profile';
import DataRekomendasi from '../../admin/profile/fragment/data_rekomendasi';
import DataPekerjaan from '../../admin/profile/fragment/data_pekerjaan';

export default function PengaturanProfile(){
    const {token, AxiosRequest} = useOutletContext();
    
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
    },[updateStatus]);

    const handleRequest = useCallback((method, path='', data={}) => {
        const url = path == '' ? '/profile' : path;
        return AxiosRequest(method, 'api/user'+url, {}, data);
    },[AxiosRequest]);

    return(
        <>
            <div className='flex items-center justify-center'>
                <div className='w-full md:w-3/4'>
                    <section className="relative block h-[300px] mt-52 md:mt-32">
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
                                    axiosHandler={(method, data, path)=>handleRequest(method, path, data)}
                                    swal={ShowSweetAlert}
                                    updateStatus={updateStatus}
                                    setUpdateStatus={(e) => setUpdateStatus(e)}
                                    /> 

                                    <div className="py-2 border-blueGray-200">
                                        <DataRekomendasi
                                            token={token}
                                            panel={panel}
                                            setPanel={setPanel}
                                            axiosHandler={(method, data, path)=>handleRequest(method, path, data)}
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
                                            axiosHandler={(method, data, path)=>handleRequest(method, path, data)}
                                            swal={ShowSweetAlert}
                                            updateStatus={updateStatus}
                                            setUpdateStatus={(e) => setUpdateStatus(e)}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}