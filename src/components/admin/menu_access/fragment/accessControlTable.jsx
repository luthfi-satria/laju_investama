import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import AccessControlFilter from './accessControlFilter';
import ButtonAction from "../../../buttonAction";
import Pagination from "../../../pagination";
import AccessControlModal from "./accessModal";

export default function AccessControlTable({
    axiosRequest,
    errorHandler,
}){
    const [isLoading, setIsLoading] = useState(false);
    const [triggerFind, setTriggerFind] = useState(true);
    const [data, setData] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [successRes, setSuccessRes] = useState(false);

    const defaultFilter = useCallback(() => ({
        page: 1,
        limit: 10,
        usergroup: '',
        menu: '',
        group_level: '',
    }),[]);
    const [filter, setFilter] = useState(defaultFilter);
    
    useEffect(()=>{
        if((triggerFind && filter)){
            setIsLoading(true);
            try{
                axiosRequest('get','api/access',{params: filter})
                .then(({data}) => {
                    setData(data?.data);
                })
                .catch((err) => {
                    setTriggerFind(false);
                    errorHandler(err.response.data.message);
                }).finally(() => {
                    setTimeout(()=>{
                        setIsLoading(false);
                        setTriggerFind(false);
                    }, 1000);
                });
            }
            catch(err){
                errorHandler(err.response.data.message[0].constraint[0]);
            }
        }
    },[filter, axiosRequest, errorHandler, triggerFind]);

    const defaultForm = useCallback(()=>({
        usergroup_id: '',
        menu_id: '',
        permissions: [],
    }),[]);

    const [assignData, setAssignData] = useState(defaultForm);

    useEffect(()=>{},[assignData]);

    const changeLimitOption = (e) => {
        const option = Number(e.target.value);
        setFilter({...filter, limit: option, page: 1});
        setTriggerFind(true);
    }

    const changePage = (e) => {
        setFilter({...filter, page: Number(e)});
        setTriggerFind(true);
    }    

    const AddAccess = () => {

    }

    const EditTable = () => {

    }

    return (
        <>
            <div>
                <div className="text-right mb-4 mt-3">
                    <button 
                        className="border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>setShowModal(true)}
                        >
                        <FontAwesomeIcon icon={'plus'} className="mr-2"/>
                        Pengaturan
                    </button>
                </div>

                {/* FILTER */}
                <AccessControlFilter 
                    filter={filter}
                    setFilter={setFilter}
                    triggerFind={setTriggerFind}
                    defaultFilter={defaultFilter}
                />
                {/* table */}
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                    <div className="block w-full overflow-x-auto">
                        <table id="tblOrder" className="table-striped items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Usergroup
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Level
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Menu
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Menu Label
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Izin Akses
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className={`px-4`} key={index}>
                                        <td className='px-4 py-2 min-w-[100px] uppercase'>{items?.usergroup?.name}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.usergroup?.level}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.menus?.name}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.menus?.label}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.permissions?.join(', ') || ''}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>
                                            <ButtonAction
                                                label='Edit'
                                                type='edit'
                                                handleClick={()=>EditTable(items)}
                                            />
                                        </td>
                                        
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className='px-4 py-4 text-center'>
                                            Data tidak ditemukan...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {isLoading && (
                            <div className='absolute z-10 flex items-center justify-center top-0 w-full bg-black opacity-70 h-full'>
                                <div className='relative bg-white px-4 py-4 border border-white rounded-lg text-center text text-black font-bold'>LOADING...</div>
                            </div>
                        )}
                    </div>
                    <Pagination
                    loading={isLoading}
                    page={filter.page}
                    limit={Number(filter.limit)}
                    setPage={changePage}
                    setPerPage={changeLimitOption}
                    maxData={data?.total || 0}
                    />
                </div>

                {showModal && (
                    <AccessControlModal
                        title={'Pengaturan hak akses'}
                        assignData={assignData}
                        setData={setAssignData}
                        handleClick={() => setShowModal(false)}
                        handleSubmit={AddAccess}
                        successRes={successRes}
                        axiosRequest={axiosRequest}
                    />
                )}   
            </div>         
        </>
    );
}