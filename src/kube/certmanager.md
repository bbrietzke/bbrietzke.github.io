# Managing Certificates in Kubernetes
Dealing with TLS certificates is a pain in butt!

This document is just a reshash/shorten view with my specific configuration.  You can find the full documentation over [at cert-manager.io](https://cert-manager.io/).

## Installation
### Helm

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.19.1/cert-manager.yaml
```

Go over [verify section on the official docs](https://cert-manager.io/docs/installation/verify/) to make sure it's working.

## Configuration
You have to create __issuers__ per namespace that will actually create and distribute the certificates.  It's one of those resources that you 
created when you installed the helm charts.

### Self-Signed
I created self-signed certificates for my namespaces just because.  

Here is an example CRD:

```
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: dev-selfsigned-issuer
  namespace: dev
spec:
  selfSigned: {}
```

I'm sure I'll write up a Helm chart at somepoint with the issuers that I need.

## Using the Certificate Manager
The certificates are mostly used by your ingress controllers to prove that the domain is valid and encrypt the communications between 
the origin and the client.  I'm sure that can be used else where, but this is the scenerio that I use them for.

You will need to modify the ingress resource defination to be similiar to:

```
...
kind: Ingress
metadata:
    namespace: dev
    annotation:
        cert-manager.io/issuer: dev-selfsigned-issuer
...
```

The namespace must match the name of the issuer for that namespace.