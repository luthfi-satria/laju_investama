import { useCallback, useEffect, useState } from 'react';
import Pagination from '../../../pagination';
import axios from 'axios';
import ButtonAction from '../../../buttonAction';
import CategoryFilterComponent from './categoryFilterComponent';

export default function CategoryTableComponent({
    token,
    apiErrorHandling,
    deleteTable,
    editTable,
    restoration,
    successRes=false,
    setSuccessRes,
    filter,
    setFilter
}){
    const [isLoading, setIsLoading] = useState(false);
    const [triggerFind, setTriggerFind] = useState(true);
    const [data, setData] = useState(false);

    const AxiosHttp = useCallback((method, urlPath, params=null)=>{
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+urlPath,
            headers: {
                Authorization: 'Bearer '+token
            },
            params: (params) || filter
        });
    },[filter, token]);
    
    useEffect(()=>{
        if((triggerFind && filter) || successRes){
            setIsLoading(true);
            try{
                AxiosHttp('get','/api/category')
                .then(({data}) => {
                    setData(data.data);
                })
                .catch((err) => {
                    // console.log('CATCH ERROR',err);
                    apiErrorHandling(err.response.data.message);
                }).finally(() => {
                    setTimeout(()=>{
                        setIsLoading(false);
                        setTriggerFind(false);
                        setSuccessRes(false);
                    }, 1000);
                });
            }
            catch(err){
                // console.log('ERR', err);
                apiErrorHandling(err.response.data.message[0].constraint[0]);
            }
        }
    },[filter, successRes, AxiosHttp, apiErrorHandling, triggerFind, setSuccessRes]);

    const changeLimitOption = (e) => {
        const option = Number(e.target.value);
        setFilter({...filter, limit: option, page: 1});
        setTriggerFind(true);
    }

    const changePage = (e) => {
        setFilter({...filter, page: Number(e)});
        setTriggerFind(true);
    }

    const customClass = (data) => {
        let customClass = '';
        customClass += data.deleted_at ? 'opacity-40 ' : '';
        return customClass;
    }
    return(
        <>
        <div className='overflow-auto'>
            <div className="w-full mb-12">
                <CategoryFilterComponent 
                    filter={filter}
                    setFilter={setFilter}
                    triggerFind={setTriggerFind}
                />
                {/* table */}
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                    <div className="block w-full overflow-x-auto">
                        <table id="tblUsergroup" className="table-striped items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Nama
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Urutan
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className={`px-4 ${customClass(items)}`} key={index}>
                                        <td className='px-4 py-2 min-w-[200px]'>{items?.name}</td>
                                        <td className='px-4 py-2 min-w-[200px]'>{items?.description}</td>
                                        <td className='px-4 py-2 min-w-[100px]'>{items?.sequence}</td>
                                        <td className='px-4 py-2 min-w-[200px]'>
                                            <ButtonAction
                                                label='Edit'
                                                type='edit'
                                                handleClick={()=>editTable(items)}
                                            />
                                            {items?.deleted_at ? (
                                                <ButtonAction
                                                    label={'Restore'}
                                                    type='restore'
                                                    icon='rotate-right'
                                                    iconClass='w-4 h-4 inline-block ml-1 mr-1 text-yellow-500 hover:text-yellow-700'
                                                    handleClick={()=>restoration(items)}
                                                />
                                            ) : (
                                                <ButtonAction
                                                    label='delete'
                                                    type='delete'
                                                    handleClick={()=>deleteTable(items)}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className='px-4 py-4 text-center'>
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
            </div>
        </div>
        </>
    )
}