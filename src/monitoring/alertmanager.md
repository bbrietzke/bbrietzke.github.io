# Alert Manager
Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts.

## Overview
When Prometheus detects issues based on your alert rules, something needs to manage those alerts intelligently. That's where Alertmanager comes in. It receives alerts from Prometheus, groups related alerts together to reduce noise, routes them to the right notification channels (email, Slack, PagerDuty, etc.), and lets you silence alerts during maintenance. This runbook covers setting up a single Alertmanager instance to work with your Prometheus installation.

## Prerequisites
* A Centos derived Linux operating system
* Internet connectivity to download binaries
* Prometheus installed (can be on same or different host)
* ``sudo`` privileges
* ``wget`` installed

## Steps
1. First we need to create a group and the alert manager user.
    ```bash
    sudo groupadd alertmanager
    sudo useradd -m -s /usr/sbin/nologin -d /var/lib/alertmanager --system -g alertmanager alertmanager
    ```

1. Create the configuration directory.
    ```bash
    sudo mkdir -p /etc/alertmanager
    ```

1. Download the most recent (as of publication) package of alert manager and extract it.  You can go to the 
[alert manager download](https://prometheus.io/download/#alertmanager) page and check for the latest one.
    ```bash
    wget https://github.com/prometheus/alertmanager/releases/download/v0.30.0/alertmanager-0.30.0.linux-amd64.tar.gz
    tar xvzf alert*.tar.gz
    ```

1. Copy the executables and set permissions and owners.
    ```bash
    cd alert*/
    sudo mv alertmanager /usr/local/bin
    sudo mv amtool /usr/local/bin
    sudo mv alertmanager.yml /etc/alertmanager
    sudo chown alertmanager:alertmanager /usr/local/bin/alertmanager
    sudo chown alertmanager:alertmanager /usr/local/bin/amtool
    sudo chown -R alertmanager:alertmanager /etc/alertmanager
    sudo chown -R alertmanager:alertmanager /var/lib/alertmanager
    ```

1. If you are running **SELinux** you will need to execute the following to have systemd execute the file.
    ```bash
    sudo chcon -t bin_t /usr/local/bin/alertmanager
    sudo semanage fcontext -a -t bin_t "/usr/local/bin/alertmanager"
    sudo restorecon -v /usr/local/bin/alertmanager
    ```

1. In order for alert manager to run at system start-up, you will need to create a *systemd* file.  You can use the 
following as an example.  If you wish to use other flags or command options, you can read the [reference here](https://prometheus.io/docs/alerting/latest/configuration/).
    ```bash
    sudo vi /etc/systemd/system/alertmanager.service
    ```

    > **NOTE:** This is an example systemd file for alert manager

    ```ini
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

1. Enable and start the service.
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable alertmanager
    sudo systemctl start alertmanager
    sudo systemctl status alertmanager   
    ```

1. If you have the firewall enabled, you will need to open a port to view the UI.
    ```bash
    sudo firewall-cmd --permanent --add-port=9093/tcp
    sudo firewall-cmd --permanent --add-port=9094/tcp
    sudo firewall-cmd --reload
    ```

## Troubleshooting

### Service fails to start
```bash
journalctl -u alertmanager -n 50 --no-pager
```

### Configuration validation
```bash
# Validate alertmanager.yml syntax
amtool check-config /etc/alertmanager/alertmanager.yml
```

### Port conflicts
```bash
sudo ss -tlnp | grep -E '9093|9094'
```

### Prometheus not sending alerts
- Check Prometheus configuration: `promtool check config /etc/prometheus/prometheus.yml`
- Verify alert rules: `promtool check rules /etc/prometheus/alert_rules.yml`
- Check Prometheus targets: `curl http://localhost:9090/api/v1/alertmanagers`

### SELinux issues
```bash
sudo ausearch -m avc -ts recent | grep alertmanager
```

## Completion and Verification
* You should be able to:
    ```bash
    alertmanager --version

    curl http://localhost:9093

    amtool config show --alertmanager.url=http://localhost:9093
    ```

## Contacts

## Appendix
### Minimal alertmanager.yml
    ```yaml
    # Example /etc/alertmanager/alertmanager.yml with email notifications
    global:
        resolve_timeout: 5m
        smtp_smarthost: 'smtp.gmail.com:587'
        smtp_from: 'alerts@example.com'
        smtp_auth_username: 'alerts@example.com'
        smtp_auth_password: 'your-app-password'

    route:
        group_by: ['alertname', 'cluster']
        group_wait: 10s
        group_interval: 10s
        repeat_interval: 12h
        receiver: 'email-notifications'

    receivers:
        - name: 'email-notifications'
        email_configs:
            - to: 'oncall@example.com'
            headers:
                Subject: '[ALERT] {{ .GroupLabels.alertname }}'
    ```

### References
   - [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
   - [Configuration Reference](https://prometheus.io/docs/alerting/latest/configuration/)
   - [Notification Templates](https://prometheus.io/docs/alerting/latest/notifications/)
   - [amtool Documentation](https://github.com/prometheus/alertmanager#amtool)

### Changelog
* 2025/12/19 - Initial Version