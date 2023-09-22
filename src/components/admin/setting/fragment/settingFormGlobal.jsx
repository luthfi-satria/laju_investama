import { useState } from "react";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function SettingFormGlobal({token, formData}){
    const MySwal = withReactContent(Swal);
    const [submitted, setSubmitted] = useState(false);
    const [successRes, setSuccessRes] = useState('');
    const [initForm, setInitForm] = useState({
        name: formData.name,
        desc: formData.desc,
        scope: formData.scope,
        is_active: formData.is_active,
        value: {
            maintenance: formData.value.maintenance
        }
    });
    
    const [conf, setConf] = useState({
        method: 'put',
        url: import.meta.env.VITE_APIURL+'/api/configurations/'+formData.id,
        headers: {
            Authorization: 'Bearer '+token
        },
    });

    const handleChange = (e) => {
        const maintenance = {
            maintenance: (e.target.value)
        }
        setInitForm({...initForm, ['value']: maintenance});
        console.log('CHANGE',maintenance);
    }

    const handleClick = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setConf({...conf, ['data']: initForm})
    }
    
    if(submitted){
        try{
            axios(conf)
            .then(({data}) => {
                setSuccessRes(data.message);
            })
            .catch((err) => {
                showAlert({
                    icon: 'warning',
                    title: 'Wrong request',
                    text: err.response.data.message
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

    const showAlert = (prop) => {
        let swalProp = {
            showCloseButton: true,
            customClass:{
                actions: 'text-center',
                icon: 'text-xs'
            }
        }

        if(Object.keys(prop).length > 0){
            console.log(prop);
            swalProp = {...swalProp, ...prop}
        }

        MySwal.fire(swalProp);
    }

    return(
        <>
            <form encType="multipart/formData" method="post">
                {successRes && 
                    <div
                        className="absolute right-12 whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none"
                    >{successRes}</div>
                }
                <p className="mb-4 text-xs dark:text-neutral-200">
                    {formData.desc}
                </p>
                <div className="mb-3 w-full">
                    <label
                        className="mb-2 inline-block dark:text-neutral-200"
                    >
                        Set application to maintenance mode
                    </label>
                </div>
                <div className="mb-3 w-full">
                    <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-white checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-white checked:after:bg-white checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-white checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-white dark:checked:after:border-white dark:checked:after:bg-white dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-white dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                            type="radio"
                            name="maintenance"
                            id="radioDefault01"
                            value='true'
                            onChange={handleChange}
                            defaultChecked={initForm.value.maintenance === 'true'}
                        />
                        <label
                            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                            htmlFor="radioDefault01"
                        >
                        Yes
                        </label>
                    </div>
                    <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-white checked:after:bg-white checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-white dark:checked:after:border-white dark:checked:after:bg-white dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-white dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                            type="radio"
                            name="maintenance"
                            id="radioDefault02"
                            value='false'
                            onChange={handleChange}
                            defaultChecked={initForm.value.maintenance === 'false'}
                        />
                        <label
                            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                            htmlFor="radioDefault02"
                        >
                        No
                        </label>
                    </div>
                </div>
                <div className="mb-3 w-full text-right mr-5">
                    <button
                        type="button"
                        className="inline-block rounded border-2 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-teal-900 focus:bg-white-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-white-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        onClick={handleClick}>
                        {submitted ? 'Saving...': 'Save'}
                    </button>
                </div>
            </form>
        </>
    )
}