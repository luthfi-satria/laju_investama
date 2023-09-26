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
            title: 'Portal Admin',
        },
        AUTHORIZE: true,
    },
        SETTINGS: {
            PATH: '/dashboard/setting',
            HELMET: {
                title: 'Pengaturan Sistem'
            },
            AUTHORIZE: true,
        },
        MENU: {
            PATH: '/dashboard/menu',
            HELMET: {
                title: 'Kelola Menu'
            },
            AUTHORIZE: true,
        },
        MENU_ACCESS: {
            PATH: '/dashboard/menu_access',
            HELMET: {
                title: 'Kelola Kontrol Akses'
            },
            AUTHORIZE: true,
        },
        USERGROUP: {
            PATH: '/dashboard/usergroup',
            HELMET: {
                title: 'Kelola Grup User'
            },
            AUTHORIZE: true,
        },
        USERS: {
            PATH: '/dashboard/user',
            HELMET: {
                title: 'Kelola User'
            },
            AUTHORIZE: true,
        },
        ADD_USERS: {
            PATH: '/dashboard/user/add',
            HELMET: {
                title: 'Tambah User Baru'
            },
            AUTHORIZE: true,
        },
        INVESTOR: {
            PATH: '/dashboard/investor',
            HELMET: {
                title: 'Kelola Investor'
            },
            AUTHORIZE: true,
        },
        PRODUCT: {
            PATH: '/dashboard/product',
            HELMET: {
                title: 'Kelola Produk'
            },
            AUTHORIZE: true,
        },
        TRANSAKSI: {
            PATH: '/dashboard/transaksi',
            HELMET: {
                title: 'Kelola Transaksi'
            },
            AUTHORIZE: true,
        },
        KREDIT: {
            PATH: '/dashboard/kredit',
            HELMET: {
                title: 'Kelola Pengajuan Kredit'
            },
            AUTHORIZE: true,
        },
        CATEGORY: {
            PATH: '/dashboard/category',
            HELMET: {
                title: 'Kelola Kategori Produk'
            },
            AUTHORIZE: true,
        },
        REPORT: {
            PATH: '/dashboard/report',
            HELMET: {
                title: 'Laporan'
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