# Installing Kubernetes
This is for a single host installation.  I'll include instructions for adding an additional host down the line if you are so inclined. 

I have consolidated a number of different documents, mostly for the troubleshooting.

## Setup
This is for installation on an Ubuntu 24.04 LTS machine.  I would recommend a machine with at least 8GiB of RAM, 16GiB of hard drive space and at least two cores.  The more the better things will run and the more stuff you can cram into Kubernetes. 

Make sure your server is up to date before we get started.
```
sudo apt update && sudo apt full-upgrade -y 
```

## Step By Step
### Step One: Disable Swap
__Kubeadm__ will complain if swap is enabled, so let's disable able that.
```
sudo swapoff -a
```

### Step Two: Kernel Parameters
There are some parameters that need to be tuned in the linux kernel for Kubernetes to work properly.
```
sudo tee /etc/modules-load.d/containerd.conf << EOF
overlay
br_netfilter
EOF
```
```
sudo tee /etc/sysctl.d/kubernetes.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
EOF
```

```
sudo modprobe overlay && sudo modprobe br_netfilter && sudo sysctl --system
```

### Step Three: Container Runtime Installation
Let's install __containerd__.
```
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmour -o /etc/apt/trusted.gpg.d/docker.gpg && \
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" && \
sudo apt update && \
sudo apt install -y containerd.io
```

Need to have a configuration file for __containerd__.  Luckily, we can generate one.
```
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1 
sudo sed -i 's/SystemdCgroup \= false/SystemdCgroup \= true/g' /etc/containerd/config.toml
```

Then we'll need to enable and restart __containerd__.
```
sudo systemctl enable containerd && \
sudo systemctl restart containerd
```

### Step Four: Kubernetes Runtime Installation
This will install kubernetes 1.34 to be installed on the machine.  At the time of writing, it is the most current version.
```
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.34/deb/Release.key | sudo gpg  --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg && \
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.34/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list && \
sudo apt update && \
sudo apt install -y kubelet kubeadm kubectl
```

### Step Five: Kubeadm Execution
Now for the part that we've all been waiting for! The prerequisites are in place so now it's time to get kubernetes up and running.
```
sudo kubeadm init
```

This will take a little while to run.

### Step Six: Tool Configuration
Once the installation is complete, you will need to configure __kubectl__.  Execute the following:
```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

This will copy the configuration to your home directory.  This will allow you to use  __kubectl__ from anywhere on the system.

### Step Seven: Remove the Taints
This is a single node system, which means that it's also running as a control panel.  Normally, kubernetes doesn't want additional pods on the control panel, which makes for an interesting catch-22.  Thankfully, we can fix that.
```
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

### Step Eight: Container Networking
In order for the node to become *ready*, it will need networking installed. For simple, one node installs I personally think Calico is perfectly reasonable. 
```
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.30.3/manifests/calico.yaml
```

It will take a little bit for the networking jitters to settle.

### Step Nine: Does it work?
Let's pull up the cluster information
```
kubectl cluster-info
```
Do all nodes show __READY__?
```
kubectl get nodes -o wide
```
What do the pods look like?
```
kubectl get pods -o wide -A
```

### Step Ten: Install Something!
You can also create a very basic _nginx_ deployment just to see if things work.
```
kubectl apply -f https://gist.githubusercontent.com/bbrietzke/c59b6132c37ea36f9b84f1fee701a642/raw/952524cec7892e9db350fc62773c32ddfd9ab867/kubernetes-test.yaml
```

Then:
```
open http://kubernetes-host.local:30081/
```

And you should see a website in the browser of your choice.