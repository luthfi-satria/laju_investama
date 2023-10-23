const ValidateInput = (type, input, secInput='') => {
    switch(type){
        case 'Empty' :
            return ValidateEmptyInput(input);
        case 'Email' :
            return ValidateEmail(input);
        case 'MatchingPassword':
            return ValidatePasswordNotMatch(input, secInput);
    }
}

const ValidateEmptyInput = (input) => {
    return input == '' ? false : true;
}

const ValidateEmail = (input) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return String(input).toLowerCase().match(pattern);
}

const ValidatePasswordNotMatch = (pass, rePass) => {
    return pass == rePass ? true: false;
}

export default ValidateInput;