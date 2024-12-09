# Adding a Worker Node
On the control plane, all you need is:
```
kubeadm token create --print-join-command
```

Just copy and paste that over to the new worker node and it will do the rest.
