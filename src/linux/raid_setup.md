# RAID Arrays
Let’s build a few different kinds of RAID arrays and then use them.

I'm not going to go into detail about what RAID is or the different levels, since there is plenty of documentation out there already. These are the commands to set up software RAID for Linux and the general workflow to follow.

## Do we have any now?
Let’s double‑check the current RAID state.

```bash
cat /proc/mdstat
```

## Which Devices?
Insert the new drives into the machine. You should know what they come up as, but if you don’t, try:

```bash
lsblk
```

That should give you a list of all the block devices on the system and where they are being used. Some of them may not make sense at first glance, but you should see the ones you just added. If needed, run the command and copy down the results. Then insert the drives and execute it again.

I will be using the following devices:

```bash
/dev/sda
/dev/sdb
/dev/sdc
/dev/sdd
```

## Create the Arrays!

### RAID 0
We’ll start with RAID 0, which allows us to use all the drives as one big (though not redundant) block device.

```bash
sudo mdadm --create --verbose /dev/md0 \
  --level=raid0 --raid-devices=4 \
  /dev/sda /dev/sdb /dev/sdc /dev/sdd
```

### RAID 1
Simple mirroring. The easiest to use, a decent redundancy package, and not all that wasteful.

```bash
sudo mdadm --create --verbose /dev/md1 \
  --level=raid1 --raid-devices=2 \
  /dev/sda /dev/sdb
```

### RAID 5
Probably the best all‑around choice. It gives the best use of capacity and good performance.

```bash
sudo mdadm --create --verbose /dev/md2 \
  --level=raid5 --raid-devices=4 \
  /dev/sda /dev/sdb /dev/sdc /dev/sdd
```

## Create the FileSystem

```bash
sudo mkfs -t ext4 /dev/md0
```

## Mounting

You should have these drives come up every time you want to use them, so add the entries to `/etc/fstab`.

First, obtain the UUID of the array.

```bash
sudo blkid /dev/md0
```

Take the UUID and add the following line to `/etc/fstab` (adjust the mount point and options as needed):

```bash
UUID=655d2d3e-ab31-49c7-9cc3-583ec81fd316 /srv ext4 defaults 0 0
```

Then run:

```bash
sudo mount -a
```

and the array should appear at the desired location.

## Update Configuration

```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
```

Then update the initramfs so that the RAID arrays are recognised at boot:

```bash
sudo update-initramfs -u
```