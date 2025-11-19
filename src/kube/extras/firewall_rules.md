


```bash
sudo apt update
sudo apt install ufw
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw allow 2379/tcp
sudo ufw allow 10250/tcp # Inbound to all nodes
sudo ufw allow 6443/tcp  # Inbound to master node(s)
sudo ufw allow 2380/tcp # Inbound to master node(s)
sudo ufw allow 30000:32767/tcp # Inbound to worker node(s)

```