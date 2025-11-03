# Network Attached Storage

So, yes there are plenty of network attached storage solutions out there, for free and open source.  So 
why would we want to do it the hard way?

I think it's a good idea to understand how those tools work and why.  It also allows for customization 
that you can't find inside those tools.

## Starting with SAMBA

I prefer to run on Ubuntu, so I'm using the current LTS ( 24.04.3 ) for this.  The server name is ```vault```.

Also start with 

```bash
sudo apt update && sudo apt -y full-ugprade
```

Now let's create the parent directories
```bash
sudo mkdir -p /srv/{samba,nfs,iscsi}
```

### Install SAMBA

We'll start with Samba, and maybe it's all you need.  It serves Windows and macOS clients equally well and with some effort it works with Linux.

```bash
sudo apt install -y samba
```

### Create shared directories

```bash
sudo mkdir -p /srv/samba/{public,ISOs}
```

### Edit Configuration

```bash
sudo vi /etc/samba/smb.conf
```

Find the location under shared directories

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

### User Accounts

```bash
sudo smbpasswd -a $USER
```

### Restart Services

You will need to restart services anytime you add a share or a new user.

```bash
sudo systemctl restart smbd nmbd
```

### Open Firewall

```bash
sudo ufw allow samba
```