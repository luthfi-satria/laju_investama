import Logout from "../../hooks/appLogout";

const NavbarConstant = [
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