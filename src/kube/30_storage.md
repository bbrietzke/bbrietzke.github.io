# Storage
Storage can be a pain.

There are a lot of options out there, most of which I haven't explored.  I settled on [Rook](https://rook.io/docs/rook/latest-release/Getting-Started/intro/) for my bare-metal cluster.

## Snapshots
Snapshots are great to have prior to migration or if you want to move something to dev from a production PVC.  It's not hard to setup, but it is confusing to get right.

```bash
git clone https://github.com/kubernetes-csi/external-snapshotter/
cd external-snapshotter
git checkout release-8.2
kubectl kustomize client/config/crd | kubectl create -f -
kubectl -n kube-system kustomize deploy/kubernetes/snapshot-controller | kubectl create -f -
```

```bash
git clone --single-branch --branch v1.21.2 https://github.com/rook/rook.git
cd rook/deploy/examples
kubectl create -f crds.yaml -f common.yaml -f csi-operator.yaml
kubectl create -f operator.yaml -f cluster.yaml
```


```bash
kubectl get crd | grep snapshot.storage.k8s.io
kubectl get pods -A | grep snapshot-controller

```