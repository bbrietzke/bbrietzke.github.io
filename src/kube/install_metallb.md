# Install MetalLB

## Installation

Installation instruction can be found [on there website](https://metallb.universe.tf/installation/).

### First

```bash
kubectl get configmap kube-proxy -n kube-system -o yaml | \
sed -e "s/strictARP: false/strictARP: true/" | \
kubectl diff -f - -n kube-system

kubectl get configmap kube-proxy -n kube-system -o yaml | \
sed -e "s/strictARP: false/strictARP: true/" | \
kubectl apply -f - -n kube-system
```

Then:

```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.15.2/config/manifests/metallb-native.yaml
```

## Configuration

### Address Pool
```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: primary-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.2.75-192.168.2.80
```

### Advertisers
```yaml
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2advert-primary
  namespace: metallb-system
spec:
  ipAddressPools:
  - primary-pool
---
apiVersion: metallb.io/v1beta1
kind: BGPAdvertisement
metadata:
  name: bgpadvert
  namespace: metallb-system
spec:
  ipAddressPools:
  - primary-pool
```