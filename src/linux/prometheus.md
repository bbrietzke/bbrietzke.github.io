# Systems and Application Monitoring with Prometheus
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

### Create the Prometheus User Account
```
sudo groupadd --system prometheus
sudo useradd -s /sbin/nologin --system -g prometheus prometheus
```

### Create Directories
These are for configuration files and libraries.
```
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
```

### Install Prometheus
Now for the fun part!

The tarball used for this is the latest ( as of this writing ) LTS for Prometheus.  You can change it to be what you [need](https://prometheus.io/download/#prometheus).
```
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
The configuration guide can be found [over here](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).  It will step you through most every option in the most confusing way possible.  I amd including a sample of my personal configuration in the hopes that a real world example makes more sense.
```
sudo nano /etc/prometheus/prometheus.yml
```
Here is what my simple configuration file looks like:
```
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
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
```
sudo nano /etc/systemd/system/prometheus.service
```

with

```
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

```
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```