# General 
I would like to create a five-node Kubernetes network out of a series of Raspberry Pis.  This arrangment of devices is to allow for learning and managing Kubernetes in a small form factor with ARM64 processors.

The machines are named after mythological demigods.  This convention is because these are single-board computing devices and not fully-fledged computing resources.

# The Demigods
## Hosts
The devices are laid out as such:

|Machine Name| Last Octet |  Role  | Storage Node |  RAM |     MAC Addr.     |
|------------|------------|--------|--------------|------|-------------------|
| Hercules   |   .9       | Control Plane | false | 8Gb  | 88:A2:9E:29:ED:25 |
| Achilles   |   .11      | Worker | true         | 16Gb | 2c:cf:67:c7:86:d2 |
| Perseus    |   .13      | Worker | true         | 16Gb | 88:a2:9e:00:07:d2 |
| Helen      |   .17      | Worker | true         | 16Gb | 2C:CF:67:E4:89:EB |
| Aenes      |   .19      | Worker | true         | 16Gb | 88:A2:9E:7A:3B:62 |

## Networking
There will be one network that is routed behind an OpenWRT router.  This is done to maintain network integrity and isolation.  

The network address itself is 192.168.5.0/26.  The default gateway and DNS server will be 192.168.5.1. The name for this network will be `k8s0`.

The hosts themselves are assigned addresses based on statically mapped DHCP addresses.  

The address last octets from .50 to .59 will be DHCP addresses assigned to transient resources.

# Kubernetes
## Cluster Overall
The cluster name will be **demigods**.  Please use this for all contexts and naming conventions.

The version of Kubernetes to be installed is 1.37.2.

There will need to be labels applied to each node.  The *topology.kubernetes.io/region* will need to be **HOME** and the *topology.kubernetes.io/zone* will need to be **DEMIGODS**.

## Networking
The overall pod network will be 10.253.0.0/23 with each host receiving a /26 network.  

There will be a *KUBE-VIP* installation on the control plane that will serve at 192.168.5.5. *Kube-VIP* should be installed at the lastest and greatest version of v1.3.1.

The CNI installed should be *Calico* at version 3.33.0.  We will not need *Whisker* or *Goldmane* installed.

## Storage
Each device marked as a storage node has a drive at /dev/nvme0n1.  This device will need to scrubbed and wiped of all partitions in preparation for the installation of Rook/Ceph.  Each node will need the prerequistes for Rook/Ceph to be installed and readied.

# Specifics
What is  needed is a number of scripts, one for each host that will set that node up as a kubernetes capable machine, setup the networking and configure the storage specifications if the node is a storage node.  

If the role is control plane, then that node should automatically create a kubernetes cluster.  It will then need to automatically create a calico CNI networking topology with the correct CIDR blocks as dictated above.

If the role is worker, it will need set it self up and then join the Kubernetes network that the control plane created.  

Additional scripts are acceptable as long as the order of operations is provided in the README documentation.

Documentation will need to be provided, including a summary of what will be happening, the order that the scripts will need to be run in.