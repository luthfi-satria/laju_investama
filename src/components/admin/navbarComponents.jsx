import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import NavbarConstant from "../../constants/admin/navbarConstant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
export default function NavbarComponent({
    navbarImg,
    appTitle,
    appMenu
}){
    const navbarFields = NavbarConstant;
    return(
        <>
            {/* navbar component */}
            <Disclosure as="nav" className="bg-gradient-to-r bg-teal-950 fixed top-0 z-50 w-full text-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            {({ open }) => (
                <>
                <div id='mynavbar' className="mx-auto max-w-7xl px-2 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                        {/* Mobile menu button*/}
                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                        </Disclosure.Button>
                    </div>
                    <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img
                                className="h-8 w-auto"
                                src={navbarImg}
                                alt={appTitle}
                            />
                            <span className="text-bold capitalize font-semibold leading-2 text-lg text-yellow-200 tracking-widest">
                                {appTitle}
                            </span>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                        <button
                        type="button"
                        className="relative rounded-md px-2 py-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                        <div>
                            <Menu.Button className="relative rounded-md px-3 py-2 text-lg text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                                <FontAwesomeIcon icon="gear"/>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items id="myProfile" className="absolute text-xs right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-teal-950 text-yellow-300 py-1 shadow-lg shadow-teal-500 ring-1 ring-teal-500 ring-opacity-5 focus:outline-none">
                                {navbarFields.map((item) => (
                                    <Menu.Item key={item.name}>
                                        <a 
                                            href={('onclick' in item) ? '#' : item.url} 
                                            className={classNames('block uppercase px-4 py-2 tracking-widest hover:bg-teal-500 hover:text-white')}
                                            onClick={('onclick' in item) ? item.onclick : ''}
                                        >
                                            {item.label}
                                        </a>
                                    </Menu.Item>
                                ))}
                            </Menu.Items>
                        </Transition>
                        </Menu>
                    </div>
                    </div>
                </div>

                <Disclosure.Panel className="lg:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                    {appMenu && appMenu.map((item) => (
                        item &&
                        <Disclosure.Button
                        key={item.menus.id}
                        as="a"
                        href={item.menus.api_url}
                        className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current='page'
                        >
                        {item.menus.label}
                        </Disclosure.Button>
                    ))}
                    </div>
                </Disclosure.Panel>
                </>
            )}
            </Disclosure>
        </>
    )
}