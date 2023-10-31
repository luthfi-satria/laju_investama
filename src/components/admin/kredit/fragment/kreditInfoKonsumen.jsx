import { IntlCurrency } from "../../../../helpers/converterHelper";

export default function KreditInfoKonsumen({
    Konsumen
}){
    return (
        <>
            <div className="">
                <h2 
                    className="bg-gray-200 px-2 py-2 text-gray-600 font-bold text-lg rounded-t-md">
                    Info Konsumen
                </h2>
                <div 
                    className="bg-white px-2 py-2 rounded-b-md"
                >
                    <fieldset 
                        className="border px-2 py-2 rounded-md cursor-pointer"
                    >
                        <legend className="font-bold">Profil</legend>
                        <div className="grid grid-cols-3 gap-1">
                            <div className="font-semibold text-gray-400 mb-2">No KTP</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.ktp}</div>

                            <div className="font-semibold text-gray-400 mb-2">Masa Berlaku</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.masa_berlaku}</div>

                            <div className="font-semibold text-gray-400 mb-2">Nama</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.name}</div>

                            <div className="font-semibold text-gray-400 mb-2">Tempat, Tanggal lahir</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.dob_place}, {Konsumen?.dob}</div>

                            <div className="font-semibold text-gray-400 mb-2">Jenis Kelamin</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.gender ? (Konsumen?.gender == 'MALE' ? 'Laki-laki' : 'Perempuan') : ''}</div>

                            <div className="font-semibold text-gray-400 mb-2">Pendidikan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.education}</div>

                            <div className="font-semibold text-gray-400 mb-2">Status</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.marital_status}</div>

                            <div className="font-semibold text-gray-400 mb-2">Alamat</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.alamat}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kelurahan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.kelurahan}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kecamatan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.kecamatan}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kota</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.kota}</div>

                            <div className="font-semibold text-gray-400 mb-2">Status rumah</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.status_kepemilikan}</div>

                            <div className="font-semibold text-gray-400 mb-2">No HP</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.phone}</div>

                            <div className="font-semibold text-gray-400 mb-2">Email</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.email}</div>
                        </div>
                    </fieldset>

                    <fieldset 
                        className="border px-2 py-2 rounded-md cursor-pointer"
                    >
                        <legend className="font-bold">Pekerjaan</legend>
                        <div className="grid grid-cols-3 gap-1">
                            <div className="font-semibold text-gray-400 mb-2">Perusahaan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.pekerjaan?.name}</div>

                            <div className="font-semibold text-gray-400 mb-2">Alamat</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.pekerjaan?.alamat}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kelurahan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.pekerjaan?.kelurahan}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kecamatan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.pekerjaan?.kecamatan}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kota</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.pekerjaan?.kota}</div>

                            <div className="font-semibold text-gray-400 mb-2">Penghasilan</div>
                            <div className="mb-2 col-span-2">: {IntlCurrency(Konsumen?.pekerjaan?.penghasilan || 0)} / Perbulan</div>

                            <div className="font-semibold text-gray-400 mb-2">Tipe Penghasilan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.pekerjaan?.tipe_penghasilan}</div>

                            <div className="font-semibold text-gray-400 mb-2">Cicilan lain</div>
                            <div className="mb-2 col-span-2">: {IntlCurrency(Konsumen?.pekerjaan?.cicilan || 0)}</div>
                        </div>
                    </fieldset>

                    <fieldset 
                        className="border px-2 py-2 rounded-md cursor-pointer"
                    >
                        <legend className="font-bold">Perekomendasi</legend>
                        <div className="grid grid-cols-3 gap-1">
                            <div className="font-semibold text-gray-400 mb-2">Nama</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.rekomendasi?.name}</div>

                            <div className="font-semibold text-gray-400 mb-2">Perekomendasi</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.rekomendasi?.perekomendasi}</div>

                            <div className="font-semibold text-gray-400 mb-2">Hubungan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.rekomendasi?.relasi}</div>

                            <div className="font-semibold text-gray-400 mb-2">Alamat</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.rekomendasi?.alamat}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kelurahan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.rekomendasi?.kelurahan}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kecamatan</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.rekomendasi?.kecamatan}</div>

                            <div className="font-semibold text-gray-400 mb-2">Kota</div>
                            <div className="mb-2 col-span-2">: {Konsumen?.rekomendasi?.kota}</div>
                        </div>
                    </fieldset>
                </div>
            </div>        
        </>
    );
}