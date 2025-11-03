# Extending an LVM Logical Volume

To grow an existing logical volume and resize its filesystem you can run:

```bash
sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv && \
sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```

* `lvextend -l +100%FREE` expands the logical volume to use all free space on the volume group.
* `resize2fs` resizes the ext4 filesystem to fill the new logical‑volume size.

> **Tip:** If your filesystem is XFS, replace `resize2fs` with `xfs_growfs /dev/mapper/ubuntu--vg-ubuntu--lv`.

---

## Configuring Networking with Netplan

1. **Create the Netplan configuration file**

```bash
cd /etc/netplan
sudo touch 01-netcfg.yaml
sudo chmod 600 01-netcfg.yaml
sudo vi 01-netcfg.yaml
```

2. **Add the following YAML content**

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens18:
      dhcp4: true
    ens19:
      addresses:
        - 10.0.0.12/26
```

* `ens18` will obtain its IPv4 address via DHCP.
* `ens19` receives the static address `10.0.0.12` with a `/26` subnet mask.

3. **Apply the new configuration**

```bash
sudo netplan apply
```

> **Note:** After applying, verify connectivity with `ip addr show` or `ping`.
