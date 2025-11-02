## Install Apache Cassandra

```bash
# Install Java (Cassandra 4.x requires Java 11)
sudo apt install -y openjdk-11-jdk-headless

# Add the Cassandra repository and its key
echo "deb [signed-by=/etc/apt/keyrings/apache-cassandra.asc] https://debian.cassandra.apache.org 41x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
sudo curl -o /etc/apt/keyrings/apache-cassandra.asc https://downloads.apache.org/cassandra/KEYS

# Update package lists and install Cassandra
sudo apt update && sudo apt install -y cassandra

# Reload systemd, enable, and start the Cassandra service
sudo systemctl daemon-reload
sudo systemctl enable cassandra
sudo systemctl start cassandra

# Verify the service status
sudo systemctl status cassandra.service
nodetool status
```

> **Tip:** 
> After the first startup, Cassandra may take a minute or two to open all its ports. 
> Use `nodetool status` to confirm that the node reports `UN` (Up/Normal).

## Firewall Setup

```bash
# Port used by Cassandra for client communication (CQL)
sudo ufw allow 9042/tcp

# Inter‑node communication port (native transport)
sudo ufw allow 7000/tcp

# SSTable stream transfer port
sudo ufw allow 7001/tcp

# JMX port (remote management)
sudo ufw allow 7199/tcp
```

> **Note:** 
> If you use SSL for inter‑node communication, you’ll also need to open port 7002/tcp.

---

**References**

- [Apache Cassandra Official Documentation](https://cassandra.apache.org/doc/latest/)
- [Debian Package Repository for Cassandra](https://debian.cassandra.apache.org/)