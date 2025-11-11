# How to Schedule on the Control Plane

I prefer that my controllers run on the control plane node.  It's usually underutilizied, stable 
and just looking for stuff to do.  Basically, you need to add:

```yaml
    spec:
      tolerations:
        - key: node-role.kubernetes.io/control-plane
          operator: Equal
          effect: NoSchedule
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: node-role.kubernetes.io/control-plane
                operator: Exists
```