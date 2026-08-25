


```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: iscsi-chap-secret
  namespace: default
type: Opaque
data:
  node.session.auth.username: dmF1bHQ=
  node.session.auth.password: cGFzc3dvcmQ=
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: volume00
spec:
  capacity:
    storage: 10G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.1.228:3260
    iqn: iqn.2025-11.work.faultycloud:storage
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
    storage: 10G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.1.228:3260
    iqn: iqn.2025-11.work.faultycloud:storage
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
    targetPortal: 192.168.1.228:3260
    iqn: iqn.2025-11.work.faultycloud:storage
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
    targetPortal: 192.168.1.228:3260
    iqn: iqn.2025-11.work.faultycloud:storage
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
    targetPortal: 192.168.1.228:3260
    iqn: iqn.2025-11.work.faultycloud:storage
    lun: 4
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
  name: volume05
spec:
  capacity:
    storage: 50G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi
  iscsi:
    targetPortal: 192.168.1.228:3260
    iqn: iqn.2025-11.work.faultycloud:storage
    lun: 5
    fsType: ext4
    readOnly: false
    chapAuthDiscovery: true
    secretRef:
      name: iscsi-chap-secret
```