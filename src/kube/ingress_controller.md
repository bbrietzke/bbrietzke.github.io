# Ingress Controllers

Gots to have a way to get to the applications that you built, so you have to have an ingress controller.  It handles
domain name based routing and other stuffs.

## Tools

I've been using the [nginx ingress controller](https://kubernetes.github.io/ingress-nginx/) that is part of the kubernetes project 
to do the job.  It seems to work out reasonably well.

You can run through [the installation documentation](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) to get things working. 
It's pretty straight.

One of the nice things that it will do is create a load balancer for you that you can use to immediately start directing traffic.  Or at least
it will if you have the MetalLb installed.