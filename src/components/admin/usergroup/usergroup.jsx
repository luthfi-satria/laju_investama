import { Helmet, HelmetProvider } from "react-helmet-async";
import UsergroupComponent from "./fragment/usergroupComponent";

export default function AdminUsergroup({
    token,
    RouteURL,
}){
    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.USERGROUP.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
            <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-3 text-2xl text-white font-semibold py-2 border-b border-white">
                            {RouteURL.USERGROUP.HELMET.title}
                        </h3>
                    </div>
                </div>
                <div className="flex-auto">
                    <UsergroupComponent token={token}/>
                </div>
            </div>
        </>
    )
}