import { useEffect, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IntlCurrency } from "../../../../helpers/converterHelper";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import ShowSweetAlert from "../../../../helpers/showAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fileDownload from "js-file-download";


export default function ReportInvestasi({
    axiosRequest,
    errorHandler,
}){

    const month = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],[]);
    const [refresh, setRefresh] = useState(true);
    const [omsetBulanan, setOmsetBulanan] = useState(false);
    const [omsetTahunan, setOmsetTahunan] = useState(false);
    const [selectDate, setSelectDate] = useState(new Date());
    const [investor, setInvestor] = useState(false);
    
    useEffect(() => {
        if(refresh){
            axiosRequest('get','api/omset/monthly/'+selectDate.getFullYear())
            .then(({data}) => {
                const omset = data?.data;
                setOmsetBulanan(omset);
            })
            .catch((error) => {
                errorHandler(error);
            })
            .finally(()=>{
                setRefresh(false);
            });
        }
    },[omsetBulanan, refresh, selectDate, axiosRequest, errorHandler]);

    useEffect(() => {
        if(!omsetTahunan){
            axiosRequest('get','api/omset/yearly')
            .then(({data}) => {
                setOmsetTahunan(data?.data);
            }).catch((error) => {
                errorHandler(error);
            });
        }
    },[omsetTahunan, axiosRequest, errorHandler]);

    useEffect(()=>{
        if(!investor || refresh){
            axiosRequest('get', 'api/omset/bagi_hasil/'+selectDate.getFullYear())
            .then(({data}) => {
                const resultItem = data?.data;
                setInvestor(resultItem);                
            }).catch((error) => {
                errorHandler(error);
            })
        }
    },[investor, axiosRequest, errorHandler, selectDate, refresh]);

    const findOmsetBulanan = (dates) =>{
        setSelectDate(dates); 
        setRefresh(true);
    }

    const kalkulasiOmset = () => {
        const monthOption = {
            1: 'Januari',
            2: 'Februari',
            3: 'Maret',
            4: 'April',
            5: 'Mei',
            6: 'Juni',
            7: 'Juli',
            8: 'Agustus',
            9: 'September',
            10: 'Oktober',
            11: 'November',
            12: 'Desember',
        };
        ShowSweetAlert({
            title: 'Hitung ulang omset Tahun '+selectDate.getFullYear()+'?',
            // title: 'Pilih bulan',
            input: 'select',
            inputLabel: 'Pilih Bulan',
            inputOptions: monthOption,
        }, true).then((confirmation) => {
            if(confirmation.isConfirmed){
                const monthSelected = confirmation.value;
                const year = selectDate.getFullYear();
                const dates = `${year}-${monthSelected}`; 
                
                axiosRequest('post','api/omset/monthly_calc', {
                    data: {
                        date: dates,
                    }
                }).then(({data}) => {
                    if(data?.success){
                        ShowSweetAlert({
                            title: 'Status rekalkulasi',
                            text: `Omset Bulan ${monthOption[monthSelected]} Tahun ${year} telah dihitung`
                        });
                        setRefresh(true);
                    }
                });
            }
        });
    }

    const printReport = (url, filename='report') => {
        const year = selectDate.getFullYear();
        axiosRequest('get', `api/omset/${url}/${year}/download`, {responseType: 'blob'})
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, `${filename}_${year}`,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }   

    return (
        <>
            <div className="mb-5 grid gap-2">
                <div className="w-full px-2 py-2 rounded-md text-white overflow-auto">
                    <h3 className="w-full mb-5 py-2 font-bold text-2xl">Omset Tahunan</h3>
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                        <div className="block w-full">
                            <table
                                className="table-striped items-center w-full bg-transparent border-collapse"
                            >
                                <thead>
                                    <tr>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center text-text-ellipsis">
                                            Tahun
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center text-text-ellipsis">
                                            Omset
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {omsetTahunan.length > 0 ? omsetTahunan?.map((items, index) => (
                                        <tr key={`ot_${index}`}>
                                            <td className="text-center px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {items.thn}
                                            </td>
                                            <td className="text-center px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {IntlCurrency(items.yearly_income || 0)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={2} className='px-4 py-4 text-center'>
                                                Data tidak ditemukan...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="w-full px-2 py-2 rounded-md text-white overflow-auto">
                    <h3 className="w-full mb-5 py-2 font-bold text-2xl flex items-start justify-between">
                        <div>Omset Bulanan</div>
                        <div>
                            <button
                                type="button"
                                className="border border-white px-2 py-2 text-lg rounded-md"
                                onClick={() => printReport('monthly','OmsetBulanan')}
                            >
                                <FontAwesomeIcon icon={'download'} className="mr-2"/>
                                Download
                            </button>
                        </div>
                    </h3>
                    <div className="w-full flex items-center justify-start mb-5">
                        <span className="mr-2 w-1/5 px-2">Pilih Tahun: </span>
                        <ReactDatePicker
                            showIcon={true}
                            value={selectDate}
                            selected={selectDate}
                            onChange={findOmsetBulanan}
                            showYearPicker={true}
                            dateFormat={'yyyy'}
                            wrapperClassName="w-1/3 mr-10"
                            className="rounded-sm px-2 py-1 w-full bg-transparent outline-none text-white border-b border-gray-200"
                            calendarClassName="rounded-sm w-full text-gray-500"
                            placeholderText="Select date..."
                            id="src-date"
                        />
                        <button
                            className="w-1/3 px-4 py-2 bg-teal-400 text-white hover:bg-teal-700"
                            onClick={kalkulasiOmset}
                        >
                            Hitung ulang Tahun {selectDate.getFullYear()}
                        </button>
                    </div>
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                        <div className="block w-full">
                            <table
                                className="table-striped items-center w-full bg-transparent border-collapse"
                            >
                                <thead>
                                    <tr>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Bulan
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Grosir
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Kredit
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Total omset
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {omsetBulanan.length > 0 ? omsetBulanan?.map((items) => (
                                        <tr key={items.id}>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {month[items?.bln - 1]}
                                            </td>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {IntlCurrency(items.omset_grosir || 0)}
                                            </td>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {IntlCurrency(items.omset_kredit || 0)}
                                            </td>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {IntlCurrency(items.total_omset || 0)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className='px-4 py-4 text-center'>
                                                Data tidak ditemukan...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-white">
                <div className="w-full px-2 py-2 rounded-md text-white overflow-auto">
                    <h3 className="w-full mb-5 py-2 font-bold text-2xl flex items-start justify-between">
                        <div>Pembagian Hasil Tahun {selectDate.getFullYear()}</div>
                        <div>
                            <button
                                type="button"
                                className="border border-white px-2 py-2 text-lg rounded-md"
                                onClick={() => printReport('bagi_hasil','PembagianHasil')}
                            >
                                <FontAwesomeIcon icon={'download'} className="mr-2"/>
                                Download
                            </button>
                        </div>
                    </h3>
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                        <div className="block w-full">
                            <table
                                className="bg-teal-900 table-striped items-center w-full bg-transparent border-collapse"
                            >
                                <thead>
                                    <tr>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Investor
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Nilai
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Jangka Waktu
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Tanggal investasi
                                        </th>
                                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right text-text-ellipsis">
                                            Bagi Hasil (65%)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investor ? investor?.investor?.map((items, index) => (
                                        <tr key={`inv_${index}`}>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {items?.profile_name}
                                            </td>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {IntlCurrency(items.inv_nilai || 0)}
                                            </td>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {items?.inv_jangka_waktu} Tahun
                                            </td>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {UTCToLocaleDate(items?.inv_tanggal_investasi || '','local','/')}
                                            </td>
                                            <td className="text-right px-4 py-2 min-w-[50px] whitespace-nowrap">
                                                {IntlCurrency(items?.hasil || 0)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className='px-4 py-4 text-center'>
                                                Data tidak ditemukan...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} className="text-right px-4 py-2">
                                            Total Investasi: 
                                        </td>
                                        <td className="text-right px-4 py-2">
                                            {IntlCurrency(investor?.total_investasi || 0)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className="text-right px-4 py-2">
                                            Omset Tahun {selectDate.getFullYear()}: 
                                        </td>
                                        <td className="text-right px-4 py-2">
                                            {IntlCurrency(investor?.omsetTahunan || 0)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className="text-right px-4 py-2">
                                            Investor (65%): 
                                        </td>
                                        <td className="text-right px-4 py-2">
                                            {IntlCurrency(investor?.hasil_investor || 0)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className="text-right px-4 py-2">
                                            Pengelola (35%): 
                                        </td>
                                        <td className="text-right px-4 py-2">
                                            {IntlCurrency(investor?.pengelola || 0)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}