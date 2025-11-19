

The YAML files where sourced [from here](https://github.com/n8n-io/n8n-hosting).

```
 kubectl apply -f namespace.yaml
 kubectl apply -f postgres-configmap.yaml
 kubectl apply -f postgres-secret.yaml
 kubectl apply -f postgres-claim0-persistentvolumeclaim.yaml
 kubectl apply -f postgres-deployment.yaml
 kubectl apply -f postgres-service.yaml
 ```

 ```
 kubectl apply -f n8n-claim0-persistentvolumeclaim.yaml
 kubectl apply -f n8n-deployment.yaml
 kubectl apply -f n8n-service.yaml
 ```

 ```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: n8n-ingress
  namespace: n8n 
spec:
  ingressClassName: haproxy 
  tls:
    - hosts:
        - workflow.faultycloud.io 
      secretName: n8n-wc 
  rules:
    - host: "workflow.faultycloud.io" 
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: n8n-service
                port:
                  number: 5678
 ```
