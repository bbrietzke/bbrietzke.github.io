# General 
I need to create a bare-metal kubernetes cluster.  It will consistent of four physical machines, three workers and one control-plane.  The control-plane node is named calliope, while the worker nodes are known as urania, clio and erato.

There will be two network adapters per machine.

## Networking
One network will be private to kubernetes and will be there only to allow the kubernetes traffic to pass to other kubernetes nodes.  This network will be designated the k8s0 network.

The other network will be there for normal network traffic directed at and for receiving traffic from the other nodes on the network.  This network will be designated the lan0 network.

The worker machines also have a third network adapter in them.  In this scenerio they will not be used.

The `k8s0` network will have the network of 192.168.245.0/26.  The `lan0` network will be 192.168.3.0/24.  The `lan0` network also hosts dhcp for the other machines on the network.

DNS and the default gateway for the `lan0` network will be 192.168.3.1.  There will not be a DNS or a default gateway for the `k8s0` network.

## Hosts
The machines and IP addresses will be laid out as so:

| Machine Name | Last Octet | k8s0 MAC | lan0 MAC | Role | Storage Node |
|---        |---|---|---| --- | --- |
| CALLIOPE  | .11 | e8:ff:1e:dc:94:00 | 00:e0:4c:f9:9f:b8 | Control Plane | false |
| CLIO      | .13 | 98:b7:85:23:34:1f | 98:b7:85:23:34:1e | Worker        | true  |
| ERATO     | .17 | 98:b7:85:23:2d:01 | 98:b7:85:23:2d:00 | Worker        | true  |
| URANIA    | .19 | 98:b7:85:23:34:4b | 98:b7:85:23:34:4a | Worker        | true  |

The first three octets of the network have been identified above.  The only thing that will vary between machines during installation will the the last octet and that octet will be the same on both network adapters for that machine to make host identification easy.  These addresses will be statically mapped in the netplan.

Each machine will have Ubuntu 26.04.1 installed on them.  

## Storage
Ubuntu only uses the first 100GB of disk space for the entire installation, which will leave about 300GB unused in the volume group. The nodes that are marked **true** for storage in the above chart will need to use this additional disk space be put into a logical volume called longhorn and mounted on `/var/lib/longhorn` and an entry made in */etc/fstab* to make sure the mount comes up each time the machine is rebooted.  Make sure to include error checking to see if that logical volume already exists.  If it does, it should be deleted and recreated.

The nodes that are marked as *storage nodes* will also need huge pages turned on at a 2M size with 1024 pages in the **/etc/default/grub** file.

Drives */dev/sdb* and */dev/sdc* should be scrubbed and wiped of all partitions and contents in preperation for the installations for those nodes that are marked with storage node equals true.

## Kubernetes
Kubernetes should be set to the lastest and greatest ( 1.37.01 ), kube-VIP should use 1.2.4 and calico should use 3.33.0.

The control panel will run KUBEVIP to broadcast a virtual IP for the control plane.  This address will be `192.168.3.9`.  It will only broadcast this address on the `lan0` network.  KUBEVIP should only be used to broadcast the control plane ip address, not provide an IP for any load balancers

For Kubernetes itself, the Pod CIDR will be 10.250.0.0/16.  The services CIDR will be 172.16.250.0/23.  Each node will need to be marked with *topology.kubernetes.io/zone* of a value of **green**.  The *topology.kubernetes.io/region* for each node will need to be **HOME**.  

### Networking
The preferred CNI is *Calico* and should be installed right after the control plane node comes up.  It should live as it's own script.  Keep in mind that we are using a different pod CIDR that what *Calico* expects and the installation script will need to be automatically changed to reflect that and prevent any conflicts.

We do not need *whisker* or *goldmane* installed, so please leave those out.

## Specifics
What is  needed is a number of scripts, one for each host that will set that node up as a kubernetes capable machine, setup the networking and configure the storage specifications if the node is a storage node.  

If the role is control plane, then that node should automatically create a kubernetes cluster.  It will then need to automatically create a calico CNI networking topology with the correct CIDR blocks as dictated above.

If the role is worker, it will need set it self up and then join the Kubernetes network that the control plane created.  

Additional scripts are acceptable as long as the order of operations is provided in the README documentation.

Documentation will need to be provided, including a summary of what will be happening, the order that the scripts will need to be run in