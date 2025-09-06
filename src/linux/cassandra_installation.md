






```
sudo apt install -y openjdk-11-jdk-headless
echo "deb [signed-by=/etc/apt/keyrings/apache-cassandra.asc] https://debian.cassandra.apache.org 41x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
sudo curl -o /etc/apt/keyrings/apache-cassandra.asc https://downloads.apache.org/cassandra/KEYS
sudo apt update && sudo apt install -y cassandra
sudo systemctl daemon-reload
sudo systemctl enable cassandra
sudo systemctl start cassandra
sudo systemctl status cassandra.service
nodetool status


```

Firewall Setup
```
sudo ufw allow 9042/tcp # Port used by Cassandra for client communication
sudo ufw allow 7000/tcp # Inter-node communication port
sudo ufw allow 7001/tcp # SSTable stream transfer port
sudo ufw allow 7199/tcp # JMX port
```