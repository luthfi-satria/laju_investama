import { IntlCurrency } from './../../../helpers/converterHelper';
import defaultProductImg from '../../../assets/images/noproduct_img.png';

export default function ProductCard({
    productData,
    CreateIcon,
}){
    const baseUrl = import.meta.env.VITE_APIURL;

    const convImg = (data) => {
        return data?.image ? baseUrl+'/api/product/image/'+data.id+'/'+data.name : defaultProductImg;
    }
    return(
        <>
        <div className="bg-gray h-auto flex items-center justify-center mt-3">
            <div id="id1" className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#" className=''>
                    <div className="grid grid-cols-1">
                        <div className="bg-gray-50 h-full rounded-md flex items-center justify-center">
                            <img 
                                src={convImg(productData)}
                                alt={productData?.name}
                                className={'min-h-[222px]'}
                            />
                        </div>
                    </div>
                </a>
                <div className="px-5 pb-5">
                    <a href="#">
                        <h5 className="text-lg mt-2 font-semibold tracking-tight text-gray-900 dark:text-white truncate">
                            {productData?.name}
                        </h5>
                    </a>
                    
                    <div className="flex items-center justify-between mt-5">
                        <div className="w-full text-right text-xl font-bold text-gray-500 dark:text-white">
                            {IntlCurrency(productData?.harga_jual)}
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <button
                            className='text-white ring-1 ring-teal-500 bg-teal-500 w-1/2 px-2 py-2 mt-2 hover:bg-teal-600'
                        >
                            {CreateIcon('shopping-cart','mr-2')}
                            Cart
                        </button>
                        <button
                            className='text-gray ring-1 ring-slate-400 bg-white w-1/2 px-2 py-2 mt-2 hover:bg-slate-200'
                        >
                            {CreateIcon('heart','text-red-500 mr-2')}
                            Wish
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}