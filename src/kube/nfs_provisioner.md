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
helm show values nfs-subdir-external-provisioner/nfs-subdir-external-provisioner
```

An example customized one looks like the following:

```
nfs:
  server: 10.0.0.155
  path: /srv/nfs_shares/kubernetes
```

And of course, we have to provision:

```
helm install -f nfs_prov.yml nfs-provisioner nfs-subdir-external-provisioner/nfs-subdir-external-provisioner -n infra
```