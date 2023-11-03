import { useCallback, useState } from "react";
import axios from "axios";
import ShowSweetAlert from "../../../../helpers/showAlert";
import UserTableComponent from "./userTableComponent";
import UserModalComponent from './userModalComponent';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fileDownload from "js-file-download";

export default function UserComponent({token, usergroup}){
    const [successRes, setSuccessRes] = useState(false);
    const [apiError, setApiError] = useState({
        error: false,
        message: '',
    });
    const [errArray, setErrArray] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Tambah User');
    const [isSubmitted, setSubmmited] = useState(false);
    const [formMethod, setFormMethod] = useState({
        method: 'post',
        path: ''
    });

    const [filter, setFilter] = useState({
        page: 1,
        limit: 10
    });

    const [assignData, setAssignData] = useState({
        email: '',
        username: '',
        phone: '',
        password: '',
        usergroup_id: '1',
    });

    const addNewFunc = (title) => {
        setSuccessRes(false);
        setErrArray(false);
        setAssignData({
            email: '',
            username: '',
            phone: '',
            password: '',
            usergroup_id: '1',
        });
        setShowModal(true);
        setFormMethod({
            method: 'post',
            path: '/register'
        });
        setModalTitle(title);
    }

    const deleteFunc = (data) => {
        setSuccessRes(false);
        setFormMethod({...formMethod, method: 'delete', path: '/'+data.id});
        setSubmmited(true);
    }

    const axiosSubmit = useCallback(() => {
        axios({
            method: formMethod.method,
            url: import.meta.env.VITE_APIURL+'/api/user'+formMethod.path,
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
        }).finally(() => {
            setTimeout(() => {
                setSubmmited(false);
                setSuccessRes(false);
            }, 1000);
            // setShowModal(false);
        });
    },[formMethod, token, assignData]);

    const errorHandler = useCallback((msg)=>{
        setApiError({...apiError, error:true, message: msg});
    },[apiError]);

    const printReport = () => {
        axios({
            method: 'get',
            url: import.meta.env.VITE_APIURL+'/api/user/report',
            headers: {
                Authorization: 'Bearer '+token
            },
            responseType: 'blob',
            params: filter || {}
        })
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, 'data_user','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }

    return(
        <>
            {apiError.error && (
                <div className="absolute right-0 px-4 py-4 top-20 bg-red-500 text-white">
                    {JSON.stringify(apiError.message)}
                </div>
            )}
            <div className="grid-1 text-sm">
                <div className="text-right mb-4">
                    <button 
                        className="mr-2 border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>addNewFunc('Tambah User')}
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
                <UserTableComponent 
                    token={token} 
                    apiErrorHandling={errorHandler}
                    deleteTable={(data) => deleteFunc(data)} 
                    successRes={successRes}
                    setSuccessRes={setSuccessRes}
                    filter={filter}
                    setFilter={setFilter}
                />

                {showModal && (
                    <UserModalComponent
                        title={modalTitle}
                        usergroupField={usergroup}
                        assignData={assignData}
                        setData={setAssignData}
                        errArray={errArray}
                        handleClick={() => setShowModal(false)}
                        handleSubmit={axiosSubmit}
                        isSubmitted={isSubmitted}
                        successRes={successRes}
                    />
                )}
            </div>
        </>
    )
}