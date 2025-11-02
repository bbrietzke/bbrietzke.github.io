# Systems and Application Monitoring with Prometheus

Figuring out what’s going on when something breaks can be difficult, so having the right tooling can make a big difference. Prometheus is one such tool. With proper tuning and configuration, it can even alert you before a failure occurs.

It also makes pretty graphs—everyone loves good visualisations!

## What is Prometheus?

Prometheus is a free and open‑source monitoring solution that collects and records metrics from servers, containers, and applications. It provides a flexible query language (PromQL) and powerful visualisation tools, and includes an alerting mechanism that sends notifications when needed.

## Prerequisites

- A machine capable of running Ubuntu 22.04 (or any other LTS release).
- Basic administrative knowledge and an account with **sudo** access on that machine.

## Installation

### Update the system

```bash
sudo apt update && sudo apt -y upgrade
```

### Create the Prometheus user account

```bash
sudo groupadd --system prometheus
sudo useradd -s /sbin/nologin --system -g prometheus prometheus
```

### Create directories

These directories will hold Prometheus’s configuration files and data store.

```bash
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
```

### Install Prometheus

> **Note:** The following steps install the latest LTS tarball of Prometheus (as of this writing). You can download a different release from the official site: https://prometheus.io/download/#prometheus.

```bash
wget https://github.com/prometheus/prometheus/releases/download/v3.5.0/prometheus-3.5.0.linux-amd64.tar.gz
tar zvxf prometheus*.tar.gz
cd prometheus*/
sudo mv prometheus /usr/local/bin
sudo mv promtool /usr/local/bin
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown prometheus:prometheus /usr/local/bin/promtool
sudo mv prometheus.yml /etc/prometheus
sudo chown prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /var/lib/prometheus

cd ..
rm -rf prom*
```

### Configuring

The full configuration guide is available here: https://prometheus.io/docs/prometheus/latest/configuration/configuration/. It walks through almost every option, though the wording can be confusing. Below is a simple, real‑world example of a `prometheus.yml` file that demonstrates typical usage.

```yaml
# my global config
global:
  scrape_interval: 15s  # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s  # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
           - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
        labels:
          groups: 'monitors'
  - job_name: 'servers'
    static_configs:
      - targets:
          - 'atlas.faultycloud.lan:9182'
          - 'coeus.faultycloud.lan:9182'
          - 'gaia.faultycloud.lan:9182'
          - 'hyperion.faultycloud.lan:9182'
        labels:
          groups: 'win2022'
  - job_name: 'gitlab'
    static_configs:
      - targets:
          - '192.168.1.253:9090'
        labels:
          groups: 'development'
```

### Run at Startup

Create a systemd service file at `/etc/systemd/system/prometheus.service` with the following content:

```ini
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/

[Install]
WantedBy=multi-user.target
```

Reload systemd, enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```