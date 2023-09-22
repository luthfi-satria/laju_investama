import { useState } from "react";

const HandleAlert = (alertMessage='', customClass='') =>{
    const alertState = {
        message: '',
        customClass: 'hidden',
    }

    const [alertMessageState, setAlertState] = useState(alertState);
    console.log('HANDLE ALERT IS CALLED');
    alertMessageState.customClass = customClass;
    alertMessageState.message = alertMessage;
    setAlertState({...alertMessageState, 
        ['customClass']: customClass,
        ['message']: alertMessage
    });
    setTimeout(() => {
        setAlertState({...alertMessageState, 
            ['customClass']: customClass,
            ['message']: alertMessage
        });
    }, 250);
}
export default HandleAlert