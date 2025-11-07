# Destroying RAID Arrays
You create RAID drives, so you should know how to tear them down.

So we built a few RAID arrays and mounted them—now let's tear them down.

## Unmount everything
Make sure you have the arrays unmounted from their normal (or abnormal) paths. If you don't, much of this will not work as intended.

## Check mdstat
Let’s see which arrays we currently have configured.

```bash
cat /proc/mdstat
```

The output should list any arrays you have built and indicate their current state. In this case, we need to know the names of the arrays so that we can remove them.

## Remove Arrays
Now let's stop the arrays.

```bash
sudo mdadm --stop /dev/md127  # or whatever was returned above
```

Once the arrays are stopped, we can zero out the superblocks so the disks are clean.

```bash
sudo mdadm --zero-superblock /dev/sda /dev/sdb /dev/sdc /dev/sdd
```

## Trust, but Verify
Rerun `cat /proc/mdstat` and make sure those arrays are gone.

```bash
cat /proc/mdstat
```