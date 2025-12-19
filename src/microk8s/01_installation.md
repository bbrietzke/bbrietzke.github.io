# Installing microK8s
``microk8s`` is a distribution of kubernetes that is compact and easy to use.  It's designed to run on the "edge", 
which can be a developer laptop, a server at a remote office or on a VPS somewhere.

## Overview
Installation is simple if you are using a recent form of Ubuntu.  Other distro's might have additional steps in order
to setup.

## Prerequisites
* ``sudo`` privileges
* Network access to download packages
* A recent version of Ubuntu (i.e. 24.04.3 LTS).

## Steps
1. Execute the ``snap`` command:
    ```bash
    sudo snap install microk8s --classic --channel=latest/stable
    ```

    The channel can be changed to something different depending on your needs.

## Troubleshooting
* Wrong channel
    You can always view available channels with:
    ```bash
    snap info microk8s
    ```

## Completion and Verification
* You can view the status of the install and services with:
    ```bash
    microk8s status --wait-ready
    ```

## Contacts

## Appendix

### References
* [MicroK8s Official Documentation](https://microk8s.io/docs)
* [MicroK8s GitHub Repository](https://github.com/canonical/microk8s)
* [Snap Documentation](https://snapcraft.io/docs)
* [Kubernetes Documentation](https://kubernetes.io/docs/)

### Changelog
* 2025/12/15 - Initial Version