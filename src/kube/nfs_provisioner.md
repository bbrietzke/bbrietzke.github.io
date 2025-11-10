# NFS Persistent Volumes

Do your pods need to have persitent volumes for your home Kubernetes cluster?  Turns out, NFS is an option

https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner

## Helm Charts

You can add the helm chart with:

```
helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/
```

Then always pull the values, since you will need to customize the NFS server IP and path

```
helm show values nfs-subdir-external-provisioner/nfs-subdir-external-provisioner > values.yaml
```

An example customized one looks like the following:

```yaml
---
nfs:
  server: 192.168.2.70
  path: /srv/nfs/k8s
storageClass:
  create: true
  name: nfs-client
  defaultClass: true
tolerations:
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Equal"
    effect: "NoSchedule"
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: node-role.kubernetes.io/control-plane
          operator: Exists
resources:
  limits:
   cpu: 200m
   memory: 256Mi
  requests:
   cpu: 100m
   memory: 128Mi
```

And of course, we have to provision:

```
kubectl create namespace nfs-subdir
helm upgrade -i -f values.yaml nfs nfs-subdir-external-provisioner/nfs-subdir-external-provisioner --namespace nfs-subdir
```