# Install Grafana

```
  sudo apt-get install -y apt-transport-https software-properties-common wget
  sudo mkdir -p /etc/apt/keyrings/
  wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
  echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/na.list
  sudo apt-get update
  sudo apt-get install grafana-enterprise
  sudo /bin/systemctl daemon-reload
  sudo /bin/systemctl enable grafana-server
  sudo /bin/systemctl start grafana-server
```

reverse proxy setup

```
server {
    listen 80;
    server_name metrics; # Replace with your domain or IP
    location / {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    # For Grafana Live WebSocket connections
    location /api/live/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_pass http://localhost:3000/api/live/;
    }
}
```