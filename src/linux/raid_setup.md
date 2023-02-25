# RAID Arrays
Let's build a few different kinds of RAID arrays and then use them.


I'm not going to go into detail about what RAID is, or the different levels since there is plenty of documentation
out there already.  These are the commands to setup software RAID for Linux and the general workflow to follow.

## Do we have any now?
Let's just double check

```
cat /proc/mdstat
```

## Okay, which Devices?
Insert the new drives into the machine.  You _should_ know what the come up as, but if you don't, try:

```
lsblk
```

That should get you a list of all the block devices on the system and where they are being used at.  Some of them
don't make sense, but you should see the ones that you just added.  If needed, run the command and copy down the results.
Then insert the drives and execute it again.

I'll be using the following:

```
/dev/sda
/dev/sdb
/dev/sdc
/dev/sdd
```

## Create the ARRAYS!
### RAID 0
We'll start with RAID 0, since it will allow us to use all the drives as one big ( though not redundant ) block device.

```
sudo mdadm --create --verbose /dev/md0 --level=raid0 --raid-devices=4 /dev/sda /dev/sdb /dev/sdc /dev/sdd
```

### RAID 1
Simple mirroring.  The easiest to use, a decent redundancy package and not all that wasteful.

```
sudo mdadm --create --verbose /dev/md0 --level=raid1 --raid-devices=2 /dev/sda /dev/sdb
```

### RAID 5
Probably the best all around choice.  Best use of capacity and good performance.

```
sudo mdadm --create --verbose /dev/md0 --level=raid5 --raid-devices=4 /dev/sda /dev/sdb /dev/sdc /dev/sdd
```

## Creating the FileSystem

```
sudo mkfs -t ext4 /dev/md0
```

## Mounting
You should have these drives come up every time you want to use them, so add the entries to ```/etc/fstab```.

First you need the UUID of the array.

```
sudo blkid /dev/md0
```

Take the UUID and the following string and open up ```/etc/fstab``` to add something along the lines of:

```
UUID=655d2d3e-ab31-49c7-9cc3-583ec81fd316 /srv ext4 defaults 0 0
```

Then you can execute ```sudo mount -a``` and have the array appear where you wanted it.

## Update config

```
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
```

then

```
sudo update-initramfs -u
```