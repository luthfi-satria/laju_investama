import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NumericalOnly } from "../../helpers/converterHelper";

export default function EcommerceSidebar({
    createIcon,
    Category,
    Search,
    SetSearch,
    ToggleSidebar,
    ShowSidebar,
    setRefreshProduct,
    ResetFilter
}){
    return (
        <>
            <div className={`${ToggleSidebar ? '': 'hidden '}bg-white fixed w-3/4 md:block md:fixed left-0 top-0 z-10 py-30 sm:w-2/5 md:w-1/3 lg:w-1/5 h-full ring-1 ring-slate-200`}>
                <div className="w-full bg-white px-4 pb-4 pl-2 mt-36 sm:mt-32 md:mt-28">
                    <div className="md:hidden w-full text-right text-slate-500">
                        <button
                            type="button"
                            onClick={() => ShowSidebar()}
                            className="pt-5 text-xl hover:text-slate-700"
                        >
                            <FontAwesomeIcon icon={'close'} />
                        </button>
                    </div>
                    {/* CARI */}
                    <h3 className="font-bold text-slate-500 text-xl py-3">
                        CARI PRODUK
                    </h3>
                    <div className="w-full mb-3 sm:h-9 text-center">
                        <input
                            type="text"
                            name="src"
                            className="w-full ring-1 ring-gray-300 px-2 py-2 outline-none"
                            value={Search?.name}
                            onChange={(e) => SetSearch({...Search, name: e.target.value})}
                            placeholder="Cari produk..."
                        />
                    </div>
                    {/* KATEGORI */}
                    <h3 
                        className="font-bold text-slate-500 text-xl border-b border-b-gray-300 py-3 cursor-pointer"
                        onClick={()=>{
                            document.getElementById('category-list').classList.toggle('hidden');
                        }}
                    >
                        KATEGORI
                        <div 
                            className="float-right mr-5"
                        >
                            {createIcon('chevron-down', 'text-sm')}
                        </div>
                    </h3>
                    <div id="category-list" className="hidden px-2 py-4 max-h-60 overflow-auto">
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
                                            checked={Search?.category_id?.includes(item.id) ? true : false}
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
                    <h3 
                        className="font-bold text-slate-500 text-xl border-b border-b-gray-300 py-3 cursor-pointer"
                        onClick={()=>{
                            document.getElementById('filter-price').classList.toggle('hidden');
                        }}
                    >
                        HARGA
                        <div 
                            className="float-right mr-5"
                        >
                            {createIcon('chevron-down', 'text-sm')}
                        </div>
                    </h3>
                    <div id="filter-price" className="hidden text-gray-500">
                        <div className="grid">
                            <div className="mt-5">
                                <span className="w-1/5 font-bold bg-gray-200 py-[9px] px-2 border border-slate-400 rounded-s-md">
                                    Rp.
                                </span>
                                <input
                                    type="text"
                                    id="src-harga-min"
                                    name="min_harga"
                                    className="w-4/5 ring-1 ring-slate-400 outline-none py-[7px] px-2"
                                    value={Search?.harga_min}
                                    placeholder="1000"
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
                                    placeholder="10000"
                                    value={Search?.harga_max}
                                    onChange={(e) => {
                                        e.target.value = NumericalOnly(e.target.value);
                                        SetSearch({...Search, harga_max: Number(e.target.value)})
                                    }}                            
                                    />
                            </div>
                        </div>
                    </div>

                    {/* FILTER BUTTON */}
                    <div className="w-full text-center mt-5 -ml-2">
                        <button
                            className="bg-teal-500 px-4 py-2 rounded-sm text-white ring-1 ring-teal-600 mr-4 hover:bg-teal-600"
                            onClick={()=> {
                                SetSearch({...Search, page: 1});
                                setRefreshProduct(true);
                                ShowSidebar();
                            }}
                        >
                            Cari
                        </button>
                        <button
                            className="bg-white ring-1 ring-slate-400 rounded-sm px-4 py-2 hover:bg-gray-200"
                            onClick={() => {
                                ResetFilter();
                                ShowSidebar();
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}