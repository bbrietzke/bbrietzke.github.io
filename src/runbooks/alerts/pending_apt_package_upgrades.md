# Pending Apt Package Upgrades
## Overview
Package updates are a maintance task that helps increase stability and reliability of the systems.

The update process will cause a restart of the updated machine, which may cause an outage.
## Pre-Requistes
* A clone of the __ansible__ repository
    * `git clone git@github.com:bbrietzke/ansible.git`
* [XCode Command Line Tools](https://developer.apple.com/download/all/)
* Git 
    * `brew install git`
* Ansible 
    * `brew install ansible`
## Steps
1. Go to the directory where the ansible repo is cloned:
    * `git checkout master`
    * `git pull`
2. Execute the update command and provide the __become__ password:
    * `make updates`
## Troubleshooting
* Machines may not come back up during the reboot and may require a physical reboot for Ansible

## Completion and Verification
* All machines must come back up and the count for the _Apt Upgrades_ should go down to zero.
## Contacts
## Appendix
### Changelog
    * 2023/04/08 - Created