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
    },
    {
      title: 'Logout',
      path: '#',
      loginRequired: true,
      onclick: () => Logout()
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
                    const reqLogin = token[0] && token[0] != '' && token[0] != null ? true : false;
                    if(items.loginRequired == reqLogin){
                      return (
                        <Link 
                          key={index}
                          className="uppercase cursor-pointer px-2 py-2 hover:font-semibold" 
                          to={items.path}
                          onClick={('onclick' in items) ? items.onclick: ''}
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
                  <div className="sm:inline-block sm:w-1/5 sm:h-9 text-center mb-2">
                    <Link
                      className="text-3xl leading-3 text-teal-500 font-bold"
                    >
                      e-Grommerce
                    </Link>
                  </div>

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

                  <div className="sm:inline-block sm:w-1/5 sm:h-9">
                    <div className="hidden sm:flex w-full">
                      <button
                        className="font-semibold w-1/3 text-slate-500 hover:text-slate-700 text-lg"
                      >
                        {createIcon('shopping-cart', '')}
                        
                      </button>
                      <div
                        className="font-semibold w-2/3 cursor-pointer text-slate-500 hover:text-slate-700 text-lg"
                        onClick={()=>setToggleProfile(toggleProfile ? false: true)}
                      >
                        {createIcon('user', 'mr-1')}
                        Username
                      </div>
                    </div>
                  </div>

                </div>
              </div>
          </div>

          {/* SHOW ON MOBILE */}
          <div className="grid grid-cols-2 ml-5 text-2xl mr-5 sm:hidden">
              <div>
                <button
                  onClick={showSidebar}
                >
                  {createIcon('bars', 'text-slate-400 mr-3 hover:text-slate-700')}
                  Filter
                </button>
              </div>
              <div className="text-right">
                <button
                  onClick={()=>setToggleProfile(toggleProfile ? false: true)}
                >
                  {createIcon('bars', 'text-slate-400 hover:text-slate-700')}
                  
                </button>
              </div>
          </div>

          {/* PROFILE DROPDOWN */}
          {toggleProfile && (
            <div className="bg-white rounded-sm sm:absolute right-0 px-4 py-4 border border-slate-200 min-w-[200px]">
              <div className="text-slate-500 font-medium grid">
                <div className="mb-2">
                  {createIcon('newspaper', 'text-lg mr-2')}
                  <Link
                    to={''}
                    className="hover:font-bold"
                  >
                    PEMBELIAN
                  </Link>
                </div>
                <div className="mb-2">
                  {createIcon('heart', 'text-lg mr-2')}
                  
                  <Link
                    to={''}
                    className="hover:font-bold"
                  >
                    WISHLISH
                  </Link>
                </div>
                <div className="mb-2">
                  {createIcon('cog', 'text-lg mr-2')}
                  
                  <Link
                    to={''}
                    className="hover:font-bold"
                  >
                    PENGATURAN
                  </Link>
                </div>
                <div className="mb-2">
                  {createIcon('arrow-right-from-bracket', 'text-lg mr-2')}
                  <Link
                    to={''}
                    className="hover:font-bold"
                  >
                    LOGOUT
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
    </>
  );
}