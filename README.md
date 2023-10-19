## HOW TO ACCESS VIA MOBILE

1. Setup your network connection to private network
2. Check server IP address

```bash
$ ipconfig | find "IPv4 Address"
# find out your network address in the list
# copy ip address
```
3. Open .env file, then change VITE_APIURL value with correct ip address and the same port
4. Open your device on the same network with correct IP Address