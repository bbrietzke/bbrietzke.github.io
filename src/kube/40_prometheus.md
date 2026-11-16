

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

```bash
helm show values prometheus-community/kube-prometheus-stack > values.yaml
```

```bash
helm upgrade -i prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace -f values.yaml
```

