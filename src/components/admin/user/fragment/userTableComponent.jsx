import { useCallback, useEffect, useState } from 'react';
import Pagination from '../../../pagination';
import axios from 'axios';
import ButtonAction from '../../../buttonAction';
import UserFilterComponent from './userFilterComponent';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as CryptoJS from 'crypto-js';

export default function UserTableComponent({
    token,
    apiErrorHandling,
    deleteTable,
    restoreTable,
    successRes=false,
    setSuccessRes,
    filter,
    setFilter
}){
    const hasHKey = import.meta.env.VITE_HASH_KEY;
    const [isLoading, setIsLoading] = useState(false);
    const [triggerSrc, setTriggerSrc] = useState(true);
    const [data, setData] = useState(false);

    const AxiosHttp = useCallback((method, urlPath, params=null)=>{
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+urlPath,
            headers: {
                Authorization: 'Bearer '+token
            },
            params: params || filter
        });
    },[filter, token]);
    
    useEffect(()=>{
        if((triggerSrc && filter) || successRes){
            setIsLoading(true);
            try{
                AxiosHttp('get','/api/user')
                .then(({data}) => {
                    setData(data.data);
                })
                .catch((err) => {
                    // console.log('CATCH ERROR',err);
                    apiErrorHandling(err.response.data.message);
                }).finally(() => {
                    setTimeout(()=>{
                        setIsLoading(false);
                        setTriggerSrc(false);
                        setSuccessRes(false);
                    }, 2000);
                })
            }
            catch(err){
                // console.log('ERR', err);
                apiErrorHandling(err.response.data.message[0].constraint[0]);
            }
        }
    },[filter, successRes, AxiosHttp, apiErrorHandling, triggerSrc, setSuccessRes]);

    const changeLimitOption = (e) => {
        const option = Number(e.target.value);
        setFilter({...filter, limit: option, page: 1});
        setTriggerSrc(true);
    }

    const changePage = (e) => {
        setFilter({...filter, page: Number(e)});
        setTriggerSrc(true);
    }

    const rerouting = (id) => {
        const cryptoString = CryptoJS.DES.encrypt(JSON.stringify(id), hasHKey.toString(CryptoJS.enc.Utf8));
        const LinkUrl =  encodeURIComponent(cryptoString);
        return LinkUrl;
    }

    return(
        <>
        <div className='overflow-auto'>
            <div className="w-full mb-12">
                <UserFilterComponent 
                    filter={filter}
                    setFilter={setFilter}
                    axiosHttp={AxiosHttp}
                    triggerFind={setTriggerSrc}
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
                                        Username
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Email
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Telepon
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Kelamin
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Group
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Level
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Status
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className={items?.deleted_at ? 'px-4 text-red-400' : ''} key={index}>
                                        <td className='px-4 py-2 min-w-[200px]'>{items?.profile?.name}</td>
                                        <td className='px-4 py-2 min-w-[150px]'>{items?.username}</td>
                                        <td className='px-4 py-2 min-w-[150px]'>{items?.profile?.email}</td>
                                        <td className='px-4 py-2 min-w-[200px]'>{items?.profile?.phone}</td>
                                        <td className='px-4 py-2 min-w-[100px]'>{items?.profile?.gender}</td>
                                        <td className='px-4 py-2 min-w-[100px]'>{items?.usergroup?.name}</td>
                                        <td className='px-4 py-2 min-w-[100px]'>{items?.usergroup?.level} {items?.profile?.deleted_at}</td>
                                        <td className='px-4 py-2 min-w-[200px]'>
                                            {items?.profile?.verify_at ? <span className='text-white ring-2 ring-white px-2 rounded-md bg-green-400'>Terverifikasi</span> : <span className='bg-white text-gray-700 rounded-md px-2'>Belum Diverifikasi</span>}
                                        </td>
                                        <td className='px-4 py-2 min-w-[200px]'>
                                            <Link 
                                                to={rerouting(items.id)} 
                                                target='_blank'
                                                className='px-2 py-1 border border-white rounded-md mr-2 hover:bg-green-500'
                                            >
                                                <FontAwesomeIcon icon={'edit'}/>
                                            </Link>
                                            {!items?.deleted_at ? (
                                                <ButtonAction
                                                    label='delete'
                                                    type='delete'
                                                    handleClick={()=>deleteTable(items)}
                                                />
                                            ):''}
                                            {items?.deleted_at ? (
                                                <ButtonAction
                                                    label='restore'
                                                    type='reactivate'
                                                    handleClick={()=>restoreTable(items)}
                                                />
                                            ):''}
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className='px-4 py-4 text-center'>
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