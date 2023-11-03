const UserRegistrationForm = (data) => {
    return [
        {
            type: 'text',
            name: 'email',
            placeholder: 'Masukan email...',
            label: 'Email',
        },
        {
            type: 'text',
            name: 'username',
            placeholder: 'Masukan username...',
            label: 'Username',
        },
        {
            type: 'text',
            name: 'phone',
            placeholder: 'Masukan nomor handphone...',
            label: 'Telepon',
        },
        {
            type: 'password',
            name: 'password',
            placeholder: 'Password...',
            label: 'Password',
        },
        {
            type: 'select',
            name: 'usergroup_id',
            option: data?.usergroup ? data.usergroup : {},
            label: 'Usergroup' 
        },
    ];
}
export default UserRegistrationForm;