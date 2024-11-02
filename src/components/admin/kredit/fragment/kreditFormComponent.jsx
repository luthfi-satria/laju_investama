import { useCallback, useEffect, useState } from "react";
import KreditInfoKonsumen from "./kreditInfoKonsumen";
import ShowSweetAlert from "../../../../helpers/showAlert";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import moment from "moment/moment";
import CurrencyInput from "react-currency-input-field";

export default function KreditFormComponent({
    axiosRequest,
    errorHandler,
    errResponseHandler,
}){
    const history = useNavigate();
    const location = useLocation().pathname.split('/');
    const [query] = useSearchParams();
    const defaultField = useCallback(() => ({
        user_id: null, 
        jenis_pembiayaan: '', 
        nama_produk: '', 
        jenis_produk: '', 
        tipe_produk: '', 
        ukuran_produk: '', 
        warna_produk: '', 
        spesifikasi: '', 
        tenor: '', 
        harga_produk: '', 
        dp: '', 
        cicilan: '',
        tanggal_akad: '',
        tanggal_jatuh_tempo: '',
        fc_ktp: '', 
        fc_kk: '', 
        slip_gaji: '', 
        rek_koran: '', 
        surat_pernyataan: '', 
        down_payment: '',
        notes: '',
    }),[]);
    const [noHP, setNoHP] = useState(query.get('hp') || '');
    const [Konsumen, setKonsumen] = useState(false);
    const [Profit, setProfit] = useState(false);
    const [Kalkulasi, setKalkulasi] = useState(false);
    const [field, setField] = useState(defaultField);
    const [error, setError] = useState(defaultField);
    const [loadFirst, setLoadFirst] = useState(true);

    useEffect(() => {},[field, Konsumen, error, Profit]);
    
    useEffect(() => {
        if(Kalkulasi){
            kalkulasiKredit();
        }
    }, [Kalkulasi]);

    const cariKonsumen = useCallback(() => {
        axiosRequest('post','api/user/find_profile/complete',{
            data: {
                phone: noHP,
            }
        }).then(({data}) => {
            if(data.statusCode == 400){
                errorHandler(data.message);
            }
            setKonsumen(data?.data);
            setField({...field, user_id: data?.data?.user_id});
        }).catch((err) => {
            errResponseHandler(err);
        });
    },[axiosRequest, errorHandler, errResponseHandler, field, noHP]);

    const loadDetailPengajuan = useCallback(() => {
        axiosRequest('get','api/kredit/'+location[4])
            .then(({data}) => {
                setField({
                    ...field,
                    user_id: data?.data?.user_id,
                    jenis_pembiayaan: data?.data?.jenis_pembiayaan,
                    nama_produk: data?.data?.nama_produk,
                    jenis_produk: data?.data?.jenis_produk,
                    tipe_produk: data?.data?.tipe_produk,
                    ukuran_produk: data?.data?.ukuran_produk,
                    warna_produk: data?.data?.warna_produk,
                    spesifikasi: data?.data?.spesifikasi,
                    harga_produk: data?.data?.harga_produk,
                    tenor: data?.data?.tenor,
                    cicilan: data?.data?.cicilan,
                    tanggal_akad: data?.data?.tanggal_akad,
                    tanggal_jatuh_tempo: data?.data?.tanggal_jatuh_tempo,
                    notes: data?.data?.notes,
                    dp: data?.data?.dp,
                    fc_ktp: data?.data?.document?.fc_ktp,
                    fc_kk: data?.data?.document?.fc_kk,
                    rek_koran: data?.data?.document?.rek_koran,
                    surat_pernyataan: data?.data?.document?.surat_pernyataan,
                    down_payment: data?.data?.document?.down_payment,
                });
                const profit = (data?.data?.dp + (data?.data?.cicilan * data?.data?.tenor)) - data?.data?.harga_produk ?? 0;
                setKalkulasi(profit);
                // console.log(data);
            })
            .catch((error) => {
                errorHandler(error);
            });
        setLoadFirst(false);
    },[axiosRequest, field, errorHandler, location]);

    useEffect(() => {
        if(noHP != '' && location[4] && loadFirst){
            cariKonsumen();
            loadDetailPengajuan();
        }
    },[noHP, location, cariKonsumen, loadDetailPengajuan, loadFirst]);

    const buatPengajuan = (e) => {
        e.preventDefault();
        const method = location[4] && query.get('hp') ? 'put' : 'post';
        const url = location[4] && query.get('hp') ? '/'+location[4] : '';        
        ShowSweetAlert({
            icon: 'info',
            title: method == 'post' ? 'Buat pengajuan baru?' : 'Edit data pengajuan '+location[4],
            text: 'Klik tombol OK jika data sudah benar, tekan cancel jika ingin memeriksa data kembali',
        }, true).then((response) => {
            if(response.isConfirmed){
                if(Konsumen?.rekomendasi && Konsumen?.pekerjaan){
                    const formData = new FormData();
                    for(const items in field){
                        if(['fc_ktp','fc_kk','slip_gaji','rek_koran','surat_pernyataan','down_payment'].includes(items) == false){
                            // console.log(items);
                            formData.append(items, field[items]);
                        }
                        else{
                            if(field[items] != ''){
                                // console.log(document.getElementById(items).files?.item(0));
                                formData.append(items, document.getElementById(items).files?.item(0));
                            }
                        }
                    }
                    axiosRequest(method, 'api/kredit'+url, {data: formData},
                        {
                            'Content-Type' : 'multipart/form-data',
                        }
                    ).then(({data}) => {
                        if(data.success){
                            ShowSweetAlert({
                                icon: 'success',
                                title: 'Pengajuan berhasil dibuat'
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
                else{
                    ShowSweetAlert({
                        icon: 'warning',
                        title: 'Pengajuan ditolak',
                        text: 'Harap user lengkapi profil, pekerjaan, dan rekomendasi dahulu'
                    });
                }
            }
        });
    }

    const kalkulasiKredit = useCallback(() => {
        const harga_produk = field?.harga_produk ?? 0;
        let harga_penjualan = harga_produk;
        if(Profit == 0){
            harga_penjualan = (harga_produk + (harga_produk * (Profit / 100))) ?? 0;
        }
        const dp = field?.dp || 0;
        const tenor = field?.tenor || 1;
        const cicilan = Math.round((((harga_penjualan - dp) / tenor) / 1000)) * 1000;
        setField({...field, cicilan: Number(cicilan)});
        setKalkulasi(false);
    });

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
                    FORM PENGAJUAN 
                </h2>

                {/* CARI NOMOR */}
                {!location[4] && (
                    <div 
                        className="w-full md:w-1/2 py-4"
                    >
                        <label
                            htmlFor="src-phone"
                            className="block mb-4 font-normal text-white"
                        >
                            Masukkan Nomor Handphone
                        </label>
                        <input
                            type="text"
                            id="src-phone"
                            name="phone"
                            placeholder="Cari nomor handphone"
                            autoComplete={'off'}
                            onChange={(e) => setNoHP(e.target.value)}
                            defaultValue={noHP}
                            className="inline-block w-2/3 px-2 py-2 leading-3 outline-none bg-slate-100 ring ring-white"
                        />
                        <button
                            className="inline-block w-1/3 leading-6 px-4 py-2 bg-teal-500 text-white border border-white hover:bg-teal-700 rounded-e-md font-semibold"
                            onClick={cariKonsumen}
                        >
                            Cari User
                        </button>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-2">
                    <KreditInfoKonsumen Konsumen={Konsumen}/>
                    <div className="">
                        <h2 
                            className="bg-gray-200 px-2 py-2 text-gray-600 font-bold text-lg rounded-t-md"
                        >
                            Form Pengajuan
                        </h2>
                        <div 
                            className="bg-white px-2 py-2 rounded-b-md"
                            >
                            <form id="form_pengajuan">
                                <fieldset
                                    className="border px-2 py-2 rounded-md"
                                >
                                    <legend className="font-bold">Data Pemesanan Produk</legend>
                                    <div className="grid md:grid-cols-3">
                                        {/* JENIS PEMBIAYAAN */}
                                        <label
                                            htmlFor="jenis_pembiayaan"
                                            className="font-semibold text-gray-500"
                                        >
                                            Jenis Pembiayaan
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <select
                                                id="jenis_pembiayaan"
                                                name="jenis_pembiayaan"
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                onChange={(e) => setField({...field, jenis_pembiayaan: e.target.value})}
                                                value={field?.jenis_pembiayaan || ''}
                                            >
                                                <option value={''}>Pilih</option>
                                                <option value="Sendiri">Sendiri</option>
                                                <option value={'Bersama'}>Bersama (Suami Istri)</option>
                                            </select>
                                            {error?.jenis_pembiayaan !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.jenis_pembiayaan}
                                                </div>
                                            )}
                                        </div>

                                        {/* NAMA PRODUK */}
                                        <label
                                            htmlFor="nama_produk"
                                            className="font-semibold text-gray-500"
                                        >
                                            Nama Produk
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="nama_produk"
                                                name="name" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.nama_produk || ''}
                                                onChange={(e) => setField({...field, nama_produk: e.target.value})}
                                                placeholder="Nama produk..."
                                                autoComplete='off'
                                            />
                                            {error?.nama_produk !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.nama_produk}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* JENIS PRODUK */}
                                        <label
                                            htmlFor="jenis_produk"
                                            className="font-semibold text-gray-500"
                                        >
                                            Jenis Produk
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="jenis_produk"
                                                name="jenis" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.jenis_produk || ''}
                                                onChange={(e) => setField({...field, jenis_produk: e.target.value})}
                                                placeholder="Jenis produk..."
                                                autoComplete='off'
                                            />
                                            {error?.jenis_produk !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.jenis_produk}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tipe PRODUK */}
                                        <label
                                            htmlFor="tipe_produk"
                                            className="font-semibold text-gray-500"
                                        >
                                            Tipe Produk
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="tipe_produk"
                                                name="tipe" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.tipe_produk || ''}
                                                onChange={(e) => setField({...field, tipe_produk: e.target.value})}
                                                placeholder="Tipe produk..."
                                                autoComplete='off'
                                            />
                                            {error?.tipe_produk !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.tipe_produk}
                                                </div>
                                            )}
                                        </div>

                                        {/* Ukuran PRODUK */}
                                        <label
                                            htmlFor="ukuran_produk"
                                            className="font-semibold text-gray-500"
                                        >
                                            Ukuran Produk
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="ukuran_produk"
                                                name="ukuran" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.ukuran_produk || ''}
                                                onChange={(e) => setField({...field, ukuran_produk: e.target.value})}
                                                placeholder="Ukuran produk..."
                                                autoComplete='off'
                                            />
                                            {error?.ukuran_produk !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.ukuran_produk}
                                                </div>
                                            )}
                                        </div>

                                        {/* Warna PRODUK */}
                                        <label
                                            htmlFor="warna_produk"
                                            className="font-semibold text-gray-500"
                                        >
                                            Warna Produk
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="warna_produk"
                                                name="warna" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.warna_produk || ''}
                                                onChange={(e) => setField({...field, warna_produk: e.target.value})}
                                                placeholder="Warna produk..."
                                                autoComplete='off'
                                            />
                                            {error?.warna_produk !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.warna_produk}
                                                </div>
                                            )}
                                        </div>

                                        {/* SPESIFIKASI */}
                                        <label
                                            htmlFor="spesifikasi"
                                            className="font-semibold text-gray-500"
                                        >
                                            Spesifikasi
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="spesifikasi"
                                                name="spesifikasi" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.spesifikasi || ''}
                                                onChange={(e) => setField({...field, spesifikasi: e.target.value})}
                                                placeholder="Spesifikasi produk..."
                                                autoComplete='off'
                                            />
                                            {error?.spesifikasi !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.spesifikasi}
                                                </div>
                                            )}
                                        </div>

                                        {/* HARGA PRODUK */}
                                        <label
                                            htmlFor="harga_produk"
                                            className="font-semibold text-gray-500"
                                        >
                                            Harga Produk
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <CurrencyInput 
                                                id="harga_produk"
                                                name="harga_produk" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.harga_produk || ''}
                                                decimalsLimit={0}
                                                groupSeparator="."
                                                decimalSeparator=","
                                                intlConfig={{
                                                    locale: 'id-ID',
                                                    currency: 'IDR',
                                                }}
                                                onValueChange={(value) => {
                                                    setField({...field, harga_produk: Number(value)});
                                                    setKalkulasi(1);
                                                }}
                                                placeholder="32000000"
                                                autoComplete='off'
                                            />
                                            {error?.harga_produk !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.harga_produk}
                                                </div>
                                            )}
                                        </div>

                                        {/* DP */}
                                        <label
                                            htmlFor="dp"
                                            className="font-semibold text-gray-500"
                                        >
                                            Down Payment (DP)
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <CurrencyInput 
                                                id="dp"
                                                name="dp" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.dp || ''}
                                                decimalsLimit={0}
                                                groupSeparator="."
                                                decimalSeparator=","
                                                intlConfig={{
                                                    locale: 'id-ID',
                                                    currency: 'IDR',
                                                }}
                                                onValueChange={(value) => {
                                                    setField({...field, dp: Number(value)});
                                                    setKalkulasi(1);
                                                }}
                                                placeholder="1000000"
                                                autoComplete='off'
                                            />
                                            {error?.dp !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.dp}
                                                </div>
                                            )}
                                        </div>                                        

                                        {/* PROFIT */}
                                        <label htmlFor="profit" className="font-semibold text-gray-500">
                                                Profit Perusahaan (%)
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="number"
                                                id="profit_perusahaan"
                                                name="profit_perusahaan" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                defaultValue={field?.profit}
                                                onChange={(e) => {
                                                    setProfit(Number(e.target.value));
                                                    setKalkulasi(1);
                                                }}
                                                placeholder="10"
                                                autoComplete='off'
                                            />
                                        </div>

                                        {/* Tenor */}
                                        <label
                                            htmlFor="tenor"
                                            className="font-semibold text-gray-500"
                                        >
                                            Tenor cicilan
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="number" 
                                                id="tenor"
                                                name="tenor" 
                                                className="w-1/2 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.tenor || ''}
                                                onChange={(e) => {
                                                    setField({...field, tenor: Number(e.target.value)});
                                                    setKalkulasi(1);
                                                }}
                                                placeholder="12"
                                                autoComplete='off'
                                            />
                                            <span className="w-1/2 ml-2">Bulan</span>
                                            {error?.tenor !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.tenor}
                                                </div>
                                            )}
                                        </div>

                                        {/* Estimasi cicilan */}
                                        <label
                                            htmlFor="cicilan"
                                            className="font-semibold text-gray-500"
                                        >
                                            Estimasi Cicilan
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <CurrencyInput 
                                                id="cicilan"
                                                name="cicilan" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.cicilan || ''}
                                                decimalsLimit={0}
                                                groupSeparator="."
                                                decimalSeparator=","
                                                intlConfig={{
                                                    locale: 'id-ID',
                                                    currency: 'IDR',
                                                }}
                                                onValueChange={(value) => setField({...field, cicilan: Number(value)})}
                                                readOnly={true}
                                                autoComplete='off'
                                            />
                                            {error?.cicilan !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.cicilan}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tanggal Akad */}
                                        <label
                                            htmlFor="tanggal_akad"
                                            className="font-semibold text-gray-500"
                                        >
                                            Tanggal Akad
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <ReactDatePicker
                                                showIcon={true}
                                                value={field?.tanggal_akad ? moment(field?.tanggal_akad).format('DD/MM/YYYY') : ''}
                                                onChange={(date) => setField({...field, tanggal_akad: UTCToLocaleDate(date)})}
                                                dateFormat={'dd/MM/yyyy'}
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                calendarClassName="rounded-sm px-2 py-1 w-full text-gray-500"
                                                placeholderText="pilih tanggal..."
                                                id="tanggal_akad"
                                            />
                                            {error?.tanggal_akad !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.tanggal_akad}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tanggal Jatuh Tempo */}
                                        <label
                                            htmlFor="tanggal_jatuh_tempo"
                                            className="font-semibold text-gray-500"
                                        >
                                            Tanggal Jatuh Tempo
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="number" 
                                                id="tanggal_jatuh_tempo"
                                                name="tanggal_jatuh_tempo" 
                                                className="w-1/2 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.tanggal_jatuh_tempo || 1}
                                                onChange={(e) => setField({...field, tanggal_jatuh_tempo: Number(e.target.value)})}
                                                placeholder="1"
                                                autoComplete='off'
                                                min={1}
                                                max={31}
                                            />
                                            <span className="w-1/2 ml-2">Setiap bulan</span>
                                            {error?.tanggal_jatuh_tempo !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.tanggal_jatuh_tempo}
                                                </div>
                                            )}
                                        </div>

                                        {/* Catatan */}
                                        <label
                                            htmlFor="notes"
                                            className="font-semibold text-gray-500"
                                        >
                                            Catatan
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="text" 
                                                id="notes"
                                                name="notes" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                value={field?.notes || ''}
                                                onChange={(e) => setField({...field, notes: e.target.value})}
                                                placeholder="Tambahkan catatan..."
                                                autoComplete='off'
                                            />
                                            {error?.notes !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset
                                    className="border px-2 py-2 rounded-md"
                                >
                                    <legend className="font-bold">Dokumen Pendukung</legend>
                                    {location[4] && query.get('hp') && (
                                        <div className="px-4 py-2 text-sm bg-gray-200 mb-4">
                                            Mengunggah file baru akan menggantikan file yang telah ada sebelumnya!
                                        </div>
                                    )}
                                    <div className="grid md:grid-cols-3">
                                        {/* UPLOAD KTP */}
                                        <label
                                            htmlFor="fc_ktp"
                                            className="font-semibold text-gray-500"
                                        >
                                            Kartu Tanda Penduduk
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="file" 
                                                id="fc_ktp"
                                                name="fc_ktp" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                onChange={(e) => setField({...field, fc_ktp: e.target.value})}                                               
                                            />
                                            {error?.fc_ktp !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.fc_ktp}
                                                </div>
                                            )}
                                        </div>

                                        {/* UPLOAD KK */}
                                        <label
                                            htmlFor="fc_kk"
                                            className="font-semibold text-gray-500"
                                        >
                                            Kartu Keluarga
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="file" 
                                                id="fc_kk"
                                                name="fc_kk" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                onChange={(e) => setField({...field, fc_kk: e.target.value})}                                               
                                            />
                                            {error?.fc_kk !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.fc_kk}
                                                </div>
                                            )}
                                        </div>

                                        {/* UPLOAD SLIP GAJI */}
                                        <label
                                            htmlFor="slip_gaji"
                                            className="font-semibold text-gray-500"
                                        >
                                            Slip Gaji
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="file" 
                                                id="slip_gaji"
                                                name="slip_gaji" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                onChange={(e) => setField({...field, slip_gaji: e.target.value})}                                               
                                            />
                                            {error?.slip_gaji !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.slip_gaji}
                                                </div>
                                            )}
                                        </div>

                                        {/* UPLOAD REKENING KORAN */}
                                        <label
                                            htmlFor="rek_koran"
                                            className="font-semibold text-gray-500"
                                        >
                                            Rekening Koran
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="file" 
                                                id="rek_koran"
                                                name="rek_koran" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                onChange={(e) => setField({...field, rek_koran: e.target.value})}                                            
                                            />
                                            {error?.rek_koran !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.rek_koran}
                                                </div>
                                            )}
                                        </div>

                                        {/* UPLOAD SURAT PERNYATAAN */}
                                        <label
                                            htmlFor="surat_pernyataan"
                                            className="font-semibold text-gray-500"
                                        >
                                            Surat Pernyataan
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="file" 
                                                id="surat_pernyataan"
                                                name="surat_pernyataan" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                onChange={(e) => setField({...field, surat_pernyataan: e.target.value})}                                               
                                            />
                                            {error?.surat_pernyataan !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.surat_pernyataan}
                                                </div>
                                            )}
                                        </div>

                                        {/* UPLOAD BUKTI DP */}
                                        <label
                                            htmlFor="down_payment"
                                            className="font-semibold text-gray-500"
                                        >
                                            Bukti Kuitansi DP
                                        </label>
                                        <div className="md:col-span-2 mb-5">
                                            <input 
                                                type="file" 
                                                id="down_payment"
                                                name="down_payment" 
                                                className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-700 rounded-md leading-3"
                                                onChange={(e) => setField({...field, down_payment: e.target.value})}                                                
                                            />
                                            {error?.down_payment !='' && (
                                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                                    {error?.down_payment}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </fieldset>
                                
                                <button
                                    type="button"
                                    className="w-full mt-2 bg-teal-500 px-4 py-2 text-white hover:bg-teal-700 rounded-md font-bold"
                                    onClick={buatPengajuan}
                                >
                                    Buat Pesanan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}