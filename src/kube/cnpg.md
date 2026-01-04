# Cloud Native PostgreSQL

It's hard to build modern applications without a database.  I prefer PostgreSQL and this is the 
operator that will help setup a clustered PostgreSQL installation in Kubernetes

## Installation

```bash
kubectl apply --server-side -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.28/releases/cnpg-1.28.0.yaml
```

## The Actual Cluster

You will want to use a good and fast network attached storage to keep database performance high. I'm using iSCIS here.

```bash
kubectl create namespace db
```

```yaml
---
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgresql
  namespace: db
spec:
  instances: 3
  postgresql:
    parameters:
      shared_buffers: "256MB"
  storage:
    size: 50G
    storageClass: iscsi
  resources:
    requests:
      memory: "1024Mi"
      cpu: 500m
    limits:
      memory: "4096Mi"
      cpu: 2000m
```