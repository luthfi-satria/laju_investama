import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import ReactDatePicker from "react-datepicker";
import { Link, useNavigate } from "react-router-dom";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import KreditInfoDetail from "./kreditInfoDetail";
import ShowSweetAlert from "../../../../helpers/showAlert";

export default function KreditPaymentComponent({
    axiosRequest,
    errorHandler,
}){
    const history = useNavigate();
    const defaultField = useCallback(() => ({
        kredit_code: '',
        jml_bayar: '',
        payment_method: '',
        bank_name: '',
        nomor_rekening: '',
        pemilik_rekening: '',
        no_referensi: '',
        payment_date: '',
        bukti_payment: '',
    }),[]);
    const [field, setField] = useState(defaultField);
    const [error, setError] = useState(defaultField);
    const [info, setInfo] = useState(false);

    useEffect(()=>{},[field]);

    const findKreditur = useCallback((kredit_code) => {
        axiosRequest('get','api/kredit/'+kredit_code)
        .then(({data}) => {
            setInfo(data?.data);
        })
        .catch((error) => {
            errorHandler(error);
        });
    },[axiosRequest, errorHandler]);

    const handleKodeKredit = (e) => {
        setField({...field, kredit_code: e.target.value});
        if(e.target.value.length == 8){
            findKreditur(e.target.value);
        }
        else{
            setInfo(false);
        }
    }

    const prosesAngsuran = (e) => {
        e.preventDefault();
        ShowSweetAlert({
            icon: 'info',
            title: 'Proses angsuran?',
            text: 'Klik tombol OK jika data sudah benar, tekan cancel jika ingin memeriksa data kembali',
        }, true).then((response) => {
            if(response.isConfirmed){
                const formData = new FormData();
                for(const items in field){
                    if(['bukti_payment'].includes(items) == false){
                        formData.append(items, field[items]);
                    }
                    else{
                        if(field[items] != ''){
                            formData.append(items, document.getElementById(items).files?.item(0));
                        }
                    }
                }
                axiosRequest('post', 'api/kredit/payment', {data: formData},
                    {
                        'Content-Type' : 'multipart/form-data',
                    }
                ).then(({data}) => {
                    if(data.success){
                        ShowSweetAlert({
                            icon: 'success',
                            title: 'Angsuran berhasil diproses'
                        }, true).then(()=>{
                            history(0);
                        });
                    }
                }).catch(({response}) => {
                    if(response.status == 400){
                        const errData = response?.data?.message;
                        const newErr = {}
                        for(const items of errData){
                            newErr[items.property] = items.constraints[0];
                        }
                        setError({...defaultField, ...newErr});
                    }
                });
            }
        });
    }
    return (
        <>
            <div className="mt-10 mb-10">
                <Link
                    to={'..'}
                    className="px-4 py-2 text-white border border-white rounded-md hover:bg-teal-400"
                >Kembali</Link>
            </div>
            <div id="Form-pengajuan-kredit"
                className="w-full border border-white px-4 py-4 rounded-md"
            >
                <h2 className="text-white text-2xl py-4 mb-2 border-b border-white">
                    FORM PEMBAYARAN KREDIT 
                </h2>

                <div className="w-full flex items-center justify-start">
                    <div className="w-full md:w-2/3">
                        <h2 
                            className="bg-gray-200 px-2 py-2 text-gray-600 font-bold text-lg rounded-t-md"
                        >
                            Form Pembayaran
                        </h2>
                        <div 
                            className="bg-white px-2 py-2 rounded-b-md"
                        >
                            <form id="form-pembayaran">
                                <div className="grid md:grid-cols-3">
                                    {/* KODE PENGAJUAN */}
                                    <label
                                        htmlFor="kode_pengajuan"
                                        className="font-semibold text-gray-500"
                                    >
                                        Kode Pengajuan
                                    </label>
                                    <div className="md:col-span-2 mb-5">
                                        <input 
                                            type="text" 
                                            id="kode_pengajuan"
                                            name="kode" 
                                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                            value={field?.kredit_code || ''}
                                            onChange={handleKodeKredit}
                                            placeholder="Kode pengajuan..."
                                            autoComplete='off'
                                        />
                                        {error?.kredit_code !='' && (
                                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                {error?.kredit_code}
                                            </div>
                                        )}
                                    </div>

                                    {info && (
                                        <fieldset className="md:col-span-3 mb-5 border px-2 py-2 rounded-md">
                                            <legend className="font-bold">INFO KREDIT</legend>
                                            <KreditInfoDetail
                                                orderDetail={info}
                                            />
                                        </fieldset>
                                    )}

                                    {/* METODE PEMBAYARAN */}
                                    <label
                                            htmlFor="payment_method"
                                            className="font-semibold text-gray-500"
                                    >
                                        Metode Pembayaran
                                    </label>
                                    <div className="md:col-span-2 mb-5">
                                        <select
                                            id="payment_method"
                                            name="payment_method"
                                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                            onChange={(e) => setField({...field, payment_method: e.target.value})}
                                            value={field?.payment_method || ''}
                                        >
                                            <option value={''}>Pilih</option>
                                            <option value={"TRANSFER"}>Transfer</option>
                                            <option value={'TUNAI'}>Tunai</option>
                                            <option value={'POTONG GAJI'}>Potong Gaji</option>
                                        </select>
                                        {error?.payment_method !='' && (
                                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                {error?.payment_method}
                                            </div>
                                        )}
                                    </div>

                                    {/* JUMLAH BAYAR */}
                                    <label
                                        htmlFor="jml_bayar"
                                        className="font-semibold text-gray-500"
                                    >
                                        Jumlah Pembayaran
                                    </label>
                                    <div className="md:col-span-2 mb-5">
                                        <CurrencyInput 
                                            id="jml_bayar"
                                            name="jml_bayar" 
                                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                            value={field?.jml_bayar || ''}
                                            decimalsLimit={0}
                                            groupSeparator="."
                                            decimalSeparator=","
                                            intlConfig={{
                                                locale: 'id-ID',
                                                currency: 'IDR',
                                            }}
                                            onValueChange={(value) => setField({...field, jml_bayar: Number(value)})}
                                            placeholder="32000000"
                                            autoComplete='off'
                                        />
                                        {error?.jml_bayar !='' && (
                                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                {error?.jml_bayar}
                                            </div>
                                        )}
                                    </div>

                                    {field?.payment_method == 'TRANSFER' && (
                                        <>
                                        {/* NAMA BANK */}
                                        <label
                                            htmlFor="bank_name"
                                            className="font-semibold text-gray-500"
                                        >
                                            Nama Bank
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="bank_name"
                                                name="bank_name" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.bank_name || ''}
                                                onChange={(e) => setField({...field, bank_name: e.target.value})}
                                                placeholder="Nama bank..."
                                                autoComplete='off'
                                            />
                                            {error?.bank_name !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.bank_name}
                                                </div>
                                            )}
                                        </div>

                                        {/* NOMOR REKENING */}
                                        <label
                                            htmlFor="nomor_rekening"
                                            className="font-semibold text-gray-500"
                                        >
                                            Nomor Rekening Asal
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="nomor_rekening"
                                                name="nomor_rekening" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.nomor_rekening || ''}
                                                onChange={(e) => setField({...field, nomor_rekening: e.target.value})}
                                                placeholder="Nomor rekening asal..."
                                                autoComplete='off'
                                            />
                                            {error?.nomor_rekening !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.nomor_rekening}
                                                </div>
                                            )}
                                        </div>

                                        {/* REKENING TUJUAN */}
                                        <label
                                            htmlFor="rekening_tujuan"
                                            className="font-semibold text-gray-500"
                                        >
                                            Nomor Rekening Tujuan
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="rekening_tujuan"
                                                name="rekening_tujuan" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.rekening_tujuan || ''}
                                                onChange={(e) => setField({...field, rekening_tujuan: e.target.value})}
                                                placeholder="Nomor rekening tujuan..."
                                                autoComplete='off'
                                            />
                                            {error?.rekening_tujuan !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.rekening_tujuan}
                                                </div>
                                            )}
                                        </div>

                                        {/* NOMOR REFERENSI */}
                                        <label
                                            htmlFor="no_referensi"
                                            className="font-semibold text-gray-500"
                                        >
                                            No referensi transfer
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="no_referensi"
                                                name="no_referensi" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.no_referensi || ''}
                                                onChange={(e) => setField({...field, no_referensi: e.target.value})}
                                                placeholder="Nomor referensi transfer..."
                                                autoComplete='off'
                                            />
                                            {error?.no_referensi !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.no_referensi}
                                                </div>
                                            )}
                                        </div>
                                        </>
                                    )}

                                    {/* TANGGAL PEMBAYARAN */}
                                    <label
                                        htmlFor="payment_date"
                                        className="font-semibold text-gray-500"
                                    >
                                        Tanggal Pembayaran
                                    </label>
                                    <div className="md:col-span-2 mb-5">
                                        <ReactDatePicker
                                            showIcon={true}
                                            value={field?.payment_date ? moment(field?.payment_date).format('DD/MM/YYYY') : ''}
                                            onChange={(date) => setField({...field, payment_date: UTCToLocaleDate(date)})}
                                            dateFormat={'dd/MM/yyyy'}
                                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                            calendarClassName="rounded-sm px-2 py-1 w-full text-gray-500"
                                            placeholderText="pilih tanggal..."
                                            id="payment_date"
                                        />
                                        {error?.payment_date !='' && (
                                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                {error?.payment_date}
                                            </div>
                                        )}
                                    </div>

                                    {/* UPLOAD BUKTI */}
                                    <label
                                        htmlFor="bukti_payment"
                                        className="font-semibold text-gray-500"
                                    >
                                        Bukti Pembayaran
                                    </label>
                                    <div className="md:col-span-2 mb-5">
                                        <input 
                                            type="file" 
                                            id="bukti_payment"
                                            name="bukti_payment" 
                                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                            onChange={(e) => setField({...field, bukti_payment: e.target.value})}                                               
                                        />
                                        {error?.bukti_payment !='' && (
                                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                {error?.bukti_payment}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="w-full mt-2 bg-teal-500 px-4 py-2 text-white hover:bg-teal-700 rounded-md font-bold"
                                    onClick={prosesAngsuran}
                                >
                                    Proses Angsuran
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}