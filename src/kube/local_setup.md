# Local Setup

There are some tools that I like to have on my local machine that makes working with Kubernetes much easier.
This document will go through the installation and configuration of them.

## What to install?

Since I'm on a Mac, everything is installed through (Homebrew)[https://brew.sh/].

```
brew install k9s helm kubernetes-cli
```

If you want to install on the Linux/Kubernetes host, here are a few options:

### Helm

```bash
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### K9S

[K9S Github Releases](https://github.com/derailed/k9s/releases) and choose the one that is approriate for your platform.

## Configuration
### Kubernetes Tools
The only thing that *really* needs configuration is the kubernetes configuration tools.  For that, you need to get 
a copy of the kube config file from the control-plane.

```
mkdir ~/.kube
scp ubuntu@kubernetes-host.local:.kube/config ~/.kube/config
```

This configures both **k9s** and **kubectl**, so that bit is done.  Both of the tools should work as you would expect.

### Helm
You don't *have* to configure **helm**, but it's not a bad idea either.  My personal chart repository is configured as follows.

```
helm repo add bbrietzke http://bbrietzke.github.io/charts
```

I have a few charts that I tend to use, in particular for setting up namespaces.  I have three, _prod_, _dev_, and _infra_.  There isn't much else to customize, so this just works.

```
helm install namespaces bbrietzke/namespaces
```

It's also the first helm chart I created.
