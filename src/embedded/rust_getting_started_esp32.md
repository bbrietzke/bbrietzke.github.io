# Getting Started with Rust on ESP32

So there is a lot of documentation on working on the ESP32 with Rust, but it's pretty scattered and hard to find.  This is my attempt 
to gather things in one spot, that is current ( as of Feburary of 2023 ) and works ( at least for me ).

# Prerequiste Software Installation

There are some bits and pieces that must be installed to get things running.  Most of these are specific to getting the ESP32 module
up and running.

## Well, duh
Of course you have to have rust installed:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Cargo Packages
Just a few packages.

```
cargo install ldproxy espup cargo-generate espflash espmonitor cargo-espmonitor cargo-espflash
```

## Build System
In order to build the actual executables, you will need to install the IDF toolkit and other nonsense.  There is a tool to 
make that happen very easily.

```
espup install
```

Every once in a while you will need to update the tools with:

```
espup update
```



## Resources
