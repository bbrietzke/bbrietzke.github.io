# MicroK8s User Setup
Setting up a Kubernetes cluster is one thing, but being able to interact with it effectively is another. This runbook configures user access to MicroK8s and installs essential tools like kubectl and k9s to make cluster management straightforward and efficient.

## Overview
This runbook configures a non-root user for MicroK8s access and installs the necessary command-line tools for cluster management. It covers adding the user to the microk8s group, configuring kubectl access, and installing k9s for an enhanced terminal-based UI. After completion, you'll be able to manage your MicroK8s cluster without using sudo and have powerful tools at your disposal.

## Prerequisites
* A MicroK8s installation on a Linux system
* A non-root user account with sudo privileges
* Internet connectivity to download binaries
* ``wget`` installed

## Steps
1. First we need to add your user to the ``microk8s`` group and configure kubectl access:
```bash
    sudo usermod -a -G microk8s $USER
    sudo mkdir -p ~/.kube
    sudo chown -R $USER ~/.kube
    sudo microk8s config > ~/.kube/config
```

    > **NOTE:** You must log out and log back in for the group membership to take effect.

1. Install ``kubectl``. Download the latest stable version:
```bash
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    rm kubectl
```

1. Install ``k9s`` for a terminal-based UI to manage your cluster. You can check [the k9s download page](https://github.com/derailed/k9s/releases) for the latest version.
```bash
    wget https://github.com/derailed/k9s/releases/download/v0.32.7/k9s_linux_amd64.deb
    sudo dpkg -i k9s_linux_amd64.deb
    rm k9s_linux_amd64.deb
```

> **NOTE:** If dpkg reports missing dependencies, run: `sudo apt-get install -f`

## Troubleshooting

### Permission denied errors
If you get permission errors after adding yourself to the microk8s group:
```bash
# Verify group membership
groups
```

### kubectl connection refused
```bash
# Verify MicroK8s is running
microk8s status

# Regenerate the config if needed
sudo microk8s config > ~/.kube/config

# Check config file permissions
ls -la ~/.kube/config
```

### k9s cannot connect to cluster
```bash
# Verify kubectl works first
kubectl get nodes

# Check kubeconfig location
echo $KUBECONFIG

# If empty, k9s should use ~/.kube/config by default
# Explicitly set it if needed:
export KUBECONFIG=~/.kube/config
```

### kubectl command not found
```bash
# Verify installation
which kubectl

# Check if /usr/local/bin is in your PATH
echo $PATH

# If not, add to your ~/.bashrc or ~/.bash_profile:
export PATH=$PATH:/usr/local/bin
```

## Completion and Verification
After completing these steps, verify your setup:
```bash
# Verify you're in the microk8s group (after logging out/in)
groups | grep microk8s

# Check MicroK8s status
microk8s status

# Verify kubectl access
kubectl get nodes
kubectl get pods -A

# Verify kubectl version
kubectl version --client

# Launch k9s
k9s

# Press :q to quit k9s
```

You should see your MicroK8s node listed and be able to navigate the k9s interface.

## Contacts

## Appendix

### References
* [MicroK8s Documentation](https://microk8s.io/docs)
* [kubectl Documentation](https://kubernetes.io/docs/reference/kubectl/)
* [k9s Documentation](https://k9scli.io/)
* [kubectl Installation Guide](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

### Optional: Enable kubectl autocompletion
```bash
# For bash
echo 'source <(kubectl completion bash)' >> ~/.bashrc
echo 'alias k=kubectl' >> ~/.bashrc
echo 'complete -o default -F __start_kubectl k' >> ~/.bashrc

# For zsh
echo 'source <(kubectl completion zsh)' >> ~/.zshrc
echo 'alias k=kubectl' >> ~/.zshrc
echo 'complete -o default -F __start_kubectl k' >> ~/.zshrc
```

### Changelog
* 2025/12/26 - Initial Version