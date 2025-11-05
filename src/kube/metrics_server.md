Metrics server is not quite as easy to install as advertise, at least on system installed with ```kubeadm```.  But, the fix to make 
it work is pretty simple, assuming you do it the insecure way.

The correct way is more complicated, but also secure.



## Installing

The code and instructions to install metrics server [can be found here](https://github.com/kubernetes-sigs/metrics-server).  Again, not repeating them here so they go stale.

The instructions work perfectly, things get installed and then don't work.  At all.

The metrics pod just never becomes ready and then logs complain about SSL certificates being invalid.

## Cheating and Being Insecure

The way I get the metrics server installed is to cheat a little.  I tell it to ignore tls verfication
and magically things just work!

### How to do it

```bash
wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Then add `--kubelet-insecure-tls` to spec.template.spec.containers.args.

#### Install

```bash
kubectl apply -f components.yaml
```