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
      if(needRequest){
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
            // listAccessMenu[item.id] = {
            //   menus: item.menus,
            //   permissions: item.permissions
            // };
            listAccessMenu.push({
              menus: item.menus,
              permissions: item.permissions,
            });
          });
          
          window.localStorage.setItem('access_menu', JSON.stringify(listAccessMenu));
          setAccessMenu(listAccessMenu);
          setNeedRequest(false);
        })
        .catch((error) => {
          if(error.response){
              setAccessMenu({});
          }
          else if(error.request){
            setAccessMenu({});
          }
        });
      }
    },[needRequest, token]);

    const changeMenu = (newValue) => {
      setAccessMenu(newValue);
    }
    return [accessMenu, changeMenu];
}