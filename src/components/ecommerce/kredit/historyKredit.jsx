import { IntlCurrency } from "../../../helpers/converterHelper";

export default function EcommerceHistoryCredit({
    title,
    dataKredit,
    CreateIcon,
}
){
    console.log(dataKredit);
    return (
        <>
                <div>
                    <h2 className="text-2xl font-bold uppercase leading-6 mb-10">{title || 'RIWAYAT PEMBAYARAN KREDIT'}</h2>
                    {/* LIST TRANSAKSI */}
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
                        <div className="mt-6 block w-full overflow-x-auto">
                            <table className="table-auto overflow-scroll w-full border border-blue-400">
                                <thead>
                                    <tr className="text-sm font-semibold text-center border-b-2 border-blue-500 uppercase">
                                        <th className="px-4 py-3 w-[20px]">No</th>
                                        <th className="px-4 py-3 min-w-[100px] w-auto">Kode Bayar</th>
                                        <th className="px-4 py-3 min-w-[100px] w-auto">Barang</th>
                                        <th className="px-4 py-3 min-w-[100px] w-auto">Tgl Bayar</th>
                                        <th className="px-4 py-3 min-w-[100px] w-auto">Jml Bayar</th>
                                        <th className="px-4 py-3 min-w-[100px] w-auto">Cara Bayar</th>
                                        <th className="px-4 py-3 min-w-[100px] w-auto">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-light text-gray-700 text-center">
                                    {dataKredit && dataKredit.length > 0 ? dataKredit.map((items, index) => (
                                        <tr className={`py-10 hover:bg-gray-300 `+(index % 2 == 0 ? `bg-gray-200`: ``)} key={index}>
                                            <th className="px-4 py-3 min-w-[100px]">{index + 1}</th>
                                            <th className="px-4 py-3 min-w-[100px]">{items?.kredit_code?.toUpperCase() ?? ''}</th>
                                            <th className="px-4 py-3 min-w-[100px]">{items?.kredit?.nama_produk ?? ''}</th>
                                            <th className="px-4 py-3 min-w-[100px]">{items?.payment_date}</th>
                                            <th className="px-4 py-3 min-w-[100px]">{IntlCurrency(items?.jml_bayar ?? 0)}</th>
                                            <th className="px-4 py-3 min-w-[100px]">{items?.payment_method}</th>
                                            <th className={`px-4 py-3 min-w-[100px] `+(items?.verificator?.length > 0 ? 'text-green-500': 'text-orange-400')}>{items?.verificator?.length > 0 ? 'Diterima' : 'Tertunda'}</th>
                                        </tr>
                                    ))
                                    : (
                                        <tr>
                                            <td className='text-3xl mt-10' colSpan={7}>
                                                Transaksi tidak ditemukan!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        </>
    )
}