# First Steps

## Update Firmware

```bash
sudo vi /boot/firmware/cmdline.txt
```

add to the end of line

```
cgroup_memory=1 cgroup_enable=memory
```


39166497