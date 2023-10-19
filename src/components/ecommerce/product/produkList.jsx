import ProductCard from "./productCard";
import ProductNotFound from '../../../assets/images/product_notfound.png';
import ShowSweetAlert from "../../../helpers/showAlert";
import { useNavigate } from "react-router-dom";

export default function ProductList({
    Product,
    CreateIcon,
    IsLoading,
    AxiosRequest,
    TotalCart,
    SetTotalCart,
    profile,
}){
    const navigate = useNavigate();
    const addToCart = (items) => {
        if(!profile){
            navigate('/login',{replace:true})
        }
        else{
            AxiosRequest('post','api/cart',{}, {
                product_id: items?.id,
                qty: 1,
            })
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw data;
                }
                SetTotalCart(TotalCart + 1);
                ShowSweetAlert({
                    icon: 'success',
                    title: 'Sukses',
                    text: 'item sudah masuk keranjang'
                });
            });
        }
    }

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {Product && Product.total > 0 && Product?.items.map((items, index)=>(
                                <ProductCard
                                    key={index}
                                    productData={items}
                                    CreateIcon={CreateIcon}
                                    AddToCart={addToCart}
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