import { Helmet, HelmetProvider } from "react-helmet-async";
import AppmenuComponent from "./fragment/appmenuComponent";

export default function AdminMenu({
    token,
    RouteURL
}){
    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.MENU.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center max-w-fit">
                    <div className="relative w-full max-w-full flex-grow flex-1 border-2 border-white px-4 py-4">
                        <h3 className="uppercase text-blueGray-400 text-sm text-white font-semibold">
                        {RouteURL.MENU.HELMET.title}
                        </h3>
                    </div>
                </div>
                <div className="px-4 flex-auto">
                    <AppmenuComponent token={token}/>
                </div>
            </div>
        </>
    )
}