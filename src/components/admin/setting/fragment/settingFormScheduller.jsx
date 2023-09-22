import React, { useState } from "react";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { TEInput } from "tw-elements-react";

export default function SettingFormScheduller({token, formData}){
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
                <div className="text-xs content-center text-center">Coming Soon</div>
                {/* {successRes && 
                    <div
                        className="absolute right-12 whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none"
                    >{successRes}</div>
                }
                <p className="mb-4 text-xs dark:text-neutral-200">
                    {formData.desc}
                </p>
                <div className="mb-3 w-full">
                    {formData.value && Object.keys(formData.value).map((item, key) => (
                        <div key={item} className="flex flex-col border border-white shadow-sm rounded-xl dark:shadow-slate-700/[.7] mb-2">
                            <div className="p-4 md:p-5">
                                <h3 className="text-lg font-bold text-white capitalize">
                                {item}
                                </h3>
                                {item == 'usergroup' && 
                                    <React.Fragment>
                                        <div className="mb-4 block min-h-[1.5rem] pl-[1.5rem]">
                                                <input
                                                    className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-white outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-white checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-white dark:checked:border-white dark:checked:bg-white dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                    type="checkbox"
                                                    name="process_active"
                                                    id="cx-process-active"
                                                    value='true'
                                                    onChange={handleChange}
                                                />
                                                <label
                                                    className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                                                    htmlFor="cx-process-active"
                                                >
                                                Set scheduller active for {item} data
                                                </label>
                                        </div>
                                        <div className="mb-[0.125rem] block min-h-[1.5rem]">
                                            <label htmlFor={item+'timespan'}>Set Timespan (second)</label>
                                            <TEInput 
                                                type="number" 
                                                id={item+'timespan'} 
                                                className="border-white"
                                            />
                                        </div>
                                    </React.Fragment>
                                }
                                {item == 'menu' &&
                                    <div>form for menu</div>
                                }
                            </div>
                        </div>                    
                    ))}
                </div> */}
                
            </form>
        </>
    )
}