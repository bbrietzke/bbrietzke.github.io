# Network Attached Storage

There are plenty of network‑attached storage solutions out there, both free and open source. 
But why would we want to build one from scratch? 

Understanding how these tools work gives you insight into their inner workings and opens the door to customisations that off‑the‑shelf solutions can’t provide.

## Starting with Samba

I prefer to run on Ubuntu, so I’m using the current LTS (24.04.3) for this guide. 
The server is named **vault**.

First, update the system:

```bash
sudo apt update && sudo apt -y full-upgrade
```

Next, create the parent directories:

```bash
sudo mkdir -p /srv/{samba,nfs}
```

### Install Samba

```bash
sudo apt install -y samba
```

### Create shared directories

```bash
sudo mkdir -p /srv/samba/{public,ISOs}
```

### Edit the configuration

Open the Samba configuration file:

```bash
sudo vi /etc/samba/smb.conf
```

Add the following sections (replace or append as appropriate):

```
[homes]
  comment = Home Directory
  browsable = no
  read only = no
  create mask = 0700
  directory mask = 0700
  valid users = %S

[ISOs]
  comment = ISO files
  path = /srv/samba/ISOs
  browseable = yes
  read only = no
  create mask = 0700
  directory mask = 0700
  guest ok = yes

[public]
  comment = Public Share
  path = /srv/samba/public
  browseable = yes
  read only = no
  create mask = 0766
  directory mask = 0766
  guest ok = yes
```

> **Tip:** Granting `guest ok = yes` allows unauthenticated access. Use it only for truly public data.

### Add user accounts

```bash
sudo smbpasswd -a $USER
```

### Restart services

Restart the Samba daemons whenever you add a share or create a new user:

```bash
sudo systemctl restart smbd nmbd
```

### Open the firewall

```bash
sudo ufw allow samba
```

## NFS Installation

```bash
sudo apt install nfs-kernel-server
```

### Create shared directories

```bash
sudo mkdir -p /srv/nfs/{common,k8s}
```

### Setup permissions

```bash
sudo chown -R nobody:nogroup /srv/nfs/
sudo chmod -R 777 /srv/nfs/
```

> **Caution:** `chmod 777` gives read/write/execute permissions to everyone. Adjust this to a more restrictive policy if needed.

### Edit the NFS export list

Open `/etc/exports`:

```bash
sudo vi /etc/exports
```

Add the following lines (modify subnets as appropriate):

```
/srv/nfs/common 192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash)
/srv/nfs/k8s 10.0.0.0/26(rw,sync,no_subtree_check,no_root_squash)
```

### Export the shares

```bash
sudo exportfs -a
```

### Restart the NFS service

```bash
sudo systemctl restart nfs-kernel-server
```

### Configure firewall rules

Adjust for your network.

```bash
sudo ufw allow from 192.168.1.0/24 to any port nfs
sudo ufw allow from 10.0.0.0/26 to any port nfs
```

---

*For more detailed information, refer to the [Samba documentation](https://www.samba.org/samba/docs/) and the [NFS manual pages](https://manpages.ubuntu.com/manpages/jammy/man5/exports.5.html).*