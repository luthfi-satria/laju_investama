import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fileDownload from "js-file-download";
import { IntlCurrency } from './../../../../helpers/converterHelper';
import Pagination from "../../../pagination";

export default function ReportKredit({
    axiosRequest,
    errorHandler,
}){
    const prev_month = moment().subtract(1, 'month').format('YYYY-MM-DD');
    const currDate = moment().format('YYYY-MM-DD');
    
    const defaultProductReport = useCallback(() => ({
        page: 1,
        limit: 10,
        profile_name:'',
        profile_phone: '',
        tanggal_akad: `${prev_month.toString()}:${currDate.toString()}`,
        period_start: new Date(prev_month),
        period_end:new Date(currDate),
    }),[currDate, prev_month]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState(defaultProductReport);
    const [data, setData] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{},[refresh]);

    useEffect(()=>{
        if(!data || refresh){
            setIsLoading(true);
            axiosRequest('get','api/kredit/monthly_report/kredit',{
                params: filter,
            }).then(({data}) => {
                setData(data?.data);
            }).catch((error) => {
                errorHandler(error);
            }).finally(()=>{
                setTimeout(() => {
                    setIsLoading(false);
                    setRefresh(false);
                }, 1000);
            })
        }
    },[data, filter, axiosRequest, errorHandler, refresh]);

    const changeLimitOption = (e) => {
        const option = Number(e.target.value);
        setFilter({...filter, limit: option, page: 1});
        setRefresh(true);
    }

    const changePage = (e) => {
        setFilter({...filter, page: Number(e)});
        setRefresh(true);
    }

    const handleDate = (dates) => {
        const [start, end] = dates;
        const endDate = end < start ? start: end;
        const tglAju = UTCToLocaleDate(start)+':'+UTCToLocaleDate(endDate);
        setFilter({...filter, 
            tanggal_akad: tglAju,
            period_start: start,
            period_end: end,
        });
    }

    const printReport = () => {
        axiosRequest('get', 'api/kredit/monthly_report/kredit/print', {responseType: 'blob', params: filter})
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, 'rekapitulasi_kredit','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }
    return (
        <>
            {/* table */}
            <div className="py-4 mb-5 text-lg w-full border-b border-b-white-400">
                <h3 className="text-white font-bold w-full flex items-start justify-between">
                    <div>REKAPITULASI KREDIT</div>
                    <button
                        type="button"
                        className="px-4 py-2 border-2 border-white rounded-md text-base hover:bg-teal-700"
                        onClick={printReport}
                    >
                        <FontAwesomeIcon icon={'print'} className="mr-2"/>
                        Print
                    </button>
                </h3>
                <div className="relative w-full mt-5 text-sm">
                    <label htmlFor="period_product" className="w-full md:w-8 mr-5 inline-block text-white">Akad:</label>
                    <div className="w-full md:w-40 inline-block mb-2 mr-2">
                        <ReactDatePicker
                            value={filter?.period}
                            onChange={(date) => handleDate(date)}
                            dateFormat={'dd/MM/yyyy'}
                            className="w-full relative text-gray-600 text-xs px-2 py-2 outline-none border focus:border-white rounded-md leading-3"
                            placeholderText="Pilih tanggal..."
                            selectsRange={true}
                            startDate={filter?.period_start}
                            endDate={filter?.period_end}
                            id="period_product"
                        />
                    </div>
                    <label htmlFor="inp-code" className="w-full md:w-8 mr-5 inline-block text-white">Kode</label>
                    <div className="w-full md:w-40 inline-block mb-2 mr-2">
                        <input
                            type="text"
                            id="inp-code"
                            className="w-full relative text-gray-600 text-xs px-2 py-2 outline-none border focus:border-white rounded-md leading-3"
                            onChange={(e) => setFilter({...filter, kredit_code: e.target.value})}
                            placeholder="Kode kredit..."
                        />
                    </div>
                    <label htmlFor="inp-nama" className="w-full md:w-8 mr-5 inline-block text-white">Nama</label>
                    <div className="w-full md:w-40 inline-block mb-2 mr-2">
                        <input
                            type="text"
                            id="inp-nama"
                            className="w-full relative text-gray-600 text-xs px-2 py-2 outline-none border focus:border-white rounded-md leading-3"
                            onChange={(e) => setFilter({...filter, profile_name: e.target.value})}
                            placeholder="Nama Kreditur..."
                        />
                    </div>
                    <button
                        type="button"
                        className="inline-block px-4 py-2 bg-teal-500 text-white rounded-md ring ring-white text-xs hover:bg-teal-700 font-bold"
                        onClick={()=>setRefresh(true)}
                    >
                        Cari
                    </button>
                </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                    <div className="block w-full overflow-x-auto">
                        <table id="tblOrder" className="table-striped items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Kode
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Kreditur
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Tanggal Akad
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Harga Produk
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Tenor
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Cicilan
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Pembayaran Terakhir
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Total Setoran
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Sisa Angsuran
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className={`px-4`} key={index}>
                                        <td className='px-4 py-2 min-w-[100px] uppercase'>{items?.kredit_code}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.profile_name}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{UTCToLocaleDate(items?.tanggal_akad || '')}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{IntlCurrency(items?.harga_produk || 0)}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.tenor} Bulan</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{IntlCurrency(items?.cicilan || 0)}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{UTCToLocaleDate(items?.last_payment || '')}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{IntlCurrency(items?.total_setoran || 0)}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{IntlCurrency(items?.sisa_tunggakan || 0)}</td>
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
        </>
    );
}