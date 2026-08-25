# Traefik Setup

## Install

```bash
helm repo add traefik https://traefik.github.io/charts && \
helm repo update
```

## Get Values

```bash
helm show values traefik/traefik > values.yaml
```

## Install

```bash
kubectl apply --server-side -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.6.1/standard-install.yaml
helm upgrade -i --namespace traefik -f values.yaml traefik traefik/traefik --create-namespace
```

## My Values File

```yaml
---
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: node-role.kubernetes.io/control-plane
          operator: Exists
tolerations:
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Equal"
    effect: "NoSchedule"
providers:
  kubernetesGateway:
    enabled: true
ingressClass:
  enabled: false
  isDefaultClass: false
api:
  dashboard: false

```