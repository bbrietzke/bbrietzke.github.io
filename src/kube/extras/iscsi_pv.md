


```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: volume00
spec:
  capacity:
    storage: 20G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.2.91:3260
    iqn: iqn.2025-01.work.faultycloud:storage
    lun: 0
    fsType: ext4
    readOnly: false
```