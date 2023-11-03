const RouteURL = {
    LOGIN: {
        PATH: 'login',
        HELMET: {
            title: 'LOGIN USER',
        },
        AUTHORIZE: false,
    },
    HOMEPAGE: {
        PATH: '',
        HELMET: {
            title: 'HOMEPAGE',
        },
        AUTHORIZE: false,
    },
    DASHBOARD: {
        PATH: '',
        HELMET: {
            title: 'Portal Admin',
        },
        AUTHORIZE: true,
    },
        SETTINGS: {
            PATH: 'setting',
            HELMET: {
                title: 'Pengaturan Sistem'
            },
            AUTHORIZE: true,
        },
        MENU: {
            PATH: 'menu',
            HELMET: {
                title: 'Kelola Menu'
            },
            AUTHORIZE: true,
        },
        MENU_ACCESS: {
            PATH: 'menu_access',
            HELMET: {
                title: 'Kelola Kontrol Akses'
            },
            AUTHORIZE: true,
        },
        USERGROUP: {
            PATH: 'usergroup',
            HELMET: {
                title: 'Kelola Grup User'
            },
            AUTHORIZE: true,
        },
        USERS: {
            PATH: 'user',
            HELMET: {
                title: 'Kelola User'
            },
            AUTHORIZE: true,
        },
        ADD_USERS: {
            PATH: 'user/add',
            HELMET: {
                title: 'Tambah User Baru'
            },
            AUTHORIZE: true,
        },
        INVESTOR: {
            PATH: 'investor',
            HELMET: {
                title: 'Kelola Investor'
            },
            AUTHORIZE: true,
        },
        PRODUCT: {
            PATH: 'product',
            HELMET: {
                title: 'Kelola Produk'
            },
            AUTHORIZE: true,
        },
        TRANSAKSI: {
            PATH: 'transaksi/*',
            HELMET: {
                title: 'Kelola Transaksi'
            },
            AUTHORIZE: true,
        },
        KREDIT: {
            PATH: 'kredit/*',
            HELMET: {
                title: 'Kelola Pengajuan Kredit'
            },
            AUTHORIZE: true,
        },
        CATEGORY: {
            PATH: 'category',
            HELMET: {
                title: 'Kelola Kategori Produk'
            },
            AUTHORIZE: true,
        },
        REPORT: {
            PATH: 'report',
            HELMET: {
                title: 'Laporan'
            },
            AUTHORIZE: true,
        },
    CART: {
        PATH: 'cart',
        HELMET: {
            title: 'Keranjang',
        },
        AUTHORIZE: true,
    },
    ORDER: {
        PATH: 'order',
        HELMET: {
            title: 'Pesanan',
        },
        AUTHORIZE: true,
    },
    WISHLIST: {
        PATH: 'wishlist',
        HELMET: {
            title: 'Wishlist',
        },
        AUTHORIZE: true,
    },
    PENGATURAN: {
        PATH: 'pengaturan',
        HELMET: {
            title: 'Pengaturan',
        },
        AUTHORIZE: true,
    },
    REGISTER: {
        PATH: 'register',
        HELMET: {
            title: 'REGISTER',
        },
        AUTHORIZE: false,
    },
    FORGOT_PASSWORD: {
        PATH: 'forgot-password',
        HELMET: {
            title: 'FORGOT PASSWORD',
        },
        AUTHORIZE: false,
    }
}
export default RouteURL;