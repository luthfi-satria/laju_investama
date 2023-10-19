import { useCallback, useEffect, useState } from 'react';
import Pagination from '../../../pagination';
import axios from 'axios';
import ButtonAction from '../../../buttonAction';

export default function UsergroupTableComponent({
    token,
    apiErrorHandling,
    editTable,
    deleteTable,
    successRes=false
}){
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(false);
    const [triggerFind, setTriggerFind] = useState(true);
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10
    });

    const FetchTable = useCallback(()=>{
        return axios({
            method: 'get',
            url: import.meta.env.VITE_APIURL+'/api/usergroup/',
            headers: {
                Authorization: 'Bearer '+token
            },
            params: filter
        });
    },[filter, token]);
    
    useEffect(()=>{
        if((triggerFind && filter) || successRes){
            try{
                FetchTable()
                .then(({data}) => {
                    setData(data.data);
                })
                .catch((err) => {
                    // console.log('CATCH ERROR',err);
                    apiErrorHandling(err.response.data.message);
                }).finally(() => {
                    setIsLoading(true);
                    setTriggerFind(false);
                })
            }
            catch(err){
                // console.log('ERR', err);
                apiErrorHandling(err.response.data.message[0].constraint[0]);
            }
        }
    },[filter, successRes, FetchTable, apiErrorHandling, triggerFind]);

    const changeLimitOption = (e) => {
        const option = Number(e.target.value);
        setFilter({...filter, limit: option, page: 1});
        setTriggerFind(true);
    }

    const changePage = (e) => {
        setFilter({...filter, page: Number(e)});
        setTriggerFind(true);
    }

    return(
        <>
        <div className='overflow-auto'>
            <div className="w-full mb-12 px-4">
                <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white'>
                    <div className="block w-full overflow-x-auto">
                        {/* FILTER */}
                        <form name="src_usergroup" className='px-4 py-4'>
                            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                                <div>
                                    <label htmlFor='src_nama' className='block'>Nama</label>
                                    <input 
                                        id="src_nama" 
                                        type="src_text" 
                                        name='nama' 
                                        className='rounded-sm px-2 py-1 w-full text-gray-500'
                                        onKeyUp={(e)=>{
                                            setFilter({...filter, ['name']: e.target.value});
                                        }}
                                        autoComplete='off'
                                        placeholder='cari nama group...'/>
                                </div>
                                <div>
                                    <label htmlFor='src_level' className='block'>Level</label>
                                    <select 
                                        id="src_level" 
                                        name='src_level' 
                                        className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                        onChange={(e) => setFilter({...filter, ['level']: e.target.value})}
                                    >
                                        <option value=''>---</option>
                                        <option value={'owner'}>Owner</option>
                                        <option value={'organisasi'}>Organisasi</option>
                                        <option value={'public'}>public</option>
                                    </select>
                                </div>
                                <div>
                                    <button 
                                        id="src_clear" 
                                        type='reset'
                                        className='border border-white bg-red-500 px-2 py-1 rounded-l-md mt-5 w-1/2 hover:bg-red-600'
                                        onClick={()=>{
                                            setFilter({
                                            page: 1,
                                            limit: 10
                                            });
                                            setTriggerFind(true);
                                        }}
                                    >
                                        Hapus
                                    </button>
                                    <button 
                                        id="src_btn" 
                                        type='button'
                                        className='border border-white px-2 py-1 rounded-r-md mt-5 w-1/2 bg-teal-700 hover:bg-teal-500'
                                        onClick={() => {
                                            setFilter({...filter, page: 1});
                                            setTriggerFind(true);
                                        }}
                                    >
                                        Cari
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* table */}
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                    <div className="block w-full overflow-x-auto">
                        <table id="tblUsergroup" className="table-striped items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Name
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Level
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Is Default
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className='px-4' key={index}>
                                        <td className='px-4 py-2'>{items.name}</td>
                                        <td className='px-4 py-2'>{items.level}</td>
                                        <td className='px-4 py-2'>{String(items.is_default)}</td>
                                        <td className='px-4 py-2'>
                                            <ButtonAction
                                                label='edit'
                                                type='edit'
                                                handleClick={()=>editTable(items)}
                                            />
                                            <ButtonAction
                                                label='delete'
                                                type='delete'
                                                handleClick={()=>deleteTable(items)}
                                            />
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='px-4 py-4 text-center'>
                                            Data tidak ditemukan...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className='bg-teal-800 border-t border-white'>
                                    <td className='px-4' colSpan={4}>
                                    <Pagination
                                        loading={isLoading}
                                        page={filter.page}
                                        limit={Number(filter.limit)}
                                        setPage={changePage}
                                        setPerPage={changeLimitOption}
                                        maxData={data?.total || 0}
                                        />
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}