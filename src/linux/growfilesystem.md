

```
sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv && \
sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```

```
cd /etc/netplan
sudo touch 01-netcfg.yaml
sudo chmod 600 01-netcfg.yaml
sudo vi 01-netcfg.yaml
```


```
network:
  version: 2
  renderer: networkd
  ethernets:
    ens18:
      dhcp4: true
    ens19:
      addresses:
        - 10.0.0.12/26
```