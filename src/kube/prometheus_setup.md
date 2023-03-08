# Setting up Prometheus

So you have a kubernetes cluster all setup, but how do you make sure that it's up and working?  Well, you have to monitor
it!

(Prometheus)[https://prometheus.io/] is a pretty complete all-in-one package for monitoring and alerting both stand alone nodes 
and the applications that run on them.  It also has special hooks for monitoring Kubernetes and the pods that run on it.

## Setup

So the easy way is to use the community helm chart.  It will install Prometheus and a number of the other tools that falls under
that umbrella as well.  It doesn't do it perfectly, but it's pretty damn close to seemless.

### Helm Charts
The Prometheus community build a set of helm charts over at (this Github page)[https://github.com/prometheus-community/helm-charts].  
Which is nice because it's open source and publically available to all of us.  

The instructions are pretty complete and thought out so getting started is not much of a problem.  You have helm setup, right?

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

Take a look at the values, and see what you need to customize

```
helm show values prometheus-community/prometheus > prom_values.yaml
```

The obivious ones are setting up the persistent storage and adding additional scrape targets.  I also ended up disabling the 
installation of AlertManager since it wouldn't connect with a persistent volume with the current configuration.  Everything else 
is pretty boilerplate and, honestly, I just left things alone.

Here is my file:

```
server:
  ingress:
    enabled: true
    annotations: 
      kubernetes.io/ingress.class: nginx
      kubernetes.io/tls-acme: 'false'
    hosts: 
      - prometheus.faultycloud.work
    path: /
  persistentVolume:
    enabled: true
    accessModes:
      - ReadWriteOnce
    size: 8Gi
    volumeName: "prometheus"
alertmanager:
  enabled: false
```

Applying the helm chart is pretty standard, and once it's done, you'll have a working Prometheus setup within a few minutes.

```
helm install -f prom_alertmanager.yml alertmanager prometheus-community/alertmanager -n infra
```