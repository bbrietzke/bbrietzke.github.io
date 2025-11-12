


```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: iscsi-chap-secret
  namespace: db
type: Opaque
data:
  node.session.auth.username: cGk=
  node.session.auth.password: cmFzcGJlcnJ5
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
    targetPortal: 192.168.2.70:3260
    iqn: iqn.2025-11.work.faultycloud:ssd
    lun: 0
    fsType: ext4
    readOnly: false
    chapAuthDiscovery: true
    chapAuthSession: true
    secretRef:
      name: iscsi-chap-secret
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: volume01
spec:
  capacity:
    storage: 50G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.2.70:3260
    iqn: iqn.2025-11.work.faultycloud:ssd
    lun: 1
    fsType: ext4
    readOnly: false
    chapAuthDiscovery: true
    chapAuthSession: true
    secretRef:
      name: iscsi-chap-secret
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: volume02
spec:
  capacity:
    storage: 50G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.2.70:3260
    iqn: iqn.2025-11.work.faultycloud:ssd
    lun: 2
    fsType: ext4
    readOnly: false
    chapAuthDiscovery: true
    chapAuthSession: true
    secretRef:
      name: iscsi-chap-secret
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: volume03
spec:
  capacity:
    storage: 50G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.2.70:3260
    iqn: iqn.2025-11.work.faultycloud:ssd
    lun: 3
    fsType: ext4
    readOnly: false
    chapAuthDiscovery: true
    chapAuthSession: true
    secretRef:
      name: iscsi-chap-secret
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: volume04
spec:
  capacity:
    storage: 50G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.2.70:3260
    iqn: iqn.2025-11.work.faultycloud:ssd
    lun: 4
    fsType: ext4
    readOnly: false
    chapAuthDiscovery: true
    chapAuthSession: true
    secretRef:
      name: iscsi-chap-secret
```