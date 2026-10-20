# Certificate Manager Issuers and Challenges


## Certificate Manager as a Certificate Authority
Add the following yaml after installing certManager:

```yaml
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-bootstrap
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: homelab-ca
  namespace: cert-manager      # must be cert-manager's namespace for a ClusterIssuer
spec:
  isCA: true
  commonName: homelab-ca
  secretName: homelab-ca
  duration: 87600h             # 10 years
  privateKey:
    algorithm: ECDSA
    size: 256
  issuerRef:
    name: selfsigned-bootstrap
    kind: ClusterIssuer
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: homelab-ca
spec:
  ca:
    secretName: homelab-ca
```

The export the **ca.crt** from the `homelab-ca` secret and trust it on your host machines.  It will then validate as a, well, validate certificate and everything will work just dandy.  See! I said dandy!

## Self Signed Certificate
Here is a generic Self-Signed Certificate

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned
spec:
  selfSigned: {}
```