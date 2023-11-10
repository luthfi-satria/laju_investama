import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
export default function AsideComponent({AppMenu}){
    library.add(fas);

    const [subMenu, setSubMenu] = useState('');
    const urlpath = useLocation().pathname;
    
    const issetIcon = (icon) => {
        return icon != null ? (<FontAwesomeIcon icon={icon} className='text-center w-5 text-sm opacity-75'/>): '';
    }

    function asideTree(items, parent = null){
        const result = [];
        for(const a of items){
            if(a && a.menus.parent_id == parent){
                const child = asideTree(items, a.menus.id);
                const linkProp = {
                    key: a.menus.name, 
                    href: a.menus.api_url,
                    title: a.menus.label,
                    onClick: () => setSubMenu('child_'+a.menus.name),
                };
                if(child != ''){
                    linkProp.href = '#';
                }else{
                    delete linkProp.onClick;
                }
                result.push(
                    <li key={a.menus.id} className='mt-2 flex items-center px-4 duration-300 cursor-pointer hover:bg-teal-600'>
                        <a 
                            {...linkProp}
                            className="flex w-full py-2 items-center text-xs"
                        >
                            {issetIcon(a.menus.icon)}
                            <span className='text-[15px] ml-2 overflow-hidden text-ellipsis whitespace-nowrap'>
                                {a.menus.label}
                            </span>
                        </a>
                        {child != '' && (
                            <span className='text-sm w-5 text-right py-2' onClick={()=>setSubMenu('child_'+a.menus.name)}>
                                {issetIcon(subMenu == 'child_'+a.menus.name ? 'chevron-down' : 'chevron-right')}
                            </span>
                        )}
                    </li>
                );

                {child != '' && result.push(
                    <ul 
                        key={'child_'+a.menus.name} 
                        className={`text-sm mt-2 w-full pl-10 ${subMenu == 'child_'+a.menus.name ? '': 'hidden'}`}>
                            <li key={a.menus.id} className='mt-2 flex items-center px-4 duration-300 cursor-pointer hover:bg-teal-600'>
                                <a 
                                key={a.menus.name}
                                href={a.menus.api_url}
                                className="flex w-3/4 py-2 items-center text-xs"
                                title={a.menus.label}
                                >
                                    {issetIcon(a.menus.icon)}
                                    <span className='text-[15px] ml-2 overflow-hidden text-ellipsis whitespace-nowrap'>
                                        {a.menus.label}
                                    </span>
                                </a>
                            </li>
                        {child}
                    </ul>
                )}

            }
        }
        return result;
    }

    return(
        <>
            {/* aside component */}
            <aside id="logo-sidebar" className="lg:left-0 lg:block lg:fixed lg:top-0 lg:bottom-0 lg:overflow-y-auto lg:flex-row lg:flex-nowrap lg:overflow-hidden shadow-xl bg-teal-500 flex flex-wrap items-center justify-between relative lg:w-64 z-10 py-4" aria-label="Sidebar">
                <div className="lg:flex lg:flex-col lg:items-stretch lg:opacity-100 lg:relative lg:mt-4 lg:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded hidden">
                    <hr className="mt-7 pt-2 lg:min-w-full"/>
                    <h6 className="lg:min-w-full text-white text-sm uppercase font-bold block px-4 pt-1 pb-4 no-underline">Admin Dashboard</h6>
                    <ul className="sidebar lg:left-0 w-full overflow-y-auto text-white">
                        <li className='mt-2 flex items-center px-4 duration-300 cursor-pointer hover:bg-teal-600'>
                            <Link
                                to={''}
                                className='flex w-full py-2 items-center text-xs'
                                title='dashboard'
                                replace={true}
                            >
                                <FontAwesomeIcon icon={'home'} className='text-center w-5 text-sm opacity-75' />
                                <span
                                    className='text-[15px] ml-2 overflow-hidden text-ellipsis whitespace-nowrap'
                                >
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        {AppMenu && asideTree(AppMenu)}
                    </ul>
                </div>
            </aside>
        </>
    )
}