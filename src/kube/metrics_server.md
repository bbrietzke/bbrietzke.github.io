Metrics server is not quite as easy to install as advertise, at least on system installed with ```kubeadm```.  But, the fix to make 
it work is pretty simple, assuming you do it the insecure way.

The correct way is more complicated, but also secure.



## Installing

The code and instructions to install metrics server [can be found here](https://github.com/kubernetes-sigs/metrics-server).  Again, not repeating them here so they go stale.

The instructions work perfectly, things get installed and then don't work.  At all.

The metrics pod just never becomes ready and then logs complain about SSL certificates being invalid.

## The Right Way to Install

You will need to go to each node and modify the kubelet config file and add a configuration line. That line is 
`serverTLSBootstrap: true`

```bash
sudo vi /var/lib/kubelet/config.yaml
```

You will then need to either restart the host machine or the kubelet service.

When the service comes back up, it will request a TLS certificate that the node can communicate with the rest of
the infrastructure with.  The only thing is you will need to sign the certificate to make it official.  You can sign all 
of the outstanding certificate requests with:

```bash
for kubeletcsr in `kubectl -n kube-system get csr | grep kubernetes.io/kubelet-serving | awk '{ print $1 }'`; do kubectl certificate approve $kubeletcsr; done
```

Then metrics server will be happy.

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


### The fix

* [the fix is in!](https://medium.com/@kubelet/dont-kubelet-insecure-tls-a9b8b16e8c67)
* [Also discusssed Here!](https://www.zeng.dev/post/2023-kubeadm-enable-kubelet-serving-certs/)
