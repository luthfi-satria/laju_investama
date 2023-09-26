import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import fileDownload from "js-file-download";
import { useCallback, useState } from "react";
import ShowSweetAlert from "../../../../helpers/showAlert";
import CategoryTableComponent from "./categoryTableComponent";
import CategoryModalComponent from './categoryModalComponent';

export default function CategoryComponent({
    token
}){
    const [successRes, setSuccessRes] = useState(false);
    const [apiError, setApiError] = useState({
        error: false,
        message: '',
    });
    const [errArray, setErrArray] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Tambah Category');
    const [isSubmitted, setSubmmited] = useState(false);
    const [formMethod, setFormMethod] = useState('insert');
    
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        includeDeleted: 'true',
    });

    const initialData = {
        name: '',
        description: '',
        sequence: '',
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
            id: data?.id,
            name: data?.name,
            description: data?.description,
            sequence: data?.sequence,
        });
        setShowModal(true);
        setModalTitle('Edit Category');
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

    const insertCategory = () => {
        const insertData = {...initialData, ...assignData};
        delete insertData.nama;
        axiosRequest('post', 'api/category', {}, insertData)
        .then(({data}) => responseHandler(data))
        .catch((err)=>errResponseHandler(err))
        .finally(()=>{
            setTimeout(() => {
                setSubmmited(false);
            }, 1000);
        });
    }

    const updateCategory = () => {
        const insertData = {...initialData, ...assignData};
        delete insertData.id;
        axiosRequest('put', 'api/category/'+assignData.id, {}, insertData)
        .then(({data}) => responseHandler(data))
        .catch((err)=>errResponseHandler(err))
        .finally(()=>{
            setTimeout(() => {
                setSubmmited(false);
            }, 1000);
        });
    }

    const restoration = (data) => {
        setAssignData({...assignData, 
            id: data?.id,
            name: data?.name,
            description: data?.description,
            sequence: data?.sequence,
        });
        setFormMethod('patch');
        setSuccessRes(false);
        setErrArray(false);

        ShowSweetAlert({
            title: 'Konfirmasi pengembalian data kategori '+data.name,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Restore',
        }, true)
        .then(({isConfirmed}) => {
            if(isConfirmed){
                axiosRequest('patch', 'api/category/restore/'+data.id, {}, {})
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

    const deleteCategory = (data) => {
        setAssignData({...assignData, 
            name: data?.name,
            description: data?.description,
            sequence: data?.sequence,
        });
        setFormMethod('delete');
        setSuccessRes(false);
        setErrArray(false);

        ShowSweetAlert({
            title: 'Konfirmasi penghapusan data kategori '+assignData.name,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Hapus',
        }, true)
        .then(({isConfirmed}) => {
            if(isConfirmed){
                axiosRequest('delete', 'api/category/'+data.id, {}, {})
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
            url: import.meta.env.VITE_APIURL+'/api/category/print/report',
            headers: {
                Authorization: 'Bearer '+token
            },
            responseType: 'blob',
            params: filter || {}
        })
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, 'data_kategori','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formMethod == 'insert'){
            return insertCategory();
        }
        if(formMethod == 'update'){
            return updateCategory();
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
                <div className="text-right mb-4 mr-4">
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
                <CategoryTableComponent 
                    token={token} 
                    apiErrorHandling={errorHandler}
                    editTable={(data) => editFunc(data)}
                    deleteTable={(data) => deleteCategory(data)}
                    restoration={(data) => restoration(data)}
                    successRes={successRes}
                    setSuccessRes={setSuccessRes}
                    filter={filter}
                    setFilter={setFilter}
                />

                {showModal && (
                    <CategoryModalComponent
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