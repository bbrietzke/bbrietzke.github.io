
Must be a member of builtin\administrators

```
sudo apt -y install sssd-ad sssd-tools realmd adcli
sudo realm discover faultycloud.lan
sudo realm join -U Administrator -v faultycloud.lan
sudo pam-auth-update --enable mkhomedir
groups Administrator@faultycloud.lan
```

### Domain Admins as sudoers
It is case sensitive!

```
%domain\ admins@FaultyCloud.lan ALL=(ALL) NOPASSWD: ALL
```
or
```
%domain\ admins@FaultyCloud.lan ALL=(ALL:ALL) ALL
```


[Documentation Source](https://documentation.ubuntu.com/server/how-to/sssd/with-active-directory/index.html)
