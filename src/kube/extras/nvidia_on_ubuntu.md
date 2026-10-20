

```bash
ubuntu-drivers devices

sudo ubuntu-drivers install && sudo reboot
```

```bash
nvidia-smi
```

[Nvidia Operator Documentation](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html)

```bash
helm install --wait gpu-operator -n gpu-operator --create-namespace \
     oci://nvcr.io/nvidia/cloud-native-charts/gpu-operator --version=v26.7.1
```

```bash
kubectl get nodes -o json \
    | jq '.items[] | select(.status.allocatable["nvidia.com/gpu"] != null) | {name: .metadata.name, gpus: .status.allocatable["nvidia.com/gpu"]}'
```
