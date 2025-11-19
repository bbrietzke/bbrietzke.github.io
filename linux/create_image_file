

create the image file

```
dd if=/dev/zero of=sparse_image.img bs=1M count=0 seek=1024 conv=sparse
```

mount the new image
```
losetup -f sparse_image.img
losetup -a
```

format the image
```
sudo mkfs.ext4 /dev/loopX
```

unmount the image file
```
losetup -d /dev/loopX
```