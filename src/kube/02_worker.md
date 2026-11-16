# Adding a Worker Node

On the worker node, all you need to do is steps one through four of the installation page.  After installation, execute the following on the control plane node:

```
kubeadm token create --print-join-command
```

Just copy and paste that over to the new worker node and it will do the rest.
