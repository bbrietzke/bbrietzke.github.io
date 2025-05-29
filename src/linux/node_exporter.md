# Systems Monitoring with Node Exporter
Trying to figure out what is going on when something is broke can be hard, so it's nice to have tooling to help with that.  Prometheus is one such tool.  It can also, with proper tuning and work, tell you before something is going to break.

And it make pretty graphs.  Everybody loves pretty graphs!

## Prometheus?
Prometheus monitoring solution is a free and open-source solution for monitoring metrics, events, and alerts. It collects and records metrics from servers, containers, and applications. In addition to providing a flexible query language (PromQL), and powerful visualization tools, it also provides an alerting mechanism that sends notifications when needed.

## Prerequisites
A machine that can run Ubuntu 22.04 ( or other LTS ).

You should also have basic administrative knowledge and an account that has sudo access on the above box.

## Installation
### Update the system
```
sudo apt update && sudo apt -y upgrade
```

### Create the Node Exporter User Account
```
sudo groupadd --system nodeexporter
sudo useradd -s /sbin/nologin --system -g nodeexporter nodeexporter
```

### Create Directories
These are for configuration files and libraries.
```
sudo mkdir /var/lib/node_exporter
```

### Install Prometheus
Now for the fun part!

You can view the lasted node exporter downloads and pick the one you [need](https://prometheus.io/download/#node_exporter).
```
wget https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-arm64.tar.gz
tar zvxf node_exporter*.tar.gz
cd node_exporter*/
sudo mv node_exporter /usr/local/bin
sudo chown nodeexporter:nodeexporter /usr/local/bin/node_exporter
sudo chown -R nodeexporter:nodeexporter /var/lib/node_exporter
```

### Run at Startup
```
sudo nano /etc/systemd/system/node_exporter.service
```

with

```
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=nodeexporter
Group=nodeexporter
Type=simple
ExecStart=/usr/local/bin/node_exporter \
    --web.listen-address=0.0.0.0:9182 \
    --collector.textfile.directory=/var/lib/node_exporter 

[Install]
WantedBy=multi-user.target
```

then

```
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
sudo systemctl status node_exporter
```