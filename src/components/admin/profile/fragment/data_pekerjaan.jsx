import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function DataPekerjaan({
    panel,
    setPanel,
    axiosHandler,
    swal,
    updateStatus,
    setUpdateStatus,
}){
    const [pekerjaan, setPekerjaan] = useState(null);
    const [loader, setLoader] = useState(false);
    const [errArray, setErrArray] = useState(false);

    useEffect(()=>{
        if(pekerjaan == null){
            axiosHandler('get', {}, '/pekerjaan')
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw(data);
                }
                setPekerjaan(data.data);
            });
        }
    }, [axiosHandler, pekerjaan]);

    const Pekerjaan = (e) => {
        setPekerjaan({...pekerjaan, [e.target.name] : e.target.value});
    }

    const UpdatePekerjaan = () => {
        const profile = pekerjaan;
        profile.penghasilan = Number(profile.penghasilan);
        profile.cicilan = Number(profile.cicilan);
        delete profile.user_id;

        setLoader(true);
        setTimeout(()=> {
            axiosHandler('put', profile, '/pekerjaan')
            .then((response) => {
                if(response){
                    setUpdateStatus(true);
                    setErrArray(false);
                }
            })
            .catch((err)=>{
                let errTxt = 'Input form tidak valid';
                console.log(err);
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
                    ...panel,
                    ['show']: panel.show == true ? false : true,
                    ['context'] : 'data-pekerjaan'
                })}
            >
                DATA PEKERJAAN 
                <span className="text-red-600 text-xs absolute top-2 px-2">* Wajib Diisi</span>
                <div 
                    className='inline-block float-right'
                >
                    <FontAwesomeIcon icon={panel.show && panel.context ==='data-pekerjaan' ? 'chevron-down' : 'chevron-right'}/>
                </div>
            </h3>
            <div 
                id="form-data-pekerjaan" 
                className={`border border-gray-400 px-4 py-4 rounded-sm grid grid-cols-1 ${panel.show && panel.context =='data-pekerjaan' ? '' : 'hidden'}`}
            >
                <div className="sm:w-2/3">
                    {/* Nama */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_nama'>Nama Perusahaan</label>
                        <input 
                            type="text" 
                            id="inp_pk_nama"
                            name="name" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nama Perusahaan..."
                            value={pekerjaan?.name ? pekerjaan.name : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.name !='' && (
                        <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                            <div className="sm:col-start-3 col-span-3">{errArray.name}
                            </div>
                        </div>                
                    )}

                    {/* Alamat */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_alamat'>Alamat Perusahaan</label>
                        <input 
                            type="text" 
                            id="inp_pk_alamat"
                            name="alamat" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Alamat..."
                            value={pekerjaan?.alamat ? pekerjaan.alamat : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.alamat !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.alamat}</div>
                    )}

                    {/* Kelurahan */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_kelurahan'>Kelurahan</label>
                        <input 
                            type="text" 
                            id="inp_pk_kelurahan"
                            name="kelurahan" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kelurahan..."
                            value={pekerjaan?.kelurahan ? pekerjaan.kelurahan : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.kelurahan !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.kelurahan}</div>
                    )}
                    
                    {/* Kecamatan */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_kecamatan'>Kecamatan</label>
                        <input 
                            type="text" 
                            id="inp_pk_kecamatan"
                            name="kecamatan" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kecamatan..."
                            value={pekerjaan?.kecamatan ? pekerjaan.kecamatan : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.kecamatan !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.kecamatan}</div>
                    )}

                    {/* Kota */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_kota'>Kota</label>
                        <input 
                            type="text" 
                            id="inp_pk_kota"
                            name="kota" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kota..."
                            value={pekerjaan?.kota ? pekerjaan.kota : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.kota !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.kota}</div>
                    )}

                    {/* Penghasilan */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_penghasilan'>Penghasilan (Rp / Bulan)</label>
                        <input 
                            type="text" 
                            id="inp_pk_penghasilan"
                            name="penghasilan" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Penghasilan..."
                            value={pekerjaan?.penghasilan ? pekerjaan.penghasilan : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.penghasilan !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.penghasilan}</div>
                    )}

                    {/* Tipe Penghasilan */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_tipe'>Tipe Penghasilan</label>
                        <select 
                            id="inp_pk_tipe"
                            name="tipe_penghasilan" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Tipe penghasilan..."
                            value={pekerjaan?.tipe_penghasilan ? pekerjaan.tipe_penghasilan : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        >
                            <option>Tetap</option>
                            <option>Tidak Tetap</option>
                        </select>
                    </div>
                    {errArray?.tipe_penghasilan !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.tipe_penghasilan}</div>
                    )}

                    {/* Cicilan lain */}
                    <div className="grid sm:grid-cols-5 gap-2 mt-2">
                        <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_pk_cicilan'>Cicilan Lain (Jika ada, Rp / Bulan)</label>
                        <input 
                            type="text" 
                            id="inp_pk_cicilan"
                            name="cicilan" 
                            className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Cicilan lain..."
                            value={pekerjaan?.cicilan ? pekerjaan.cicilan : ''}
                            onChange={(e) => Pekerjaan(e)}
                            autoComplete="off"
                        />
                    </div>
                    {errArray?.cicilan !='' && (
                        <div className="text-red-500 text-xs w-full text-right pr-16 first-letter:uppercase">{errArray.cicilan}</div>
                    )}

                    {/* BUTTON */}
                    <div className="mt-2 w-full py-4 text-center sm:text-right">
                        {updateStatus && <span className="mr-5 text-xs text-gray-400">Data berhasil disimpan!!</span>}
                        <button 
                            type='button'
                            className='bg-teal-500 border mr-2 border-teal-600 text-xs rounded-md px-4 ring-2 leading-4 font-semibold ring-slate-600 py-2 text-white hover:bg-teal-800'
                            onClick={UpdatePekerjaan}
                            >
                            {loader ? 'Harap Tunggu' : 'Simpan'}                    
                        </button>
                    </div>
                </div>                              
            </div>
        </>
    )
}