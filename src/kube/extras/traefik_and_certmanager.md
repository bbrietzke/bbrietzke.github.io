

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
  kubernetesIngress:
    enabled: false
  kubernetesCRD:
    enabled: false

ingressClass:
  enabled: false
  isDefaultClass: false

api:
  dashboard: false

ports:
  web:
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true

gateway:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-dns01
  listeners:
    web:
      port: 8000
      protocol: HTTP
      hostname: "faultycloud.xyz"
      namespacePolicy:
        from: Selector
        selector:
          matchExpressions:
          - key: kubernetes.io/metadata.name
            operator: In
            values:
            - monitoring
            - traefik
    web-wildcard:
      port: 8000
      protocol: HTTP
      hostname: "*.faultycloud.xyz"
      namespacePolicy:
        from: Selector
        selector:
          matchExpressions:
          - key: kubernetes.io/metadata.name
            operator: In
            values:
            - monitoring
            - traefik
    websecure:
      port: 8443
      protocol: HTTPS
      hostname: "faultycloud.xyz"
      mode: Terminate
      certificateRefs:
        - name: faultycloud-xyz-tls
      namespacePolicy:
        from: Selector
        selector:
          matchExpressions:
          - key: kubernetes.io/metadata.name
            operator: In
            values:
            - monitoring
            - traefik
    websecure-wildcard:
      port: 8443
      protocol: HTTPS
      hostname: "*.faultycloud.xyz"
      mode: Terminate
      certificateRefs:
        - name: faultycloud-xyz-tls
      namespacePolicy:
        from: Selector
        selector:
          matchExpressions:
          - key: kubernetes.io/metadata.name
            operator: In
            values:
            - monitoring
            - traefik
```