import NavbarComponent from "../../components/admin/navbarComponents";
import NavbarLogo from '../../assets/images/logo/sdit.svg';
import AsideComponent from "../../components/admin/asideComponent";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FetchAdminMenu } from "../../hooks/adminMenuHooks";
import AdminRouter from "../../routes/adminRouter";
import Logout from "../../hooks/appLogout";

export default function AdminLayout({token, profile, RouteURL, setProfile}){
    if(!token && !profile){
        Logout();
    }

    const adminMenu = FetchAdminMenu(token);

    const AppMenu = adminMenu[0];
    return (
    <>
        <div id="admin">
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.DASHBOARD.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <AsideComponent AppMenu={AppMenu}/>
            <div className="relative">
                <NavbarComponent
                    navbarImg={NavbarLogo}
                    appTitle={'Laju Investama'}
                    appMenu={AppMenu}
                />
                <div className="relative lg:pt-24 pl-2 pb-32 pt-12 bg-gradient-to-br bg-teal-600 min-h-[689px]">
                    <div className="lg:ml-64 sm:ml-2">
                        {/* <Outlet context={token}/> */}
                        <AdminRouter
                            RouteURL={RouteURL}
                            profile={profile}
                            setProfile={setProfile}
                            token={token}
                        />
                    </div>
                </div>
            </div>
        </div>
    </> 
    )
};