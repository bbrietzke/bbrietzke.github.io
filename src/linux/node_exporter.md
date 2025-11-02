# Systems Monitoring with Node Exporter

Trying to figure out what is going on when something is **broken** can be hard, so it's nice to have tooling to help with that.  Prometheus is one such tool.  With proper tuning and effort, it can warn you before something goes wrong. 

And it **makes** pretty graphs.  Everybody loves pretty graphs!

## Prometheus

Prometheus is a free and open‑source monitoring solution for collecting metrics, events, and alerts.  It records data from servers, containers, and applications.  In addition to a flexible query language (PromQL) and powerful visualization tools, it also provides an alerting mechanism that sends notifications when needed.

## Prerequisites

- A machine running **Ubuntu 24.04** or another LTS release. 
- Basic administrative knowledge and an account with sudo access on that machine.

## Installation

### Update the system

```bash
sudo apt update && sudo apt -y upgrade
```

### Create the Node Exporter user account

```bash
sudo groupadd --system nodeexporter
sudo useradd -s /sbin/nologin --system -g nodeexporter nodeexporter
```

### Create directories

These directories store configuration files and libraries.

```bash
sudo mkdir /var/lib/node_exporter
```

### Install Prometheus

Now for the fun part!  You can view the **latest** Node Exporter downloads and pick the one you need on the official page: 
[Node Exporter download page](https://prometheus.io/download/#node_exporter).

```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
tar zvxf node_exporter*.tar.gz
cd node_exporter*/
sudo mv node_exporter /usr/local/bin
sudo chown nodeexporter:nodeexporter /usr/local/bin/node_exporter
sudo chown -R nodeexporter:nodeexporter /var/lib/node_exporter

cd ..
rm -rf node*
```

### Run at startup

Create a systemd unit file for Node Exporter:

```bash
sudo nano /etc/systemd/system/node_exporter.service
```

Paste the following configuration:

```ini
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

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
sudo systemctl status node_exporter
```