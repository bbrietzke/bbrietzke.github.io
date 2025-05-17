# Systems and Application Notifications with Alert Manager
So you have Prometheus, the next step is AlertManager, which will notify you when an something goes awry.

## AlertManager?
The Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts.

## Prerequisites
A machine that can run Ubuntu 22.04 ( or other LTS ).

You should also have basic administrative knowledge and an account that has sudo access on the above box.

## Installation
### Update the system
```
sudo apt update && sudo apt -y upgrade
```

### Create the AlertManager User Account
```
sudo groupadd --system alertmanager
sudo useradd -s /sbin/nologin --system -g alertmanager alertmanager
```

### Create Directories
These are for configuration files and libraries.
```
sudo mkdir /etc/alertmanager
sudo mkdir /var/lib/alertmanager
```

### Install AlertManager
Now for the fun part!
```
// https://prometheus.io/download/#alertmanager
wget https://github.com/prometheus/alertmanager/releases/download/v0.28.1/alertmanager-0.28.1.linux-arm64.tar.gz
tar zvxf alertmanager*.tar.gz
cd alertmanager*/
sudo mv alertmanager /usr/local/bin
sudo mv amtool /usr/local/bin
sudo chown alertmanager:alertmanager /usr/local/bin/alertmanager
sudo chown alertmanager:alertmanager /usr/local/bin/amtool

sudo mv alertmanager.yml /etc/alertmanager
```


### Run at Startup
```
sudo nano /etc/systemd/system/alertmanager.service
```

with

```
[Unit]
Description=AlertManager
Wants=network-online.target
After=network-online.target

[Service]
User=alertmanager
Group=alertmanager
Type=simple
ExecStart=/usr/local/bin/alertmanager \
    --config.file /etc/alertmanager/alertmanager.yml \
    --storage.path=/var/lib/alertmanager

[Install]
WantedBy=multi-user.target
```

```
sudo systemctl daemon-reload
sudo systemctl enable alertmanager
sudo systemctl start alertmanager
sudo systemctl status alertmanager



```