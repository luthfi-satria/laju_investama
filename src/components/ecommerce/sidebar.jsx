import { NumericalOnly } from "../../helpers/converterHelper";

export default function EcommerceSidebar({
    createIcon,
    Category,
    Search,
    SetSearch,
    ToggleSidebar,
    setRefreshProduct,
    ResetFilter
}){
    return (
        <>
            <div className={`${ToggleSidebar ? '': 'hidden'} bg-white fixed w-full sm:block sm:fixed left-0 top-0 z-20 py-30 sm:w-1/4 h-full ring-1 ring-slate-200`}>
                <div className="w-full bg-white pb-4 pl-4 mt-[189px] sm:mt-36">
                    {/* KATEGORI */}
                    <h3 className="font-bold text-slate-500 text-xl border-b border-b-gray-300 py-3">
                        KATEGORI
                        <div 
                            className="float-right cursor-pointer mr-5"
                            onClick={()=>{
                                document.getElementById('category-list').classList.toggle('hidden');
                            }}
                        >
                            {createIcon('chevron-down', 'text-sm')}
                        </div>
                    </h3>
                    <div id="category-list" className="px-2 py-4 max-h-60 overflow-auto">
                        <ul className="text-gray-500 text-lg">
                            <li className="mt-2 cursor-pointer">
                                <a
                                    className="hover:text-gray-700"
                                >Semua Kategori</a>
                            </li>
                            {Category?.items?.map((item, index) => (
                                <li key={index} className="mt-2 cursor-pointer">
                                    <label
                                        className="hover:text-gray-700 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`src_cat_${index}`}
                                            name={`cat_${item.name}`}
                                            className="mr-2"
                                            value={item.id}
                                            onChange={(e) => {
                                                let category = Search?.category_id;
                                                if(e.target.checked){
                                                    category.push(Number(e.target.value));
                                                }
                                                else{
                                                    const position = category.indexOf(e.target.value);
                                                    category.splice(position, 1);
                                                }
                                                SetSearch({...Search, category_id: category});
                                            }}
                                        />
                                        {item.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* HARGA */}
                    <h3 className="font-bold text-slate-500 text-xl border-b border-b-gray-300 py-3">
                        HARGA
                        <div 
                            className="float-right cursor-pointer mr-5"
                            onClick={()=>{
                                document.getElementById('filter-price').classList.toggle('hidden');
                            }}
                        >
                            {createIcon('chevron-down', 'text-sm')}
                        </div>
                    </h3>
                    <div id="filter-price" className="grid text-gray-500">
                        <div className="mt-5">
                            <span className="w-1/5 font-bold bg-gray-200 py-[9px] px-2 border border-slate-400 rounded-s-md">
                                Rp.
                            </span>
                            <input
                                type="text"
                                id="src-harga-min"
                                name="min_harga"
                                className="w-4/5 ring-1 ring-slate-400 outline-none py-[7px] px-2"
                                onChange={(e) => {
                                    e.target.value = NumericalOnly(e.target.value);
                                    SetSearch({...Search, harga_min: Number(e.target.value)})
                                }}
                            />
                        </div>
                        <div className="mt-5">
                            <span className="w-1/5 font-bold bg-gray-200 py-[9px] px-2 border border-slate-400 rounded-s-md">
                                Rp.
                            </span>
                            <input
                                type="text"
                                id="src-harga-max"
                                name="max_harga"
                                className="w-4/5 ring-1 ring-slate-400 outline-none py-[7px] px-2"
                                onChange={(e) => {
                                    e.target.value = NumericalOnly(e.target.value);
                                    SetSearch({...Search, harga_max: Number(e.target.value)})
                                }}                            
                                />
                        </div>
                    </div>

                    {/* FILTER BUTTON */}
                    <div className="w-full text-center mt-5 -ml-2">
                        <button
                            className="bg-teal-500 px-4 py-2 rounded-sm text-white ring-1 ring-teal-600 mr-4 hover:bg-teal-600"
                            onClick={()=> {
                                SetSearch({...Search, page: 1});
                                setRefreshProduct(true);
                            }}
                        >
                            Cari
                        </button>
                        <button
                            className="bg-white ring-1 ring-slate-400 rounded-sm px-4 py-2 hover:bg-gray-200"
                            onClick={() => ResetFilter()}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}