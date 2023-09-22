import { useState } from "react";
import AppTreeForm from "./appTreeForm";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function AppTreeModal({
    title = 'Modal Title',
    assignData,
    handleClick,
    token,
}){
    const MySwal = withReactContent(Swal);

    const [initForm, setInitForm] = useState(assignData);
    const [submmited, setSubmitted] = useState(false);
    const [successRes, setSuccessRes] = useState(false);
    const [errArray, setErrArray] = useState(false);

    const [conf, setConf] = useState({
        method: 'put',
        url: import.meta.env.VITE_APIURL+'/api/appmenu/'+assignData.id,
        headers: {
            Authorization: 'Bearer '+token
        },
    });

    const handleSubmit = () => {
        setSubmitted(true);
        const SubmitForm = {
            label: initForm.label,
            api_url: initForm.api_url,
            sequence: String(initForm.sequence),
            is_active: initForm.is_active,
            level: initForm.level,
        }
        setConf({...conf, ['data']: SubmitForm});
    }

    const handleChange = (e) => {
        let inputVal = (['true','false'].includes(e.target.value)) ? Boolean(e.target.value) : e.target.value; 
        setInitForm({...initForm, [e.target.name]: inputVal})
    }

    const showAlert = (prop) => {
        let swalProp = {
            showCloseButton: true,
            customClass:{
                actions: 'text-center',
                icon: 'text-xs'
            }
        }

        if(Object.keys(prop).length > 0){
            swalProp = {...swalProp, ...prop}
        }

        MySwal.fire(swalProp);
    }

    if(submmited){
        try{
            axios(conf)
            .then(({data}) => {
                setSuccessRes(data.message);
            })
            .catch((err) => {
                console.log(err);
                const errMsg = err.response.data.message;
                const joinErr = {};
                for(const e of errMsg){
                    joinErr[e.property] = e.constraints.join(', ');
                }
                setErrArray(joinErr);
                showAlert({
                    icon: 'warning',
                    title: 'Wrong request',
                    text: 'input form tidak valid'
                })
            }).finally(() => {
                setSubmitted(false);
            })
        }catch(error){
            if(error.response){
                showAlert({
                    icon: 'info',
                    text: error.response.data.message[0].constraint[0]
                });
            }
            else if(error.request){
                showAlert({
                    icon: 'error',
                    text: 'Server saat ini tidak dapat digunakan'
                });
            }
            setSubmitted(false)
        }        
    }

    return(
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full my-6 mx-auto max-w-lg">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none px-5 py-5 mt-4">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t bg-white">
                            <h3 className="text-3xl font-semibold">
                                {title}
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={handleClick}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                                </span>
                            </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto bg-white">
                            {successRes && 
                                <div
                                    className="absolute right-12 whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none"
                                >{successRes}</div>
                            }
                            <AppTreeForm data={initForm} handleChange={handleChange} errArray={errArray}/>                            
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b bg-white">
                            <button
                                className="text-red-500 rounded shadow hover:shadow-lg hover:bg-gray-200 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={handleClick}
                            >
                                Close
                            </button>
                            <button
                                className="bg-teal-500 text-white active:bg-teal-600 hover:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}