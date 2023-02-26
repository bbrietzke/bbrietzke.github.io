
Running Kubernetes on bare-metal? We'll need a load balancer.


The installation is well documented ( and works ), so [I won't repeated it here](https://metallb.universe.tf/installation/).

I ran the manifest method, just because it seems the easiest way to do it.  If I do it again, I'll try the helm route.

## Configuration
This is where the docs get confusing.

You need to do some configuration after the installation and it's not explicitly clear what kind of configuration.  

### Address Pools
The LB requires addresses that it can assign.  You should have a configuration document similiar to:

```
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: available-pool
  namespace: metallb-system
spec:
  addresses:
  - 10.0.0.30-10.0.0.31
```

Call it something like ```address-pools.yaml``` so you don't forget what it is.

### BGP
I know you need these to work, but don't ask me why. Call it ```advertisements.yml```.

```
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: available-pool-l2
  namespace: metallb-system
spec:
  ipAddressPools:
  - available-pool

---
apiVersion: metallb.io/v1beta2
kind: BGPPeer
metadata:
  name: available-pool-peer
  namespace: metallb-system
spec:
  myASN: 64500
  peerASN: 64501
  peerAddress: 10.0.0.1

---
apiVersion: metallb.io/v1beta1
kind: BGPAdvertisement
metadata:
  name: available-pool-adv
  namespace: metallb-system
spec:
  ipAddressPools:
  - available-pool
```

## Applying the Manifests

Nothing out of the ordinary, if you build a manifest, you have to apply it.

```
kubectl apply -f address-pools.yaml
kubectl apply -f advertisements.yml
```

## Usage

Yeah, still haven't figured that one out.  I figure put the special annotations on the ingress controller and let it run.