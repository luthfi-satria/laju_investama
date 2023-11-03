import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import fileDownload from "js-file-download";
import { useCallback, useState } from "react";
import ShowSweetAlert from "../../../../helpers/showAlert";
import InvestorTableComponent from "./investorTableComponent";
import InvestorModalComponent from "./investorModalComponent";

export default function InvestorComponent({
    token
}){
    const [successRes, setSuccessRes] = useState(false);
    const [apiError, setApiError] = useState({
        error: false,
        message: '',
    });
    const [errArray, setErrArray] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Tambah Investor');
    const [isSubmitted, setSubmmited] = useState(false);
    const [formMethod, setFormMethod] = useState('insert');
    
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10
    });

    const initialData = {
        user_id: '',
        nama: '',
        no_investasi: '',
        nilai: 0,
        jangka_waktu: 0,
        no_rekening: '',
        bank: '',
        is_verified: false,
    };

    const [assignData, setAssignData] = useState(initialData);

    const axiosRequest = useCallback((method, path, param={}, data={})=>{
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+'/'+path,
            headers: {
                Authorization: 'Bearer '+token
            },
            param: param,
            data: data,
        });
    }, [token]);

    const errorHandler = useCallback((msg)=>{
        setApiError({...apiError, error:true, message: msg});
    },[apiError]);

    const addNewFunc = (title) => {
        setAssignData(initialData);
        setShowModal(true);
        setModalTitle(title);
        setFormMethod('insert');
        setSuccessRes(false);
        setErrArray(false);
    }

    const editFunc = (data) => {
        setAssignData({...assignData, 
            user_id: data?.user_id,
            nama: data?.profile?.name,
            bank: data?.bank,
            is_verified: (data?.verify_at) ? true :false,
            jangka_waktu: data?.jangka_waktu,
            no_investasi: data?.no_investasi,
            nilai: data?.nilai,
            no_rekening: data?.no_rekening,
        });
        setShowModal(true);
        setModalTitle('Edit Investor');
        setFormMethod('update');
        setSuccessRes(false);
        setErrArray(false);

    }

    const responseHandler = (data) => {
        if(data.statusCode == 400){
            throw(data);
        }
        setSuccessRes(data.message);
        setShowModal(false);
    }

    const errResponseHandler = (err) => {
        console.log(err);
        let errTxt = 'Input form tidak valid';
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
    }

    const insertInvestor = () => {
        const insertData = {...initialData, ...assignData};
        delete insertData.nama;
        axiosRequest('post', 'api/investor', {}, insertData)
        .then(({data}) => {
            console.log(data);
            if(data.statusCode == 406){
                ShowSweetAlert({
                    title: 'Info',
                    text: data?.error,
                });
            }
            responseHandler(data);
        })
        .catch((err)=>errResponseHandler(err))
        .finally(()=>{
            setTimeout(() => {
                setSubmmited(false);
            }, 1000);
        });
    }

    const updateInvestor = () => {
        const insertData = {...initialData, ...assignData};
        delete insertData.nama;
        delete insertData.user_id;
        axiosRequest('put', 'api/investor/'+assignData.user_id, {}, insertData)
        .then(({data}) => responseHandler(data))
        .catch((err)=>errResponseHandler(err))
        .finally(()=>{
            setTimeout(() => {
                setSubmmited(false);
            }, 1000);
        });
    }

    const reactivation = (data) => {
        setAssignData({...assignData, 
            user_id: data?.user_id,
            nama: data?.profile?.name,
            bank: data?.bank,
            is_verified: (data?.verify_at) ? true :false,
            jangka_waktu: data?.jangka_waktu,
            nilai: data?.nilai,
            no_rekening: data?.no_rekening,
        });
        setFormMethod('patch');
        setSuccessRes(false);
        setErrArray(false);

        ShowSweetAlert({
            title: 'Konfirmasi reaktivasi investor '+assignData.nama,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Reaktivasi',
        }, true)
        .then(({isConfirmed}) => {
            if(isConfirmed){
                axiosRequest('patch', 'api/investor/'+data.user_id, {}, {})
                .then(({data}) => responseHandler(data))
                .catch((err)=>errResponseHandler(err))
                .finally(()=>{
                    setTimeout(() => {
                        setSubmmited(false);
                    }, 1000);
                });
            }
        });
    }

    const restoration = (data) => {
        setAssignData({...assignData, 
            user_id: data?.user_id,
            nama: data?.profile?.name,
            bank: data?.bank,
            is_verified: (data?.verify_at) ? true :false,
            jangka_waktu: data?.jangka_waktu,
            nilai: data?.nilai,
            no_rekening: data?.no_rekening,
        });
        setFormMethod('patch');
        setSuccessRes(false);
        setErrArray(false);

        ShowSweetAlert({
            title: 'Konfirmasi pengembalian data investor '+assignData.nama,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Restore',
        }, true)
        .then(({isConfirmed}) => {
            if(isConfirmed){
                axiosRequest('patch', 'api/investor/restore/'+data.user_id, {}, {})
                .then(({data}) => responseHandler(data))
                .catch((err)=>errResponseHandler(err))
                .finally(()=>{
                    setTimeout(() => {
                        setSubmmited(false);
                    }, 1000);
                });
            }
        });
    }

    const deleteInvestor = (data) => {
        setAssignData({...assignData, 
            user_id: data?.user_id,
            nama: data?.profile?.name,
            bank: data?.bank,
            is_verified: (data?.verify_at) ? true :false,
            jangka_waktu: data?.jangka_waktu,
            nilai: data?.nilai,
            no_rekening: data?.no_rekening,
        });
        setFormMethod('delete');
        setSuccessRes(false);
        setErrArray(false);

        ShowSweetAlert({
            title: 'Konfirmasi penghapusan data investor '+assignData.nama,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Hapus',
        }, true)
        .then(({isConfirmed}) => {
            if(isConfirmed){
                axiosRequest('delete', 'api/investor/'+data.user_id, {}, {})
                .then(({data}) => responseHandler(data))
                .catch((err)=>errResponseHandler(err))
                .finally(()=>{
                    setTimeout(() => {
                        setSubmmited(false);
                    }, 1000);
                });
            }
        });
    }

    const printReport = () => {
        axios({
            method: 'get',
            url: import.meta.env.VITE_APIURL+'/api/investor/print/report',
            headers: {
                Authorization: 'Bearer '+token
            },
            responseType: 'blob',
            params: filter || {}
        })
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, 'data_investor','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formMethod == 'insert'){
            return insertInvestor();
        }
        if(formMethod == 'update'){
            return updateInvestor();
        }
    }
    return (
        <>
            {apiError.error && (
                <div className="absolute right-0 px-4 py-4 top-20 bg-red-500 text-white">
                    {JSON.stringify(apiError.message)}
                </div>
            )}
            <div className="grid-1 text-sm">
                <div className="text-right mb-4 py-4">
                    <button 
                        className="mr-2 border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>addNewFunc('Tambah Investor')}
                    >
                        <FontAwesomeIcon icon={'plus'} className="mr-2"/>
                        tambah
                    </button>
                    <button 
                        className="border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>printReport()}
                    >
                        <FontAwesomeIcon icon={'print'} className="mr-2"/>
                        Print
                    </button>
                </div>
                <InvestorTableComponent 
                    token={token} 
                    apiErrorHandling={errorHandler}
                    editTable={(data) => editFunc(data)}
                    deleteTable={(data) => deleteInvestor(data)}
                    reactivation={(data) => reactivation(data)}
                    restoration={(data) => restoration(data)}
                    successRes={successRes}
                    setSuccessRes={setSuccessRes}
                    filter={filter}
                    setFilter={setFilter}
                />

                {showModal && (
                    <InvestorModalComponent
                        title={modalTitle}
                        assignData={assignData}
                        setData={setAssignData}
                        errArray={errArray}
                        handleClick={() => setShowModal(false)}
                        handleSubmit={(e) => handleSubmit(e)}
                        isSubmitted={isSubmitted}
                        successRes={successRes}
                        axiosRequest={axiosRequest}
                    />
                )}
            </div>
        </>
    );
}