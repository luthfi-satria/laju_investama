import { useOutletContext } from "react-router-dom"
import ProductList from "../../components/ecommerce/product/produkList";

export default function HomePage(){
    const {
        orderProduct,
        profile, 
        product, 
        setProduct, 
        CreateIcon, 
        IsLoading, 
        AxiosRequest,
        TotalCart,
        SetTotalCart,
    } = useOutletContext();
    return(
        <>
            <div 
                id="main_display"
                className="mt-44 -ml-1 sm:mt-32 sm:ml-[15rem] lg:ml-[21rem] px-4 py-4 h-full min-h-screen"
            >
                {/* ORDER SECTION */}
                <div
                    className="text-right border-b-[1px] border-b-slate-200 px-4 py-[14px] sm:py-2"
                >
                    Urut berdasarkan: 
                    <select
                        id="sortby"
                        name="urutan"
                        className="ml-2 ring-1 ring-slate-200 px-3 py-2 rounded-md hover:bg-slate-200"
                        onChange={(e) => orderProduct(e.target.value)}
                    >
                        <option>Paling Sesuai</option>
                        <option value={'harga_terendah'}>Harga Terendah</option>
                        <option value={'harga_tertinggi'}>Harga Tertinggi</option>
                    </select>
                </div>

                <ProductList
                    Product={product}
                    SetProductList={setProduct}
                    CreateIcon={CreateIcon}
                    IsLoading={IsLoading}
                    AxiosRequest={AxiosRequest}
                    TotalCart={TotalCart}
                    SetTotalCart={SetTotalCart}
                    profile={profile}
                />
            </div>
        </>
    )
}