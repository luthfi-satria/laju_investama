import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ShowSweetAlert = (prop, callback = false) => {
    let swalProp = {
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonColor: '#ef4444',
        customClass:{
            actions: 'text-center',
            icon: 'text-xs'
        }
    }

    if(Object.keys(prop).length > 0){
        swalProp = {...swalProp, ...prop}
    }

    if(callback){
        return MySwal.fire(swalProp);
    }
    MySwal.fire(swalProp);
}

export default ShowSweetAlert;