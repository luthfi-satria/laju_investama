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
5. If your session not working on mobile browser then check browser setup 
    settings -> browser setup -> site data 
    and allow that IP address to store local data in the device
6. if you want to create local domain then add hosts configuration
```bash
# Open hosts files
# windows OS
$ cd C://Windows/System32/driver/etc
$ cat hosts
# example
$ add 192.168.x.x egrommerce.internal
```