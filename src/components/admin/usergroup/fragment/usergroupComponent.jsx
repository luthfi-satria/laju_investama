import { useCallback, useEffect, useState } from "react";
import UsergroupTableComponent from "./usergroupTableComponent";
import UsergroupModal from "./usergroupModal";
import axios from "axios";
import ShowSweetAlert from "../../../../helpers/showAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UsergroupComponent({token}){
    const [successRes, setSuccessRes] = useState(false);
    const [apiError, setApiError] = useState({
        error: false,
        message: '',
    });
    const [errArray, setErrArray] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Add Usergroup');
    const [isSubmitted, setSubmmited] = useState(false);
    const [formMethod, setFormMethod] = useState({
        method: 'post',
        path: ''
    });
    const [assignData, setAssignData] = useState({
        name: '',
        level: 'owner',
        is_default: false,
    });    

    const addNewFunc = (title) => {
        setSuccessRes(false);
        setErrArray(false);
        setAssignData({
            name: '',
            level: 'owner',
            is_default: false,
        })
        setShowModal(true);
        setFormMethod({
            method: 'post',
            path: ''
        });
        setModalTitle(title);
    }

    const updateFunc = (data) => {
        setSuccessRes(false);
        setShowModal(true);
        setFormMethod({
            method: 'put',
            path: '/'+data.id,
        });
        const filtered = Object.keys(data)
            .filter((keyProp) => ['name','level','is_default'].includes(keyProp))
            .reduce((obj, key) => {
                obj[key] = data[key]
                return obj;
            },{});
        setAssignData(filtered);
    }

    const deleteFunc = (data) => {
        setSuccessRes(false);
        setFormMethod({...formMethod, method: 'delete', path: '/'+data.id});
        setSubmmited(true);
    }

    const axiosSubmit = useCallback(() => {
        axios({
            method: formMethod.method,
            url: import.meta.env.VITE_APIURL+'/api/usergroup'+formMethod.path,
            headers: {
                Authorization: 'Bearer '+token
            },
            data: assignData,
        })
        .then(({data}) => {
            if(data.statusCode == 400){
                throw(data);
            }
            setSuccessRes(data.message);
            setShowModal(false);
        })
        .catch((err) => {
            console.log('ERR', err);
            let errTxt = 'Input form tidak valid';
            if(err.code == 'ERR_NETWORK'){
                errTxt = err.message;
            }
            else if(err.code == 'ERR_BAD_REQUEST'){
                errTxt = err.message;
            }
            else{
                const joinErr = {};
                const errMsg = err.message;
                for(const e of errMsg){
                    joinErr[e.property] = e.constraint.join(', ');
                }
                setErrArray(joinErr);
            }
            ShowSweetAlert({
                icon: 'warning',
                title: 'Request Error',
                text: errTxt
            });
        }).finally(() => {
            setTimeout(() => {
                setSubmmited(false);
            }, 1000);
            // setShowModal(false);
        });
    },[formMethod, token, assignData]);

    useEffect(()=>{
        if(isSubmitted){
            axiosSubmit();
        }
    }, [isSubmitted, axiosSubmit]);


    return(
        <>
            {apiError.error && (
                <div className="absolute right-0 px-4 py-4 top-20 bg-red-500 text-white">
                    {JSON.stringify(apiError.message)}
                </div>
            )}
            <div className="grid-1 text-sm">
                <div className="text-right mb-4 mr-4">
                    <button 
                        className="border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>addNewFunc('Tambah Usergroup')}
                    >
                        <FontAwesomeIcon icon={'plus'} className="mr-2"/>
                        tambah
                    </button>
                </div>
                <UsergroupTableComponent 
                    token={token} 
                    apiErrorHandling={(msg)=>setApiError({...apiError, error:true, message:msg})}
                    editTable={(data) => updateFunc(data)}
                    deleteTable={(data) => deleteFunc(data)} 
                    successRes={successRes}
                    setSuccessRes={setSuccessRes}
                />

                {showModal && (
                    <UsergroupModal
                        title={modalTitle}
                        assignData={assignData}
                        setData={(e) => setAssignData({...assignData, [e.target.name]: e.target.value})}
                        errArray={errArray}
                        handleClick={() => setShowModal(false)}
                        handleSubmit={() => setSubmmited(true)}
                        isSubmitted={isSubmitted}
                        successRes={successRes}
                    />
                )}
            </div>
        </>
    )
}