import axios from "axios";
import { useEffect, useState } from "react"

export const FetchAdminMenu = (token) => {
    const [needRequest, setNeedRequest] = useState(false);

    const [accessMenu, setAccessMenu] = useState(() => {
        const value = window.localStorage.getItem('access_menu');
        if(value){
            const parseData = JSON.parse(value);
            return parseData;
        }
        setNeedRequest(true);
        return false;
    });

    useEffect(()=>{
      if(token && needRequest){
        const APIURL = import.meta.env.VITE_APIURL+'/api/access/user';
        axios.get(APIURL, {
          headers: {
            Authorization: 'Bearer '+token
          },
        })
        .then((response) => {
          const resData = response.data.data;
          const listAccessMenu = [];

          resData.forEach(item => {
            listAccessMenu.push({
              menus: item.menus,
              permissions: item.permissions,
            });
          });
          
          window.localStorage.setItem('access_menu', JSON.stringify(listAccessMenu));
          setAccessMenu(listAccessMenu);
        })
        .catch((error) => {
          if(error.response){
              setAccessMenu({});
          }
          else if(error.request){
            setAccessMenu({});
          }
        })
        .finally(()=>{
          setNeedRequest(false);
        })
        ;
      }
    },[needRequest, token]);

    const changeMenu = (newValue) => {
      setAccessMenu(newValue);
    }
    return [accessMenu, changeMenu];
}