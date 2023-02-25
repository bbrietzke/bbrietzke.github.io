Metrics server is not quite as easy to install as advertise, at least on system installed with ```kubeadm```.  But, the fix to make 
it work is pretty simple, assuming you do it the insecure way.

The correct way is more complicated, but also secure.



## Installing

The code and instructions to install metrics server [can be found here](https://github.com/kubernetes-sigs/metrics-server).  Again, not repeating them here so they go stale.

The instructions work perfectly, things get installed and then don't work.  At all.

The metrics pod just never becomes ready and then logs complain about SSL certificates being invalid.

## Cheating and Being Insecure

The easiest option is to add ```--kubelet-insecure-tls``` to the spec.container.args array.  I added it as the last one.

You can make this edit either in the deployment or prior to doing a ```kubectl apply``` if you download the manifest files.