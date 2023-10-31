import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

export default function AdminRouter({
    RouteURL,
    profile,
    setProfile,
    token
}){
    const DashboardComponent = lazy(() => import('../components/admin/dashboardComponent'));
    const AdminMenu = lazy(() => import('../components/admin/menu/appmenu'));
    const AdminAccessControl = lazy(() => import('../components/admin/menu_access/accessControl'));
    const AdminUser = lazy(() => import('../components/admin/user/user'));
    const AdminUsergroup = lazy(() => import('../components/admin/usergroup/usergroup'));
    const AdminCategory = lazy(() => import('../components/admin/category/category'));
    const AdminProduct = lazy(() => import('../components/admin/product/product'));
    const AdminProfile = lazy(() => import('../components/admin/profile/adminProfile'));
    const AdminEditUser = lazy(() => import('./../components/admin/user/editUser'));
    const AdminInvestor = lazy(() => import('../components/admin/investor/investor'));
    const AdminSettings = lazy(() => import("../components/admin/setting/setting"));
    const AdminTransaksi = lazy(() => import('../components/admin/transaksi/transaksi'));
    const KreditKendaraan = lazy(() => import('../components/admin/kredit/kredit'));    
    return (
        <>
        <Suspense>
            <Routes>
                <Route path={RouteURL.DASHBOARD.PATH} element={<DashboardComponent 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.SETTINGS.PATH} element={<AdminSettings 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.MENU.PATH} element={<AdminMenu 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.MENU_ACCESS.PATH} element={<AdminAccessControl 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.USERS.PATH} element={<AdminUser 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.USERS.PATH+'/:id'} element={<AdminEditUser 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.USERGROUP.PATH} element={<AdminUsergroup 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.INVESTOR.PATH} element={<AdminInvestor 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.CATEGORY.PATH} element={<AdminCategory 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path={RouteURL.PRODUCT.PATH} element={<AdminProduct 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>

                <Route path={RouteURL.TRANSAKSI.PATH} element={<AdminTransaksi 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>

                <Route path={RouteURL.KREDIT.PATH} element={<KreditKendaraan 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
                <Route path='profile' element={<AdminProfile 
                    token={token}
                    RouteURL={RouteURL}
                    profile={profile}
                    setProfile={setProfile}
                />}></Route>
                
            </Routes>
        </Suspense>
        </>
    );
}