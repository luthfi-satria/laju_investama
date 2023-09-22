const ValidateInput = (type, input) => {
    switch(type){
        case 'Empty' :
            return ValidateEmptyInput(input);
        case 'Email' :
            return ValidateEmail(input);
    }
}

const ValidateEmptyInput = (input) => {
    return input == '' ? false : true;
}

const ValidateEmail = (input) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return String(input).toLowerCase().match(pattern);
}

export default ValidateInput;