export default function TransaksiFilterComponent({
    filter,
    setFilter,
    triggerFind,
    defaultFilter,
}){
    return (
        <>
            <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white'>
                <div className="block w-full overflow-x-auto">
                    <h3 className="w-full px-4 py-2 text-xl border-b-2">
                        FILTER ORDER
                    </h3>
                    {/* FILTER */}
                    <div name="src-order" className='px-4 py-4'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                            <div>
                                <label htmlFor='src-kode' className='block'>kode transaksi</label>
                                <input 
                                    id="src-kode" 
                                    type="text" 
                                    name='kode' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onChange={(e)=>{
                                        setFilter({...filter, kode_transaksi: e.target.value});
                                    }}
                                    placeholder="Kode transaksi..."
                                    autoComplete='off'
                                />
                            </div>
                            <div>
                                <label htmlFor='src-status' className='block'>Status</label>
                                <select 
                                    id="src-status" 
                                    type="text" 
                                    name='status' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onChange={(e)=>{
                                        setFilter({...filter, status: e.target.value});
                                    }}
                                    autoComplete='off'
                                >
                                    <option value={''}>SEMUA STATUS</option>
                                    <option value={'WAITING'}>BELUM BAYAR</option>
                                    <option value={'PAID'}>MENUNGGU KONFIRMASI</option>
                                    <option value={'PROCEED'}>DIPROSES</option>
                                    <option value={'SUCCESS'}>SELESAI</option>
                                    <option value={'CANCELED'}>BATAL</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor='src-metode' className='block'>Metode Bayar</label>
                                <select 
                                    id="src-metode" 
                                    type="checkbox" 
                                    name='metode-bayar' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onChange={(e)=>{
                                        setFilter({...filter, payment_method: e.target.value});
                                    }}
                                    autoComplete='off'
                                >
                                    <option value={''}>SEMUA METODE</option>
                                    <option value={'cash'}>TUNAI</option>
                                    <option value={'transfer'}>TRANSFER</option>
                                    <option value={'deduction'}>POTONG GAJI</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="date_start">Tanggal Mulai</label>
                                <input 
                                    id="date_start"
                                    type="date"
                                    value={filter.date_start}
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onChange={(e) => setFilter({...filter, date_start: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="date_end">Tanggal Selesai</label>
                                <input 
                                    id="date_end"
                                    type="date"
                                    value={filter.date_end}
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onChange={(e) => setFilter({...filter, date_end: e.target.value})}
                                />
                            </div>
                            <div>
                                <button 
                                    id="src_clear" 
                                    type='button'
                                    className='border border-white bg-red-500 px-2 py-1 rounded-l-md mt-5 w-1/2 hover:bg-red-600'
                                    onClick={()=>{
                                        setFilter(defaultFilter);
                                        triggerFind(true);
                                    }}
                                >
                                    Hapus
                                </button>
                                <button 
                                    id="src_btn" 
                                    type='button'
                                    className='border border-white px-2 py-1 rounded-r-md mt-5 w-1/2 bg-teal-700 hover:bg-teal-500'
                                    onClick={() => {
                                        setFilter({...filter, page:1});
                                        triggerFind(true);
                                    }}
                                >
                                    Cari
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        </>
    )
}