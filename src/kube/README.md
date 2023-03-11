# Kubernetes
[Kubernetes](https://kubernetes.io/) is a big deal, and is something that I enjoy using.

I have four servers setup that host my kubernetes environment, and then another four servers that host
various services that I use with my kubernetes environment

I have decided to document my kubernetes setup so that other folks can follow along and see what I have 
going on, and maybe learn a thing or two along the way.  It is also documented because I tend to rebuild
the mess every couple of months and I usually forget something along the way!

## Order of Operations
* [Installation](kube/installation.md)
* [Local Setup](kube/local_setup.md)
* [Load Balancer](kube/metal_load_balancer.md)
* [Ingress Controller](kube/ingress_controller.md)
* [Prometheus](kube/prometheus_setup.md)
* [NFS Provisioner](kube/nfs_provisioner.md)
* [Metrics Server](kube/metrics_server.md)