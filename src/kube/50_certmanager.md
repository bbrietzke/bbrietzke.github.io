# Managing Certificates in Kubernetes
Dealing with TLS certificates is a pain in butt!

This document is just a reshash/shorten view with my specific configuration.  You can find the full documentation over [at cert-manager.io](https://cert-manager.io/).

## Installation
### Helm
They have an OCI chart for installation.  You can get the values for it by:

```bash
helm show values oci://quay.io/jetstack/charts/cert-manager > values.yaml
```

Then review the values.yaml.  Here is mine:

```yaml
---
crds:
  enabled: true
enableCertificateOwnerRef: true
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: node-role.kubernetes.io/control-plane
          operator: Exists
tolerations:
  - key: node-role.kubernetes.io/control-plane
    operator: Equal
    effect: NoSchedule
config:
  gatewayAPI:
    enabled: true
prometheus:
  enabled: true
  servicemonitor:
    enabled: false
```

Then install with:

```bash
helm upgrade -i -n cert-manager --create-namespace -f values.yaml cert-manager oci://quay.io/jetstack/charts/cert-manager
```

Go over [verify section on the official docs](https://cert-manager.io/docs/installation/verify/) to make sure it's working.

## Configuration
You have to create __issuers__ per namespace that will actually create and distribute the certificates.  It's one of those resources that you 
created when you installed the helm charts.

### Self-Signed
I created self-signed certificates for my namespaces just because.  

Here is an example CRD:

```yaml
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: dev-selfsigned-issuer
  namespace: default
spec:
  selfSigned: {}
```

Here are the `ClusterIssuers` for Let's Encrypt:

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-token-secret
  namespace: cert-manager
type: Opaque
stringData:
  api-token: YOUR_CLOUDFLARE_API_TOKEN_HERE
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-dns01
spec:
  acme:
    # The ACME server URL for Let's Encrypt production
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration and expiration notifications
    email: you@yourdomain.com
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-dns01-account-key
    # Enable the DNS-01 challenge provider
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
```

## Requesting a Certificate
It's of course another yaml document:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: yourdomain-cert
  namespace: default # Change to the namespace where your app/ingress runs
spec:
  secretName: yourdomain-tls-secret
  issuerRef:
    name: letsencrypt-dns01
    kind: ClusterIssuer
  dnsNames:
  - "yourdomain.com"
  - "*.yourdomain.com"
```

## Using the Certificate Manager with Ingress
The certificates are mostly used by your ingress controllers to prove that the domain is valid and encrypt the communications between 
the origin and the client.  I'm sure that can be used else where, but this is the scenerio that I use them for.

You will need to modify the ingress resource defination to be similiar to:

```yaml
...
kind: Ingress
metadata:
    namespace: dev
    annotation:
        cert-manager.io/issuer: dev-selfsigned-issuer
...
```

The namespace must match the name of the issuer for that namespace.

## Using the Certificate Manager with the Gateway API

I found [these docs over here](https://cert-manager.io/docs/usage/gateway/).

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: not-important
  annotations: 
    cert-manager.io/issuer: dev-selfsigned-issuer # <-- is important and points to your issuer
spec:
  ...
  listeners:
    - name: https
      hostname: yourdomain.net
      port: 443
      protocol: HTTPS
      allowedRoutes:
        namespaces:
          from: Same
      tls:
        mode: Terminate
        certificateRefs:
          - name: yourdomain-net-tls # <-- where the certificate is saved at as a secret and as a certificate
```

## Using with Traefik Gateway
Assuming you are using the helm chart for traefik ( like we did ), you can add then update your chart after 
cert-manager is up and running.

```yaml
gateway:
  enabled: true
  annotations:
    cert-manager.io/issuer: letsencrypt-dns01
  listeners:
    web:
      port: 8000
      protocol: HTTP
      namespacePolicy: 
        from: Same
    websecure:
      port: 8443
      protocol: HTTPS
      namespacePolicy: 
        from: Same
      certificateRefs:
        - name: "traefik-default"
```

And then you need to issue a certificate:

```yaml
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: traefik-default
  namespace: traefik
spec:
  secretName: traefik-default
  issuerRef:
    name: letsencrypt-dns01
    kind: ClusterIssuer
  dnsNames:
    - "yourdomain.com"
    - "*.yourdomain.com"
```