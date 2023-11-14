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
                <div className="flex flex-wrap items-center mb-10">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-2xl text-white font-semibold py-2 border-b border-white">
                            HIERARKI MENU
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