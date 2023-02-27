# Local Setup

There are some tools that I like to have on my local machine that makes working with Kubernetes much easier.
This document will go through the installation and configuration of them.

## What to install?

Since I'm on a Mac, everything is installed through (Homebrew)[https://brew.sh/].

```
brew install k9s helm kubernetes-cli
```

## Configuration
### Kubernetes Tools
The only thing that *really* needs configuration is the kubernetes configuration tools.  For that, you need to get 
a copy of the kube config file from the control-plane.

```
mkdir ~/.kube
scp ubuntu@basil.local:.kube/config ~/.kube/config
```

This configures both **k9s** and **kubectl**, so that bit is done.  Both of the tools should work as you would expect.

### Helm
You don't *have* to configure **helm**, but it's not a bad idea either.  My personal chart repository is configured as follows.

```
helm repo add bbrietzke http://bbrietzke.github.io/charts
```