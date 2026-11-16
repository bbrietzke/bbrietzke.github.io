# Storage
Storage can be a pain.

There are a lot of options out there, most of which I haven't explored.  I settled on [Rook](https://rook.io/docs/rook/latest-release/Getting-Started/intro/) for my bare-metal cluster.

## Snapshots
Snapshots are great to have prior to migration or if you want to move something to dev from a production PVC.  It's not hard to setup, but it is confusing to get right.

```bash
git clone https://github.com/kubernetes-csi/external-snapshotter/
cd external-snapshotter
git checkout release-8.2   # or newest release-8.x
kubectl kustomize client/config/crd | kubectl create -f -
kubectl -n kube-system kustomize deploy/kubernetes/snapshot-controller | kubectl create -f -
```