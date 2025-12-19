# Node Exporter
Node Exporter is a Prometheus exporter for hardware and OS metrics exposed by *NIX kernels. It collects system-level metrics such as CPU, memory, disk I/O, network statistics, and file system usage, making them available to Prometheus for monitoring and alerting.

## Overview
Node Exporter is what is used to retrieve metrics from a host.  These metrics are fed into prometheus to allow 
for meaningful visualizations and alerting.

## Prerequisites
* A Centos derived Linux operating system
* Internet connectivity to download binaries
* Prometheus install on this or another machine
* ``sudo`` privileges
* ``wget`` installed

## Steps
1. First we need to create a group and the node exporter user.
    ```bash
    sudo groupadd node_exporter
    sudo useradd -m -s /usr/sbin/nologin -d /var/lib/node_exporter --system -g node_exporter node_exporter
    ```

1. Download the most recent (as of publication) package of node exporter and extract it.  You can go to the 
[node exporter download](http://prometheus.io/download/#node_exporter) page and check for the latest one.
    ```bash
    wget https://github.com/prometheus/node_exporter/releases/download/v1.10.2/node_exporter-1.10.2.linux-amd64.tar.gz
    tar xvzf node*.tar.gz
    ```

1. Install the binaries and set permissions.
    ```bash
    cd node*/
    sudo mv node_exporter /usr/local/bin
    sudo chown node_exporter:node_exporter /usr/local/bin/node_exporter
    sudo chown -R node_exporter:node_exporter /var/lib/node_exporter
    ```

1. In order for node exporter to run at system start-up, you will need to create a *systemd* file.  You can use the 
following as an example.  
    ```bash
    sudo vi /etc/systemd/system/node_exporter.service
    ```
    
    > **NOTE:** This is an example systemd file for node exporter

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
        --web.listen-address=0.0.0.0:9100 \
        --collector.textfile.directory=/var/lib/node_exporter

    [Install]
    WantedBy=multi-user.target
    ```

1. Enable and start the node exporter service.
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable node_exporter
    sudo systemctl start node_exporter
    sudo systemctl status node_exporter   
    ```

1. If you have the firewall enabled, you will need to open a port to allow remote metric collection.
    ```bash
    sudo firewall-cmd --permanent --add-port=9100/tcp
    sudo firewall-cmd --reload
    ```

1. If you are running **SELinux** you will need to execute the following to have systemd execute the file.
    ```bash 
    sestatus

    sudo chcon -t bin_t /usr/local/bin/node_exporter
    sudo semanage fcontext -a -t bin_t "/usr/local/bin/node_exporter"
    sudo restorecon -v /usr/local/bin/node_exporter
    ```


## Troubleshooting

## Completion and Verification
* You should be able to:
    ```bash
    curl http://localhost:9100/metrics
    curl http://localhost:9100/metrics | grep node_cpu

    node_exporter --version
    ```

## Contacts

## Appendix

### References
* [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)
* [Available Collectors](https://github.com/prometheus/node_exporter#enabled-by-default)
* [Node Exporter - Github](https://github.com/prometheus/node_exporter)

### Changelog
* 2025/12/19 - Initial Version