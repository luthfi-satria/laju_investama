import Pagination from "../../pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import fileDownload from "js-file-download";
import HistoryKreditFilter from "./history_filter";
import { UTCToLocaleDate } from "../../../helpers/dateHelper";
import { IntlCurrency } from "../../../helpers/converterHelper";
import ShowSweetAlert from './../../../helpers/showAlert';

export default function HistoryKreditTable({
    axiosRequest,
    errorHandler,
}){
    const APIURL = import.meta.env.VITE_APIURL;
    const [isLoading, setIsLoading] = useState(false);
    const [triggerFind, setTriggerFind] = useState(true);
    const [data, setData] = useState(false);

    const defaultFilter = useCallback(() => ({
        page: 1,
        limit: 10,
        kredit_code: '',
        profile_name: '',
        profile_phone: '',
        payment_method: '',
        payment_date: '',
        verify_at: '',
        order_by: 'id',
        orientation: 'DESC',
    }),[]);
    const [filter, setFilter] = useState(defaultFilter);
    
    useEffect(()=>{
        if((triggerFind && filter)){
            setIsLoading(true);
            try{
                axiosRequest('get','api/angsuran',{params: filter})
                .then(({data}) => {
                    setData(data?.data);
                })
                .catch((err) => {
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

    const changeLimitOption = (e) => {
        const option = Number(e.target.value);
        setFilter({...filter, limit: option, page: 1});
        setTriggerFind(true);
    }

    const changePage = (e) => {
        setFilter({...filter, page: Number(e)});
        setTriggerFind(true);
    }

    const printReport = () => {
        axiosRequest('get', 'api/angsuran/print/report', {responseType: 'blob', params: filter})
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, 'riwayat_angsuran','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }

    const showImageDetail = (data, url) => {
        ShowSweetAlert({
            imageUrl: url,
            imageClass: 'w-full h-auto',
            imageAlt: 'Bukti Transaksi :'+data?.kredit_code,
        });
    }

    const fetchImage = (data) => {
        if(data?.kredit_code && data?.bukti_payment){
            const url = `${APIURL}/api/angsuran/${data?.kredit_code}/image/${data?.bukti_payment}`;
            return (
                <div
                    className="w-full cursor-pointer"
                    title="lihat gambar lebih besar"
                    onClick={() => showImageDetail(data, url)}
                >
                    <img 
                        src={url}
                        className="w-auto h-20 rounded-md"
                    />
                </div>
            );
        }
        return '';
    }

    return (
        <>
            <div>
                <div className="text-right mb-4 mt-3">
                    <button 
                        className="border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>printReport()}
                        >
                        <FontAwesomeIcon icon={'print'} className="mr-2"/>
                        Print
                    </button>
                </div>

                {/* FILTER */}
                <HistoryKreditFilter 
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
                                        Kode
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        User
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        HP
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        metode
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        tanggal bayar
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Status
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Nominal
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-text-ellipsis">
                                        Bukti
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className={`px-4`} key={index}>
                                        <td className='px-4 py-2 min-w-[100px] uppercase'>{items?.kredit_code}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.kredit?.profile?.name}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.kredit?.profile?.phone}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.payment_method}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{UTCToLocaleDate(items?.payment_date)}</td>
                                        <td className='px-4 py-2 min-w-[50px] whitespace-nowrap'>{items?.verify_at ? 'Terverifikasi': ''}</td>
                                        <td className='px-4 py-2 min-w-[100px] text-right'>{IntlCurrency(items?.jml_bayar || 0)}</td>
                                        <td className='px-4 py-2 min-w-[100px] text-center'>{fetchImage(items)}</td>
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
        </>
    );
}