# Rook-Ceph
If you have some extra drives that are the same size, Rook is a great option to multiply your storage options into something
that can be distributed across your worker nodes and give you some extra capacity without having a single source of failure.

## Installation
The installation instructions over [at the Rook homepage](https://rook.io/docs/rook/latest-release/Getting-Started/intro/) 
are really good, so I'm not going to repeat them here.  I've mostly used the manifest versions, even though they have a 
Helm chart option.  

There is also a [cleanup guide](https://rook.io/docs/rook/latest-release/Getting-Started/ceph-teardown/) if you want to 
uninstall Rook that is worth notating.

Don't forget to add the storage class or the extra space won't be used.

## Day Two Operations

