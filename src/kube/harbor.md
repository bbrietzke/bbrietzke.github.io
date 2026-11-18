# Harbor

## Install 

```bash
helm repo add harbor https://helm.goharbor.io
helm repo update
helm show values harbor/harbor > values.yaml
```

```bash
helm upgrade --install harbor harbor/harbor \
  --namespace harbor \
  --create-namespace \
  -f values.yaml
```

