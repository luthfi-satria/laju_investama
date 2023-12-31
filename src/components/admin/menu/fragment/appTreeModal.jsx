import { useState } from "react";
import AppTreeForm from "./appTreeForm";
import { useNavigate } from "react-router-dom";

export default function AppTreeModal({
    title = 'Modal Title',
    axiosRequest,
    errResponseHandler,
    assignData,
    setAssignData,
    showModal,
}){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errArray, setErrArray] = useState(false);

    const updateMenu = () => {
        const id = assignData?.id;
        delete assignData?.id;
        setIsLoading(true);
        setErrArray(false);
        axiosRequest('put','api/appmenu/'+id, {
            data: assignData
        }).catch(({response}) => {
            const responseErr = response?.data?.message;
            if(response?.data?.statusCode == 400){
                console.log(response);
                const error = {};
                for(const errItem of responseErr){
                    error[errItem.property] = errItem?.constraints[0];
                }
                if(error){
                    setErrArray({...errArray, ...error});
                }
            }
            else{
                errResponseHandler(response);
            }
        }).finally(() => {
            setTimeout(() => {
                setIsLoading(false);
                showModal();
                navigate(0);
            }, 1000);
        });
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
                                onClick={showModal}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                                </span>
                            </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto bg-white">
                            <AppTreeForm 
                                data={assignData} 
                                setData={setAssignData} 
                                errArray={errArray}
                            />                            
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b bg-white">
                            <button
                                className="text-red-500 rounded shadow hover:shadow-lg hover:bg-gray-200 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={showModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-teal-500 text-white active:bg-teal-600 hover:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={updateMenu}
                            >
                                {isLoading ? 'Updating...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}