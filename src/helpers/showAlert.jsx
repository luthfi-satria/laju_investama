import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ShowSweetAlert = (prop) => {
    let swalProp = {
        showCloseButton: true,
        customClass:{
            actions: 'text-center',
            icon: 'text-xs'
        }
    }

    if(Object.keys(prop).length > 0){
        swalProp = {...swalProp, ...prop}
    }

    MySwal.fire(swalProp);
}

export default ShowSweetAlert;