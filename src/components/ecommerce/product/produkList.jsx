import ProductCard from "./productCard";
import ProductNotFound from '../../../assets/images/product_notfound.png';

export default function ProductList({
    Product,
    CreateIcon,
    IsLoading
}){
    return(
        <>
            <div id="ProductList">
                {IsLoading && (
                    <div className="bg-white opacity-80 z-50 w-full h-full fixed top-32 flex items-center justify-center">
                        <div className="w-1/3 text-black font-bold text-2xl">
                            LOADING...
                        </div>
                    </div>
                )}
                <div className="relative overflow-hidden mb-8">
                    <div 
                        className="overflow-hidden bg-white p-8"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            {Product && Product.total > 0 && Product?.items.map((items, index)=>(
                                <ProductCard
                                    key={index}
                                    productData={items}
                                    CreateIcon={CreateIcon}
                                />
                            ))} 
                        </div>
                        {Product && Product.total == 0 && (
                            <div className="grid">
                                <div className="px-4 py-5 text-md font-semibold rounded-md flex items-center justify-center">
                                    <img
                                        src={ProductNotFound}
                                        alt="Maaf, produk tidak ditemukan"
                                        className="h-[20rem] w-auto block"
                                    />
                                </div>
                                <div className="text-2xl text-center text-gray-400 font-semibold">
                                    Maaf, produk tidak ditemukan
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}