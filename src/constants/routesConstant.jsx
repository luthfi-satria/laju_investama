const RouteURL = {
    LOGIN: {
        PATH: '/login',
        HELMET: {
            title: 'LOGIN USER',
        },
        AUTHORIZE: false,
    },
    HOMEPAGE: {
        PATH: '/',
        HELMET: {
            title: 'HOMEPAGE',
        },
        AUTHORIZE: false,
    },
    DASHBOARD: {
        PATH: '/dashboard',
        HELMET: {
            title: 'ADMIN',
        },
        AUTHORIZE: true,
    },
        SETTINGS: {
            PATH: '/dashboard/setting',
            HELMET: {
                title: 'Setting'
            },
            AUTHORIZE: true,
        },
        MENU: {
            PATH: '/dashboard/menu',
            HELMET: {
                title: 'Menu'
            },
            AUTHORIZE: true,
        },
        MENU_ACCESS: {
            PATH: '/dashboard/menu_access',
            HELMET: {
                title: 'Kontrol Akses'
            },
            AUTHORIZE: true,
        },
        USERGROUP: {
            PATH: '/dashboard/usergroup',
            HELMET: {
                title: 'Grup User'
            },
            AUTHORIZE: true,
        },
        USERS: {
            PATH: '/dashboard/user',
            HELMET: {
                title: 'user'
            },
            AUTHORIZE: true,
        },
        ADD_USERS: {
            PATH: '/dashboard/user/add',
            HELMET: {
                title: 'Add User'
            },
            AUTHORIZE: true,
        },
        PRODUCT: {
            PATH: '/dashboard/product',
            HELMET: {
                title: 'Produk'
            },
            AUTHORIZE: true,
        },
        CATEGORY: {
            PATH: '/dashboard/category',
            HELMET: {
                title: 'Kategori Produk'
            },
            AUTHORIZE: true,
        },
    REGISTER: {
        PATH: '/register',
        HELMET: {
            title: 'REGISTER',
        },
        AUTHORIZE: false,
    },
    FORGOT_PASSWORD: {
        PATH: '/forgot-password',
        HELMET: {
            title: 'FORGOT PASSWORD',
        },
        AUTHORIZE: false,
    }
}
export default RouteURL;