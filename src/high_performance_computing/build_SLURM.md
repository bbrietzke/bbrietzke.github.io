# Build SLURM on Alma Linux 9
Slurm (Simple Linux Utility for Resource Management) is a powerful, open-source workload manager for Linux clusters, scheduling and allocating resources (CPUs, GPUs, memory) for parallel jobs, essential for High-Performance Computing (HPC) and AI workloads, allowing users to submit jobs for efficient execution on shared systems.

## Overview
This is a basic outline of building the software that will power the system.

## Pre-Requistes
* A machine with [Alma Linux 9](https://almalinux.org/get-almalinux/) already installed

## Steps
1. Install ```wget``` and download the latest source code.  The latest version of the source code can be [found here](https://www.schedmd.com/download-slurm/).

    ```bash
    sudo dnf install -y wget
    wget https://download.schedmd.com/slurm/slurm-25.11.0.tar.bz2
    ```

1. Install build pre-requistes.

    ```bash
    sudo dnf install -y epel-release
    sudo dnf install -y rpm-build autoconf automake gcc make mariadb-devel munge-devel munge-libs pam-devel \
    perl-Switch perl-ExtUtils-MakeMaker perl-devel pmix pmix-devel readline-devel hdf5 hdf5-devel lua lua-devel \
    rrdtool-devel openssl openssl-devel libssh2-devel hwloc hwloc-devel ncurses-devel man2html libibmad libibumad 
    
    sudo dnf config-manager --set-enabled crb
    sudo dnf install -y http-parser-devel json-c-devel
    ```

1. Build RPMs.  This may take a while.

    ```bash
    rpmbuild --with slurmrestd --with pmix --with hdf5 -ta slurm-25.11.0.tar.bz2
    ```

1. The build and packaged RPMs will be located at ```$HOME\rpmbuild``` and can be copied to any destination that you 
    would like.

## Troubleshooting
* You may need additional development libraries for different SLURM versions.  The RPMBuild process has 
  a dialog that will tell you what you are missing.  Install the missing libraries using ```dnf```.

## Completion and Verification
* Verify that there where no errors during the build process.  
* Verify that the RPMs are located at ```$HOME/rpmbuild/RPMS/x86_64```.

## Contacts
## Appendix
### References
* [Alma Linux/sig-HPCAI](https://github.com/AlmaLinux/sig-HPCAI/tree/master/slurm)

### Changelog
* 2025/12/14 - Created