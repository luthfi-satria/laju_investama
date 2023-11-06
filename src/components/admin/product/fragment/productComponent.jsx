import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import fileDownload from "js-file-download";
import { useCallback, useEffect, useState } from "react";
import ShowSweetAlert from "../../../../helpers/showAlert";
import ProductModalComponent from "./productModalComponent";
import ProductTableComponent from './productTableComponent';

export default function ProductComponent({
    token
}){
    const [successRes, setSuccessRes] = useState(false);
    const [apiError, setApiError] = useState({
        error: false,
        message: '',
    });
    const [errArray, setErrArray] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Tambah Produk');
    const [isSubmitted, setSubmmited] = useState(false);
    const [formMethod, setFormMethod] = useState('insert');
    const [category, setCategory] = useState(false);
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        includeDeleted: 'true',
    });

    const initialData = {
        kode_produk: '',
        name: '',
        category_id: null,
        description: '',
        harga_beli: 0,
        harga_jual: 0,
        status: 1,
        stok: 1,
        min_stok: 1,
    };

    const [assignData, setAssignData] = useState(initialData);

    const axiosRequest = useCallback((method, path, param={}, data={}, headers={})=>{
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+'/'+path,
            headers: {
                Authorization: 'Bearer '+token,
                ...headers
            },
            params: param,
            data: data,
        });
    }, [token]);

    const errorHandler = useCallback((msg)=>{
        setApiError({...apiError, error:true, message: msg});
    },[apiError]);

    useEffect(()=>{
        if(!category){
            axiosRequest('get','api/category', {page: 1, limit: 1000})
            .then(({data})=>{
                if(data.statusCode == 400){
                    throw(data);
                }
                setCategory(data?.data);
            });
        }
    }, [category, axiosRequest]);

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
            kode_produk: data?.kode_produk,
            category_id: data?.category_id,
            name: data?.name,
            description: data?.description,
            harga_beli: data?.harga_beli,
            harga_jual: data?.harga_jual,
            status: data?.status,
            stok: data?.stok,
            min_stok: data?.min_stok,
            image: data?.image,
        });
        setShowModal(true);
        setModalTitle('Edit Produk');
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

    const insertProduct = () => {
        const insertData = {...initialData, ...assignData};
        delete insertData.nama;
        axiosRequest('post', 'api/product', {}, insertData)
        .then(({data}) => responseHandler(data))
        .catch((err)=>errResponseHandler(err))
        .finally(()=>{
            setTimeout(() => {
                setSubmmited(false);
            }, 1000);
        });
    }

    const updateProduct = () => {
        const insertData = {...initialData, ...assignData};
        delete insertData.id;
        delete insertData.image;
        axiosRequest('put', 'api/product/'+assignData.id, {}, insertData)
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
            kode_produk: data?.kode_produk,
            category_id: data?.category_id,
            name: data?.name,
            description: data?.description,
            harga_beli: data?.harga_beli,
            harga_jual: data?.harga_jual,
            status: data?.status,
            stok: data?.stok,
            min_stok: data?.min_stok,
        });
        setFormMethod('patch');
        setSuccessRes(false);
        setErrArray(false);

        ShowSweetAlert({
            title: 'Konfirmasi pengembalian data produk '+data.name,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Restore',
        }, true)
        .then(({isConfirmed}) => {
            if(isConfirmed){
                axiosRequest('patch', 'api/product/restore/'+data.id, {}, {})
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

    const deleteProduct = (data) => {
        setAssignData({...assignData, 
            id: data?.id,
            kode_produk: data?.kode_produk,
            category_id: data?.category_id,
            name: data?.name,
            description: data?.description,
            harga_beli: data?.harga_beli,
            harga_jual: data?.harga_jual,
            status: data?.status,
            stok: data?.stok,
            min_stok: data?.min_stok,
        });
        setFormMethod('delete');
        setSuccessRes(false);
        setErrArray(false);

        ShowSweetAlert({
            title: 'Konfirmasi penghapusan data produk '+assignData.name,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Hapus',
        }, true)
        .then(({isConfirmed}) => {
            if(isConfirmed){
                axiosRequest('delete', 'api/product/'+data.id, {}, {})
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
            url: import.meta.env.VITE_APIURL+'/api/product/print/report',
            headers: {
                Authorization: 'Bearer '+token
            },
            responseType: 'blob',
            params: filter || {}
        })
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, 'data_product','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formMethod == 'insert'){
            return insertProduct();
        }
        if(formMethod == 'update'){
            return updateProduct();
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
                        onClick={()=>addNewFunc('Tambah Produk')}
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
                <ProductTableComponent 
                    token={token} 
                    apiErrorHandling={errorHandler}
                    editTable={(data) => editFunc(data)}
                    deleteTable={(data) => deleteProduct(data)}
                    restoration={(data) => restoration(data)}
                    successRes={successRes}
                    setSuccessRes={setSuccessRes}
                    filter={filter}
                    setFilter={setFilter}
                    category={category}
                    setCategory={setCategory}
                />

                {showModal && (
                    <ProductModalComponent
                        title={modalTitle}
                        assignData={assignData}
                        setData={setAssignData}
                        errArray={errArray}
                        handleClick={() => setShowModal(false)}
                        handleSubmit={(e) => handleSubmit(e)}
                        isSubmitted={isSubmitted}
                        successRes={successRes}
                        axiosRequest={axiosRequest}
                        category={category}
                        setCategory={setCategory}
                    />
                )}
            </div>
        </>
    );
}