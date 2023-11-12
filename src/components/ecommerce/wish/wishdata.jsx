import imgDefault from '../../../assets/images/noproduct_img.png';
import { IntlCurrency } from '../../../helpers/converterHelper';

export default function WishDataComponent(
    {
        wishData,
        deleteWish,
        CreateIcon,
        moveItem,
    }
){

    const convImg = (data) => {
        const baseUrl = import.meta.env.VITE_APIURL;
        return data?.image ? baseUrl+'/api/product/'+data.id+'/image/'+data.image : imgDefault;
    }
        
    return (
        <>
            {/* CART CONTENT */}
            <div id="detailCart" className="relative col-span-2">
                <div id="cartContainer" className="relative px-2 py-2">
                    <div id="detailCart-title">
                        <h2 className="font-bold text-lg text-gray-500 mb-8">WISHLIST</h2>
                        {/* ITEM LIST */}
                        {wishData && wishData?.map((items, index) => (
                            <div 
                                id={`cartItem${index}`}
                                key={index}
                                className="flex w-full mt-2 border-b border-b-gray-200 pb-4">
                                <div className="items-center content-center w-30 sm:w-44 h-18 bg-gray-100 rounded-md">
                                    <img src={convImg(items?.product)} title={items?.product?.name} />
                                </div>
                                <div className="ml-5 w-1/2">
                                    <div className="text-md mb-1">{items?.product?.name}</div>
                                    <div className="text-lg font-bold mb-1">{IntlCurrency(items?.product?.harga_jual)}</div>
                                    <div className="text-md font-semibold mb-1 text-gray-500">Sisa: {items?.product?.stok - items?.product?.min_stok} unit</div>
                                    <div className="mt-5 w-full flex items-start justify-stretch">
                                        <button type="button"
                                            className="mr-2 text-xs bg-red-500 text-white ring-1 ring-red-400 px-4 py-2 rounded-md hover:bg-red-600"
                                            onClick={() => deleteWish(index)}
                                        >
                                            <div className="inline-block mr-2">
                                                {CreateIcon('trash','text-white text-sm')}
                                            </div>
                                            <div className="inline-block">
                                                Hapus
                                            </div>
                                        </button>
                                        <button type="button"
                                            className="text-xs text-gray-500 ring-1 ring-gray-400 px-4 py-2 rounded-md hover:bg-gray-200"
                                            onClick={() => moveItem(items?.product_id)}
                                        >
                                            <div className="inline-block mr-2">
                                                {CreateIcon('heart-circle-plus','text-red-500 text-sm')}
                                            </div>
                                            <div className="inline-block">
                                                Keranjang
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>                   
        </>
    );
}