# Prometheus
Figuring out what’s going on when something breaks can be difficult, so having the right tooling can make a big difference. Prometheus is one such tool. With proper tuning and configuration, it can even alert you before a failure occurs.

It also makes pretty graphs—everyone loves good visualisations!

## Overview
Prometheus is a free and open‑source monitoring solution that collects and records metrics from servers, containers, and applications. It provides a flexible query language (PromQL) and powerful visualisation tools, and includes an alerting mechanism that sends notifications when needed.

## Prerequisites
* A Centos derived Linux operating system
* Internet connectivity to download binaries
* ``sudo`` privileges
* ``wget`` installed

## Steps
1. First we need to create a group and the prometheus user.
    ```bash
    sudo groupadd prometheus
    sudo useradd -m -s /usr/sbin/nologin -d /var/lib/prometheus --system -g prometheus prometheus
    ```

1. Create the configuration directory.
    ```bash
    sudo mkdir -p /etc/prometheus
    ```

1. Download the most recent (as of publication) of the prometheus LTS server.  You can go to the [downloads](https://prometheus.io/download/) page to get a more recent version, or a version for a different hardware package.
    ```bash
    wget https://github.com/prometheus/prometheus/releases/download/v3.5.0/prometheus-3.5.0.linux-amd64.tar.gz
    tar xvzf prometheus*.tar.gz
    ```

1. Copy the executables and set permissions and owners.
    ```bash
    cd prometheus*/
    sudo mv prometheus /usr/local/bin
    sudo mv promtool /usr/local/bin
    sudo mv prometheus.yml /etc/prometheus
    sudo chown prometheus:prometheus /usr/local/bin/prometheus
    sudo chown prometheus:prometheus /usr/local/bin/promtool
    sudo chown -R prometheus:prometheus /etc/prometheus
    sudo chown -R prometheus:prometheus /var/lib/prometheus
    ```

1. If you are running **SELinux** you will need to execute the following to have systemd execute the file.
    ```bash
    sudo chcon -t bin_t /usr/local/bin/prometheus
    sudo semanage fcontext -a -t bin_t "/usr/local/bin/prometheus"
    sudo restorecon -v /usr/local/bin/prometheus
    ```

1. In order for prometheus to run at system start-up, you will need to create a *systemd* file.  You can use the 
following as an example.  If you wish to use other flags or command options, you can read the [reference here](https://prometheus.io/docs/prometheus/latest/command-line/prometheus/).
    ```bash
    sudo vi /etc/systemd/system/prometheus.service
    ```

    > **NOTE:** This is an example systemd file for prometheus

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

1. Enable and start the service.
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable prometheus
    sudo systemctl start prometheus
    sudo systemctl status prometheus   
    ```

1. If you wish to configure prometheus, you can read about it [here](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).
The configuration file is located at */etc/prometheus.yml*.

1. If you have the firewall enabled, you will need to open a port to view the UI.
    ```bash
    sudo firewall-cmd --permanent --add-port=9090/tcp
    sudo firewall-cmd --reload
    ```

## Troubleshooting

## Completion and Verification
* You should be able to:
    ```bash
    prometheus --version
    curl http://localhost:9090
    ```

## Contacts

## Appendix

### References
* [Flags](https://prometheus.io/docs/prometheus/latest/command-line/prometheus/)
* [Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)

### Changelog
* 2025/12/18 - Initial Version