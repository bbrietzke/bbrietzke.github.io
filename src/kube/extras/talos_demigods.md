## Install
```bash
for ip in "${ALL_NODES[@]}"; do
    echo "Checking disks on node: $ip"
    talosctl get disks --insecure --nodes "$ip" 
done


export CONTROL_PLANE_IP=192.168.5.9
export WORKER_IP=( "192.168.5.11" "192.168.5.13" "192.168.5.17"  "192.168.5.19" )
export ALL_NODES=( "192.168.5.9" "192.168.5.11" "192.168.5.13" "192.168.5.17"  "192.168.5.19" )
export CLUSTER_NAME=demigods
export CONTROL_PLANE_DISK=/dev/mmcblk0

cat <<'EOF' > worker-disk.yaml
apiVersion: v1alpha1
kind: UnattendedInstallConfig
provisioning:
  diskSelector:
    match: disk.dev_path == "/dev/mmcblk0"
  wipe: true
EOF

cat <<'EOF' > network.yaml
apiVersion: v1alpha1
kind: KubeNetworkConfig
podSubnets:
  - 10.254.0.0/22
serviceSubnets:
  - 172.16.0.0/23
EOF

cat <<'EOF' > patch.yaml
apiVersion: v1alpha1
kind: KubeFlannelCNIConfig
$patch: delete
---
apiVersion: v1alpha1
kind: KubeProxyConfig
enabled: false
EOF

talosctl gen config $CLUSTER_NAME \
https://$CONTROL_PLANE_IP:6443 --install-disk $CONTROL_PLANE_DISK \
--config-patch-control-plane @patch.yaml \
--config-patch @network.yaml \
--config-patch-worker @worker-disk.yaml

talosctl apply-config --insecure --nodes $CONTROL_PLANE_IP --file controlplane.yaml

for ip in "${WORKER_IP[@]}"; do
    echo "Applying config to worker node: $ip"
    talosctl apply-config --insecure --nodes "$ip" --file worker.yaml
done

talosctl --talosconfig=./talosconfig config endpoints $CONTROL_PLANE_IP

talosctl bootstrap --nodes $CONTROL_PLANE_IP --talosconfig=./talosconfig

talosctl kubeconfig --nodes $CONTROL_PLANE_IP --talosconfig=./talosconfig

talosctl --nodes $CONTROL_PLANE_IP --talosconfig=./talosconfig health


for ip in "${WORKER_IP[@]}"; do
    echo "Wiping drives for: $ip"
    talosctl wipe disk sdb --nodes "$ip" --drop-partition --talosconfig=./talosconfig
    talosctl wipe disk sdc --nodes "$ip" --drop-partition --talosconfig=./talosconfig
done

for ip in "${ALL_NODES[@]}"; do
    echo "Getting Network Evidence for: $ip"
    talosctl get links -n "$ip"  --talosconfig=./talosconfig
done

```

## Install Calico
```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.33.0/manifests/v3_projectcalico_org.yaml

kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.33.0/manifests/tigera-operator.yaml
curl -O https://raw.githubusercontent.com/projectcalico/calico/v3.33.0/manifests/custom-resources-bpf.yaml

vi custom-resources-bpf.yaml # add  kubeletVolumePluginPath: None and change ip addresses
```

## Install Cilium
```bash

```



## Upgrade
```bash
for ip in "${ALL_NODES[@]}"; do
    talosctl upgrade --nodes "$ip"  --talosconfig=./talosconfig \
        --image factory.talos.dev/metal-installer/b22f0791ed97b450dc8227df064cf32c9350c3b059aa247b7b398830012126dd:v1.14.5
done
```


## Reboot Nodes
```bash
for ip in "${ALL_NODES[@]}"; do
    talosctl reboot --nodes "$ip" --talosconfig=./talosconfig
done
```


## Gracefully Reset
```bash
for ip in "${ALL_NODES[@]}"; do
    talosctl reset --nodes "$ip" --talosconfig=./talosconfig \
      --system-labels-to-wipe STATE --system-labels-to-wipe EPHEMERAL \
      --graceful=true --reboot=true 
done
```