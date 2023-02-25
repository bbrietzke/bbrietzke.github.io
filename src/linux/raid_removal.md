# Destroying RAID Arrays
You create RAID drives, so you should know who to tear them down.


So we built a few RAID arrays and mounted them, so that's grand.  Now let's tear them down.

## Unmount everything
Make sure you have the arrays unmounted from there normal ( or abnormal ) paths.  If you don't, not much of 
this is going to work out well.

## Check mdstat
Lets check to see which arrays we currently have configured.

```
cat /proc/mdstat
```

The above should return any arrays you current have built and what state they are in.  In this case, we 
need to know the names of the arrays so that we can remove them.

## Remove Arrays
Okay, let's stop the arrays.

```
mdadm --stop /dev/md127  # or whatever was returned above
```

Now that we don't have working arrays, we can zero them out so that they are empty.

```
mdadm --zero-superblock /dev/sda /dev/sdb /dev/sdc /dev/sdd
```

## Trust, but Verify
Rerun the mdstat and make sure those pesky things are gone.