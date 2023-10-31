import { Helmet, HelmetProvider } from "react-helmet-async";
import ProductComponent from "./fragment/productComponent";

export default function AdminProduct({
    token,
    RouteURL
}){
    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.PRODUCT.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-2xl text-white font-semibold py-2 border-b border-white">
                            {RouteURL.PRODUCT.HELMET.title}
                        </h3>
                    </div>
                </div>
                <div className="flex-auto">
                    <ProductComponent 
                        token={token}
                    />
                </div>
            </div>
        </>
    )
}