# Network Attached Storage – iSCSI

iSCSI is typically used when you need fast, block‑level storage for workloads such as databases. It isn’t usually something you’d attach to a consumer desktop. 

## Starting with iSCSI

I prefer to run on Ubuntu, so I’m using the current LTS (24.04.3) for this guide. The server is named **vault**.

First, update the system:

```bash
sudo apt update && sudo apt -y full-upgrade
```

Next, create the parent directories:

```bash
sudo mkdir -p /srv/iscsi
```

### Install the iSCSI target

```bash
sudo apt install -y targetcli-fb
```

### Create shared image files

Create some backing files that can be used as targets. Optionally, you can use disk partitions or LVM volumes.

```bash
sudo dd if=/dev/zero of=/srv/iscsi/disk00.img bs=1 count=0 seek=10G # Creates a 10GB image file
sudo dd if=/dev/zero of=/srv/iscsi/disk01.img bs=1 count=0 seek=10G # Creates a 10GB image file
sudo dd if=/dev/zero of=/srv/iscsi/disk02.img bs=1 count=0 seek=50G # Creates a 50GB image file
sudo dd if=/dev/zero of=/srv/iscsi/disk03.img bs=1 count=0 seek=50G # Creates a 50GB image file
sudo dd if=/dev/zero of=/srv/iscsi/disk04.img bs=1 count=0 seek=50G # Creates a 50GB image file
sudo dd if=/dev/zero of=/srv/iscsi/disk05.img bs=1 count=0 seek=50G # Creates a 50GB image file
```

The image files start out small and grow as data is written to them. Be careful not to over‑provision the system, as it becomes a single point of failure for anything that uses iSCSI.

### Mount on loopback and format new drives (optional)

```bash
sudo losetup -f /srv/iscsi/disk00.img
sudo losetup -a
sudo mkfs.ext4 /dev/loopX   # replace X with the loop device returned by losetup -a
sudo losetup -d /dev/loopX
```

Or format all of them in one shot:

```bash
for image in /srv/iscsi/*.img; do
  sudo losetup -f "$image"
  sudo mkfs.ext4 /dev/loop1
  sudo losetup -d /dev/loop1
done
```

### Configure the iSCSI target using TargetCLI

```bash
sudo targetcli
```

Inside the shell, follow the steps below to create a backstore from the disk images you created.

```bash
cd /backstores/fileio
create disk00 /srv/iscsi/disk00.img
create disk01 /srv/iscsi/disk01.img
create disk02 /srv/iscsi/disk02.img
create disk03 /srv/iscsi/disk03.img
create disk04 /srv/iscsi/disk04.img
create disk05 /srv/iscsi/disk05.img
```

Create the actual LUNs:

```bash
cd /iscsi
create iqn.2025-11.com.example:storage
cd iqn.2025-11.com.example:storage/tpg1/luns
create /backstores/fileio/disk00
create /backstores/fileio/disk01
create /backstores/fileio/disk02
create /backstores/fileio/disk03
create /backstores/fileio/disk04
create /backstores/fileio/disk05
```

To enable authentication:

```bash
cd ../
set attribute generate_node_acls=1
set attribute demo_mode_write_protect=0
set attribute authentication=1
set auth userid=your_username
set auth password=your_secret_password
```

To restrict iSCSI to specific addresses:

```bash
cd iqn.2025-11.com.example:storage/tpg1/portals
delete 0.0.0.0:3260
create 10.0.0.5:3260
```

To save the configuration:

```bash
cd /
saveconfig
exit
```

### Verification / validation

```bash
sudo targetcli ls
```

### Setup firewall

```bash
sudo ufw allow 3260/tcp
```

### Bonus - Scripting targetcli

```bash
sudo targetcli "/backstores/fileio create disk00 /srv/iscsi/disk00.img"
sudo targetcli "/backstores/fileio create disk01 /srv/iscsi/disk01.img"
sudo targetcli "/backstores/fileio create disk02 /srv/iscsi/disk02.img"
sudo targetcli "/backstores/fileio create disk03 /srv/iscsi/disk03.img"
sudo targetcli "/backstores/fileio create disk04 /srv/iscsi/disk04.img"
sudo targetcli "/backstores/fileio create disk05 /srv/iscsi/disk05.img"

sudo targetcli "/iscsi create iqn.2026-01.io.faultycloud:storage"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1/luns create /backstores/fileio/disk00"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1/luns create /backstores/fileio/disk01"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1/luns create /backstores/fileio/disk02"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1/luns create /backstores/fileio/disk03"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1/luns create /backstores/fileio/disk04"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1/luns create /backstores/fileio/disk05"

sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1 set attribute generate_node_acls=1"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1 set attribute demo_mode_write_protect=0"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1 set attribute authentication=1"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1 set auth userid=your_username"
sudo targetcli "/iscsi/iqn.2026-01.io.faultycloud:storage/tpg1 set auth password=your_secret_password"

sudo targetcli "saveconfig"
```