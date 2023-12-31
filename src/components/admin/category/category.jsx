import { Helmet, HelmetProvider } from "react-helmet-async";
import CategoryComponent from "./fragment/categoryComponent";

export default function AdminCategory({
    token,
    RouteURL,
}){

    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.CATEGORY.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-2xl text-white font-semibold py-2 border-b border-white">
                            {RouteURL.CATEGORY.HELMET.title}
                        </h3>
                    </div>
                </div>
                <div className="flex-auto">
                    <CategoryComponent 
                        token={token}
                    />
                </div>
            </div>
        </>
    )
}