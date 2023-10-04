import Logout from "../../hooks/appLogout";

const NavbarConstant = [
    {
        name: "ecommerce",
        url: "/",
        label: "ecommerce",
    },
    {
        name: "profile",
        url: "/dashboard/profile",
        label: "Profile",
    },
    {
        name: "logout",
        url: "/logout",
        label: "Logout",
        onclick: () => Logout()
    },
];

export default NavbarConstant;