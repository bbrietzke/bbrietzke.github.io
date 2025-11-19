# Redis Operator

The Redis operator is a pretty handy operator to have around considering that Redis is 
a pretty popular piece of software

The complete documentation can be (found over here)[https://github.com/OT-CONTAINER-KIT/redis-operator].

## Installation

Setup the helm chart.

```bash
helm repo add redis-ot https://ot-container-kit.github.io/helm-charts/
```

Install the operator.

```bash
kubectl create namespace redis-system
helm upgrade -i redis-operator redis-ot/redis-operator --namespace redis-system
```

## Create a Redis instance

I've only create standalone instances for individual namespaces. I haven't tried to work through 
a cluster installation or how that would work.

Here is an example of a stand alone instance example.

```yaml
apiVersion: redis.redis.opstreelabs.in/v1beta2
kind: Redis
metadata:
  name: redis-example
  namespace: default
spec:
  kubernetesConfig:
    image: quay.io/opstree/redis:latest
    imagePullPolicy: IfNotPresent
  storage:
    volumeClaimTemplate:
      spec:
        storageClassName: standard
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi
  podSecurityContext:
    runAsUser: 1000
    fsGroup: 1000
```

This will setup a redis instance and services to point to the instance.