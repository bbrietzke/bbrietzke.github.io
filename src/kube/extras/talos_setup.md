## Install
```bash
export CONTROL_PLANE_IP=192.168.5.30
export WORKER_IP=("192.168.5.35" "192.168.5.36" "192.168.5.37" "192.168.5.38")
export CLUSTER_NAME=pi-burnetes
export DISK_NAME=/dev/mmcblk0

cat <<'EOF' > patch.yaml
apiVersion: v1alpha1
kind: KubeFlannelCNIConfig
$patch: delete
EOF


talosctl gen config $CLUSTER_NAME \
https://$CONTROL_PLANE_IP:6443 --install-disk $DISK_NAME \
--config-patch-control-plane @patch.yaml

talosctl apply-config --insecure --nodes $CONTROL_PLANE_IP --file controlplane.yaml

talosctl --talosconfig=./talosconfig config endpoints $CONTROL_PLANE_IP

talosctl bootstrap --nodes $CONTROL_PLANE_IP --talosconfig=./talosconfig

talosctl kubeconfig --nodes $CONTROL_PLANE_IP --talosconfig=./talosconfig

talosctl --nodes $CONTROL_PLANE_IP --talosconfig=./talosconfig health

for ip in "${WORKER_IP[@]}"; do
    echo "Applying config to worker node: $ip"
    talosctl apply-config --insecure --nodes "$ip" --file worker.yaml
done

for ip in "${WORKER_IP[@]}"; do
    talosctl wipe disk nvme0n1 --nodes "$ip" --drop-partition --talosconfig=./talosconfig
done
```

## Install Calico
```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.33.0/manifests/v3_projectcalico_org.yaml

kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.33.0/manifests/tigera-operator.yaml
curl -O https://raw.githubusercontent.com/projectcalico/calico/v3.33.0/manifests/custom-resources-bpf.yaml

vi custom-resources-bpf.yaml # add  kubeletVolumePluginPath: None and change ip addresses
```


## Longhorn drive configuration
```bash
export WORKER_IP=("192.168.5.35" "192.168.5.36" "192.168.5.37" "192.168.5.38")

cat <<'EOF' > disk-patch.yaml
apiVersion: v1alpha1
kind: UserVolumeConfig
name: longhorn
provisioning:
  diskSelector:
    match: disk.transport == 'nvme' && !system_disk
  grow: false
  maxSize: 100%
EOF

for ip in "${WORKER_IP[@]}"; do
    talosctl patch machineconfig --nodes "$ip" --patch @disk-patch.yaml --talosconfig=./talosconfig
    talosctl reboot --nodes "$ip" --talosconfig=./talosconfig
done
```

## Upgrade
```bash
export ALL_NODES=("192.168.5.30" "192.168.5.35" "192.168.5.36" "192.168.5.37" "192.168.5.38")

for ip in "${ALL_NODES[@]}"; do
    talosctl upgrade --nodes "$ip"  --talosconfig=./talosconfig \
        --image factory.talos.dev/metal-installer/b22f0791ed97b450dc8227df064cf32c9350c3b059aa247b7b398830012126dd:v1.14.5
done
```


## Reboot Nodes
```bash
export ALL_NODES=("192.168.5.30" "192.168.5.35" "192.168.5.36" "192.168.5.37" "192.168.5.38")

for ip in "${ALL_NODES[@]}"; do
    talosctl reboot --nodes "$ip" --talosconfig=./talosconfig
done
```


## Gracefully Reset
```bash
export ALL_NODES=("192.168.5.38" "192.168.5.37" "192.168.5.36" "192.168.5.35" "192.168.5.30")

for ip in "${ALL_NODES[@]}"; do
    talosctl reset --nodes "$ip" --graceful=true --reboot=true --talosconfig=./talosconfig
done
```