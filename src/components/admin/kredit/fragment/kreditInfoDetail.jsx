import { IntlCurrency } from "../../../../helpers/converterHelper";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";

export default function KreditInfoDetail({
    orderDetail
}){
   return (
    <>
        <div className="relative grid border-b border-b-gray-200 pb-5">
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Kode Pengajuan</h3>
                <div className="mt-4 mb-2 block uppercase font-bold">: {orderDetail?.kredit_code}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Tanggal pengajuan</h3>
                <div className="mt-4 mb-2 block font-bold">: {UTCToLocaleDate(orderDetail?.tanggal_pengajuan || '','local','/')}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Tanggal verifikasi</h3>
                <div className="mt-4 mb-2 block font-bold">: {UTCToLocaleDate(orderDetail?.verify_at || '','local','/')}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Verificator</h3>
                <div className="mt-4 mb-2 block font-bold">: {orderDetail?.verificator?.name}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Tanggal disetujui</h3>
                <div className="mt-4 mb-2 block font-bold">: {UTCToLocaleDate(orderDetail?.tanggal_approval || '','local','/')}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Disetujui oleh</h3>
                <div className="mt-4 mb-2 block font-bold">: {orderDetail?.approver?.name}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Status</h3>
                <div className="mt-4 mb-2 block font-bold">: {orderDetail?.status}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Jenis Pembiayaan</h3>
                <div className="mt-4 mb-2 block font-bold">: {orderDetail?.jenis_pembiayaan}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Tenor</h3>
                <div className="mt-4 mb-2 block font-bold">: {orderDetail?.tenor} Bulan</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Down Payment</h3>
                <div className="mt-4 mb-2 block font-bold">: {IntlCurrency(orderDetail?.dp || 0)}</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Cicilan</h3>
                <div className="mt-4 mb-2 block font-bold">: {IntlCurrency(orderDetail?.cicilan || 0)} / Bulan</div>
            </div>
            <div className="flex items-center justify-start">
                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Tanggal Pembayaran Terakhir</h3>
                <div className="mt-4 mb-2 block font-bold">: {UTCToLocaleDate(orderDetail?.last_payment || '','local','/')}</div>
            </div>
        </div>    
    </>
   ); 
}