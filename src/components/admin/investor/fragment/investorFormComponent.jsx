import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

export default function InvestorFormComponent({
    formData,
    handleChange,
    error,
    axiosRequest,
}){
    const [findByPhone, setfindByPhone] = useState('');
    const [triggerFind, setTriggerFind] = useState(false);

    const InitializeForm = (property) => {
        return formData?.[property] || '';
    }

    useEffect(()=>{
        if(triggerFind){
            axiosRequest('post','api/user/find_profile',{},{phone: findByPhone})
            .then(({data}) => {
                if(data.success){
                    if(Object.keys(data.data).length > 0){
                        handleChange({...formData, user_id: data?.data?.id, nama: data?.data?.profile?.name});
                    }
                    else{
                        handleChange({...formData, user_id: '', nama: 'Akun tidak ditemukan...'});
                    }
                }
                setTriggerFind(false);
            })
            .catch((err)=> {
                console.log(err);
            });
        }
    },[findByPhone, axiosRequest, triggerFind, formData, handleChange]);

    return(
        <>
            <div 
                id="akun-profile" 
                className={`grid grid-cols-1`}
            >
                {!formData?.user_id && (
                    <div className="grid sm:grid-cols-3 gap-2 mb-2">
                        <div className="">
                            <label className='text-sm sm:text-right' htmlFor='src_account'>Cari Akun</label>
                        </div>
                        <div className="col-span-2">
                            <input 
                                type="text" 
                                id="src_account"
                                name="name" 
                                className="w-3/4 text-gray text-xs px-2 py-2 h-[37px] outline-none border focus:border-gray-500"
                                placeholder="Masukan nomor handphone yang terdaftar"
                                value={findByPhone}
                                onChange={(e) => setfindByPhone(e.target.value)}
                                autoComplete="off"
                            />
                            <button
                                className="w-1/4 px-2 py-2 h-[37px] rounded-e-md bg-teal-700 text-white hover:bg-teal-800"
                                onClick={() => setTriggerFind(true)}
                            >
                                Cari
                            </button>
                            {error?.name !='' && (
                                <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                    {error?.name}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* NAMA */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_nama'>Nama Akun</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_nama"
                            name="name" 
                            className="w-full text-gray bg-slate-300 text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            value={formData?.nama || ''}
                            disabled={true}
                            autoComplete='off'
                        />
                    </div>
                </div>

                {/* NO INVESTASI */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_no_inv'>No Investasi</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_no_inv"
                            name="nomor_investasi" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nomor investasi..."
                            value={InitializeForm('no_investasi')}
                            onChange={(e) => {
                                    handleChange({...formData, no_investasi: e.target.value})
                                }
                            }
                            autoComplete="off"
                        />
                        {error?.no_investasi !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.no_investasi}
                            </div>
                        )}
                    </div>
                </div>

                {/* NILAI */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_nilai'>Nilai</label>
                    </div>
                    <div className="col-span-2">
                        <CurrencyInput 
                            id="inp_nilai"
                            name="nilai" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nominal investasi..."
                            value={InitializeForm('nilai')}
                            decimalsLimit={0}
                            groupSeparator="."
                            decimalSeparator=","
                            intlConfig={{
                                locale: 'id-ID',
                                currency: 'IDR',
                            }}
                            onValueChange={(value) => {
                                    handleChange({...formData, nilai: Number(value)})
                                }
                            }
                            autoComplete="off"
                        />
                        {error?.nilai !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.nilai}
                            </div>
                        )}
                    </div>
                </div>

                {/* Jangka Waktu */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_jangka'>Jangka Waktu</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="number" 
                            id="inp_jangka"
                            name="jangka waktu" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Jangka waktu (tahun)..."
                            value={InitializeForm('jangka_waktu')}
                            onChange={(e) => handleChange({...formData, jangka_waktu: Number(e.target.value)})}
                            autoComplete="off"
                        />
                        {error?.jangka_waktu !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.jangka_waktu}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bank */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_bank'>Bank (optional)</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_bank"
                            name="bank" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nama Bank..."
                            value={InitializeForm('bank')}
                            onChange={(e) => handleChange({...formData, bank: e.target.value})}
                            autoComplete="off"
                        />
                        {error?.bank !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.bank}
                            </div>
                        )}
                    </div>
                </div>

                {/* REKENING */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_rekening'>No. Rekening (Optional)</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_rekening"
                            name="no_rekening" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nomor rekening..."
                            value={InitializeForm('no_rekening')}
                            onChange={(e) => handleChange({...formData, no_rekening: e.target.value})}
                            autoComplete="off"
                        />
                        {error?.no_rekening !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.no_rekening}
                            </div>
                        )}
                    </div>
                </div>

                {/* VERIFIKASI DATA */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <div className='text-sm'>Status Verifikasi</div>
                    </div>
                    <div className="col-span-2">
                        <label 
                            className="relative inline-flex items-center cursor-pointer"
                            htmlFor="inp_verifikasi"
                        >
                            <input 
                                type="checkbox"
                                id="inp_verifikasi"
                                name="verify_at" 
                                className="sr-only peer"
                                value=''
                                defaultChecked={formData?.is_verified && typeof InitializeForm('verify_at') != 'undefined' ? true: false}
                                onChange={(e)=>{
                                    handleChange({...formData, is_verified: e.target.checked});
                                }}
                            />
                            <div 
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Verifikasi
                            </span>
                        </label>
                        {error?.verify_at !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.verify_at}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}