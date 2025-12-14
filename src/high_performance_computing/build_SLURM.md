# Build SLURM on Alma Linux 9

Slurm (Simple Linux Utility for Resource Management) is a powerful, open-source workload manager for Linux clusters, scheduling and allocating resources (CPUs, GPUs, memory) for parallel jobs, essential for High-Performance Computing (HPC) and AI workloads.

## Overview
This runbook covers building SLURM RPM packages from source on Alma Linux 9. These RPMs can then be distributed to controller and compute nodes in your cluster.

## Prerequisites
* A machine with [Alma Linux 9](https://almalinux.org/get-almalinux/) installed
* Root or sudo access
* Approximately 2GB free disk space for build process
* Internet connectivity for downloading source and dependencies

## Steps

1. **Prepare RPM build environment**
```bash
    # Create RPM build directory structure
    mkdir -p ~/rpmbuild/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
    echo '%_topdir %(echo $HOME)/rpmbuild' > ~/.rpmmacros
```

2. **Download SLURM source code**

    The latest version can be [found here](https://www.schedmd.com/download-slurm/).
```bash
    sudo dnf install -y wget
    
    # Set version variable for easy updates
    SLURM_VERSION="25.11.0"
    wget https://download.schedmd.com/slurm/slurm-${SLURM_VERSION}.tar.bz2
```

3. **Install build dependencies**
```bash
    # Enable EPEL and CodeReady Builder repositories
    sudo dnf install -y epel-release
    sudo dnf config-manager --set-enabled crb
    
    # Install core build tools and SLURM dependencies
    sudo dnf install -y rpm-build autoconf automake gcc make \
        mariadb-devel munge-devel munge-libs pam-devel \
        perl-Switch perl-ExtUtils-MakeMaker perl-devel \
        pmix pmix-devel readline-devel \
        hdf5 hdf5-devel lua lua-devel \
        rrdtool-devel openssl openssl-devel libssh2-devel \
        hwloc hwloc-devel ncurses-devel man2html \
        libibmad libibumad http-parser-devel json-c-devel
```

4. **Build RPM packages**

    This process typically takes 10-15 minutes depending on your system.
    ```bash
    rpmbuild --with slurmrestd --with pmix --with hdf5 -ta slurm-${SLURM_VERSION}.tar.bz2
    ```


5. **Verify and locate built RPMs**
```bash
    ls -lh ~/rpmbuild/RPMS/x86_64/
```

    You should see RPMs including:
    - `slurm-*.rpm` - Core SLURM binaries
    - `slurm-slurmctld-*.rpm` - Controller daemon
    - `slurm-slurmd-*.rpm` - Compute node daemon
    - `slurm-slurmdbd-*.rpm` - Database daemon
    - `slurm-slurmrestd-*.rpm` - REST API daemon
    - `slurm-pam_slurm-*.rpm` - PAM module
    - `slurm-devel-*.rpm` - Development headers

## Troubleshooting

### Missing Dependencies
If `rpmbuild` fails with missing dependency errors:
1. Note the missing package name from the error message
2. Install using: `sudo dnf install -y <package-name>-devel`
3. Re-run the rpmbuild command

### Build Failures
- Check build logs at: `~/rpmbuild/BUILD/slurm-*/config.log`
- Ensure CRB repository is enabled for http-parser-devel and json-c-devel
- Verify sufficient disk space: `df -h ~`

### Common Issues
- **"rpmbuild: command not found"**: Install rpm-build package
- **Permission denied errors**: Ensure you're building as regular user, not root
- **Network timeouts**: Check firewall settings if wget fails

## Completion and Verification

**Success criteria:**
- ✓ No errors during rpmbuild process
- ✓ Multiple RPM files present in `~/rpmbuild/RPMS/x86_64/`
- ✓ RPM integrity check passes: `rpm -K ~/rpmbuild/RPMS/x86_64/slurm-*.rpm`

**File sizes** (approximate):
- Core slurm package: ~15-20 MB
- Total RPMs: ~40-50 MB

## Next Steps
1. Distribute RPMs to cluster nodes
2. Install appropriate packages on controller and compute nodes
3. Configure Munge authentication
4. Configure `/etc/slurm/slurm.conf`
5. Start SLURM services

## Contacts
[Add your contact information or team details]

## Appendix

### Package Distribution Guide
- **Controller node**: slurm, slurm-slurmctld, slurm-slurmdbd (if using accounting)
- **Compute nodes**: slurm, slurm-slurmd
- **Submit hosts**: slurm (client tools only)

### References
* [Alma Linux sig-HPCAI](https://github.com/AlmaLinux/sig-HPCAI/tree/master/slurm)
* [SchedMD SLURM Documentation](https://slurm.schedmd.com/documentation.html)
* [SLURM Quick Start Guide](https://slurm.schedmd.com/quickstart_admin.html)

### Changelog
* 2025/12/14 - Created initial version