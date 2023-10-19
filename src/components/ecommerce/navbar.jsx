import { useState } from "react";
import { Link } from "react-router-dom";
import Logout from "../../hooks/appLogout";

export default function CommerceNavbar({
  token,
  search,
  setSearch,
  createIcon,
  showSidebar,
  setRefreshProduct,
  profile,
  totalCart,
  RouteURL,
  currentPath,
}){
  const headerNavLink = [
    {
      title: 'Register',
      path: 'register',
      loginRequired: false,
    },
    {
      title: 'Login',
      path: 'login',
      loginRequired: false,
    },
    {
      title: 'Dashboard',
      path: 'dashboard',
      loginRequired: true,
      target: '_blank',
      allowedUserLevel: ['owner']
    },
    {
      title: 'Logout',
      path: '#',
      loginRequired: true,
      onclick: () => Logout(),
      allowedUserLevel: ['owner','organisasi','public']
    }
  ];

  const [toggleProfile, setToggleProfile] = useState(false);
  return (
    <>
        <div className="fixed bg-white top-0 w-full z-30 border-b border-slate-200 pb-3" id="mainav">
          {/* HEADER BAR */}
          <div className="relative bg-white z-40">

              {/* HEADER NAV */}
              <div className="mx-0 bg-gray-200 my-auto text-right">
                <div className="relative inline-block text-xs leading-6 text-left whitespace-nowrap px-0 py-2">
                  {headerNavLink.map((items, index)=>{
                    const reqLogin = token && token != '' ? true : false;
                    if(items.loginRequired == reqLogin && (items?.allowedUserLevel && profile && items?.allowedUserLevel.includes(profile?.level))){
                      return (
                        <Link 
                          key={index}
                          className="uppercase cursor-pointer px-2 py-2 hover:font-semibold" 
                          to={items.path}
                          onClick={('onclick' in items) ? items.onclick: ''}
                          target={items.target || ''}
                          > 
                          {items.title}
                        </Link>
                      );
                    }
                  })}
                </div>
              </div>
              
              {/* LOGOBAR */}
              <div className="playfair-reg box-border py-3 sm:h-20">
                <div className="relative mx-0 my-auto w-full">
                  {/* LOGO */}
                  <div className="sm:inline-block sm:w-1/5 sm:h-9 text-center mb-2 px-4 py-4">
                    <Link
                      to={RouteURL.HOMEPAGE.PATH}
                      className="text-3xl leading-3 text-teal-500 font-bold"
                    >
                      e-Grommerce
                    </Link>
                  </div>

                  {currentPath.pathname == '/' && (
                    <div className="sm:inline-block sm:w-3/5 px-5 sm:h-9 text-center">
                      <input
                        type="text"
                        name="src"
                        className="ring-1 ring-gray-300 px-2 py-3 w-4/5 outline-none"
                        onChange={(e) => setSearch({...search, name: e.target.value})}
                      />
                      <button
                        className="bg-teal-500 px-4 py-3 rounded-e-md hover:bg-teal-700"
                        onClick={()=> {
                          setSearch({...search, page: 1});
                          setRefreshProduct(true);
                        }}
                      >
                        {createIcon('magnifying-glass', 'text-white text-base leading-3')}
                        
                      </button>
                    </div>
                  )}

                  {token && profile && (
                    <div className="float-right clear-both px-4 py-4 sm:inline-block sm:w-1/5 sm:h-9">
                      <div className="hidden sm:flex w-full">
                        <Link
                          to={RouteURL.CART.PATH}
                          className="font-semibold w-1/3 text-slate-500 hover:text-slate-700 text-lg"
                        >
                          {createIcon('shopping-cart', '')}

                          {/* TOTAL CART */}
                          {totalCart && totalCart > 0 ? (
                            <span className="px-1 py-1 bg-red-500 text-white absolute top-0 h-5 rounded-sm text-xs">
                              {totalCart}
                            </span>
                          ) : ''}
                        </Link>
                        <div
                          className="font-semibold w-2/3 cursor-pointer text-slate-500 hover:text-slate-700 text-lg overflow-hidden text-ellipsis whitespace-nowrap"
                          onClick={()=>setToggleProfile(toggleProfile ? false: true)}
                          title={profile?.username || ''}
                        >
                          {profile?.image ? (
                            <img 
                              src={import.meta.env.VITE_APIURL+`/api/user/${profile?.image}`}
                            />
                          ): (createIcon('user', 'mr-1'))}
                          {profile?.username ? profile.username.substring(0,6) : 'Username'}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
          </div>

          {/* SHOW ON MOBILE */}
          <div className="grid grid-cols-2 ml-5 text-2xl mr-5 sm:hidden">
              <div>
                {currentPath == '/' && (
                  <button
                    onClick={showSidebar}
                  >
                    {createIcon('bars', 'text-slate-400 mr-3 hover:text-slate-700')}
                    Filter
                  </button>
                )}
              </div>
              {token && profile && (
                <div className="text-right">
                  <button
                    onClick={()=>setToggleProfile(toggleProfile ? false: true)}
                  >
                    {createIcon('bars', 'text-slate-400 hover:text-slate-700')}
                    
                  </button>
                </div>
              )}
          </div>

          {/* PROFILE DROPDOWN */}
          {token && profile && toggleProfile && (
            <div className="bg-white rounded-sm sm:absolute right-0 px-4 py-4 border border-slate-200 min-w-[200px]">
              <div className="text-slate-500 font-medium grid">
                <div className="mb-5">
                  {createIcon('newspaper', 'text-lg mr-2')}
                  <Link
                    to={RouteURL.ORDER.PATH}
                    className="hover:font-bold"
                  >
                    PEMBELIAN
                  </Link>
                </div>
                <div className="mb-5">
                  {createIcon('heart', 'text-lg mr-2')}
                  
                  <Link
                    to={RouteURL.WISHLIST.PATH}
                    className="hover:font-bold"
                  >
                    WISHLIST
                  </Link>
                </div>
                <div className="mb-5">
                  {createIcon('cog', 'text-lg mr-2')}
                  
                  <Link
                    to={RouteURL.PENGATURAN.PATH}
                    className="hover:font-bold"
                  >
                    PENGATURAN
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
    </>
  );
}