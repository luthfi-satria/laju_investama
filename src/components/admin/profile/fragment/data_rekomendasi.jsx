import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function DataRekomendasi({
    panel,
    setPanel,
    axiosHandler,
    swal,
    updateStatus,
    setUpdateStatus,

}){
    const [rekomendasi, setRekomendasi] = useState(null);
    const [loader, setLoader] = useState(false);
    const [errArray, setErrArray] = useState(false);

    useEffect(()=>{
        if(rekomendasi == null){
            axiosHandler('get', {}, '/perekomendasi')
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw(data);
                }
                setRekomendasi(data.data);
            });
        }
    }, [axiosHandler, rekomendasi]);

    const Rekomendasi = (e) => {
        setRekomendasi({...rekomendasi, [e.target.name] : e.target.value});
    }

    const UpdateRekomendasi = () => {
        const profile = rekomendasi;
        delete profile.user_id;

        setLoader(true);
        setTimeout(()=> {
            axiosHandler('put', profile, '/perekomendasi')
            .then((response) => {
                if(response){
                    setUpdateStatus(true);
                    setErrArray(false);
                }
            })
            .catch((err)=>{
                let errTxt = 'Input form tidak valid';
                if(err.code == 'ERR_NETWORK'){
                    errTxt = err.message;
                }
                else{
                    const joinErr = {};
                    const errMsg = err.response.data.message;
                    for(const e of errMsg){
                        joinErr[e.property] = e.constraints.join(', ');
                    }
                    setErrArray(joinErr);
                }
                swal({
                    icon: 'warning',
                    title: 'Request Error',
                    text: errTxt
                });
            })
            .finally(() => {
                setLoader(false);
            });
        },5000);
    }
    return(
        <>
            <h3 
                className='relative font-semibold uppercase bg-gradient-to-br px-4 py-2 bg-gray-200 border border-gray-400 cursor-pointer hover:bg-gray-300'
                onClick={()=>setPanel({
                    show: panel.show ? false: true,
                    context: 'data-rekomendasi'
                })}
            >
                DATA REKOMENDASI 
                <span className="text-red-600 text-xs absolute top-2 px-2">* Wajib Diisi</span>
                <div 
                    className='inline-block float-right'
                >
                    <FontAwesomeIcon icon={panel.show && panel.context ==='data-rekomendasi' ? 'chevron-down' : 'chevron-right'}/>
                </div>
            </h3>
            <div 
                id="form-data-rekomendasi" 
                className={`border border-gray-400 px-4 py-4 rounded-sm grid grid-cols-1 ${panel.show && panel.context =='data-rekomendasi' ? '' : 'hidden'}`}
                >
                <div className="sm:w-2/3">

                    {/* Nama */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_rk_nama'>Nama Lengkap</label>
                        <input 
                            type="text" 
                            id="inp_rk_nama"
                            name="name" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nama lengkap..."
                            value={rekomendasi?.name ? rekomendasi.name : ''}
                            onChange={(e) => Rekomendasi(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.name !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.name}</div>
                    )}

                    {/* Perekomendasi */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_rk_referal'>Perekomendasi</label>
                        <input 
                            type="text" 
                            id="inp_rk_referal"
                            name="perekomendasi" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nama referal..."
                            value={rekomendasi?.perekomendasi ? rekomendasi.perekomendasi : ''}
                            onChange={(e) => Rekomendasi(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.perekomendasi !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.perekomendasi}</div>
                    )}

                    {/* Relasi */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_rk_hub'>Relasi</label>
                        <input 
                            type="text" 
                            id="inp_rk_hub"
                            name="relasi" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Relasi..."
                            value={rekomendasi?.relasi ? rekomendasi.relasi : ''}
                            onChange={(e) => Rekomendasi(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.relasi !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.relasi}</div>
                    )}

                    {/* Alamat */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_rk_alamat'>Alamat</label>
                        <input 
                            type="text" 
                            id="inp_rk_alamat"
                            name="alamat" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Alamat..."
                            value={rekomendasi?.alamat ? rekomendasi.alamat : ''}
                            onChange={(e) => Rekomendasi(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.alamat !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.alamat}</div>
                    )}

                    {/* Kelurahan */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_rk_kelurahan'>Kelurahan</label>
                        <input 
                            type="text" 
                            id="inp_rk_kelurahan"
                            name="kelurahan" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kelurahan..."
                            value={rekomendasi?.kelurahan ? rekomendasi.kelurahan : ''}
                            onChange={(e) => Rekomendasi(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.kelurahan !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.kelurahan}</div>
                    )}

                    {/* Kecamatan */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_rk_kecamatan'>Kecamatan</label>
                        <input 
                            type="text" 
                            id="inp_rk_kecamatan"
                            name="kecamatan" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kecamatan..."
                            value={rekomendasi?.kecamatan ? rekomendasi.kecamatan : ''}
                            onChange={(e) => Rekomendasi(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.kecamatan !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.kecamatan}</div>
                    )}

                    {/* Kota */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_rk_kota'>Kota</label>
                        <input 
                            type="text" 
                            id="inp_rk_kota"
                            name="kota" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kota..."
                            value={rekomendasi?.kota ? rekomendasi.kota : ''}
                            onChange={(e) => Rekomendasi(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.kota !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.kota}</div>
                    )}

                    {/* BUTTON */}
                    <div className='mt-2 w-full py-4 text-center sm:text-right'>
                        {updateStatus && <span className="mr-5 text-xs text-gray-400">Data berhasil disimpan!!</span>}
                        <button 
                            type='button'
                            className='bg-teal-500 border mr-2 border-teal-600 text-xs rounded-md px-4 ring-2 leading-4 font-semibold ring-slate-600 py-2 text-white hover:bg-teal-800'
                            onClick={UpdateRekomendasi}
                            >
                            {loader ? 'Harap Tunggu' : 'Simpan'}
                        </button>
                    </div>                              
                </div>
            </div>
        </>
    )
}