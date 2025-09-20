```
sudo apt install -y curl apt-transport-https ca-certificates gnupg
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

sudo apt install -y postgresql-17 nodejs nginx
sudo npm install -g n8n@latest
```

configure databases
```
sudo -u postgres psql
```
execute sql
```
alter user postgres with encrypted password 'password';
create database n8n_prod;
create user n8n with password 'password';
alter database n8n_prod owner to n8n;
\q
```


create n8n user
```
sudo groupadd --system n8n
sudo useradd -m -d /var/lib/n8n -s /sbin/nologin --system -g n8n n8n
```

### Run at Startup
```
sudo nano /etc/systemd/system/n8n.service
```
```
[Unit]
Description=N8N Workflow
Wants=network-online.target
After=postgresql.target

[Service]
User=n8n
Group=n8n
Type=simple
Restart=always
RestartSec=10
Environment=N8N_EMAIL_MODE=smtp
Environment=N8N_SMTP_HOST=
Environment=N8N_SMTP_PORT=587
Environment=N8N_SMTP_USER=
Environment=N8N_SMTP_PASS=
Environment=N8N_SMTP_SENDER=n8n@brietzke.me
Environment=DB_TYPE=postgresdb
Environment=DB_POSTGRESDB_DATABASE=n8n_prod
Environment=DB_POSTGRESDB_HOST=localhost
Environment=DB_POSTGRESDB_PORT=5432
Environment=DB_POSTGRESDB_USER=n8n
Environment=DB_POSTGRESDB_PASSWORD=password
Environment=DB_POSTGRESDB_SCHEMA=public
Environment=N8N_SECURE_COOKIE=false
Environment=GENERIC_TIMEZONE=America/Chicago
Environment=N8N_EDITOR_BASE_URL=https://workflow.example.org
Environment=N8N_HOST=https://workflow.example.org
Environment=WEBHOOK_URL=https://workflow.example.org
WorkingDirectory=/var/lib/n8n
ExecStart=/usr/bin/n8n

[Install]
WantedBy=multi-user.target
```
```
sudo systemctl daemon-reload
sudo systemctl enable n8n
sudo systemctl start n8n
sudo systemctl status n8n
```

install qdrant
```
wget https://github.com/qdrant/qdrant/releases/download/v1.15.4/qdrant_1.15.4-1_amd64.deb
sudo dpkg -i qdrant_1.15.4-1_amd64.deb
```

create qdrant user
```
sudo groupadd --system qdrant
sudo useradd -m -d /var/lib/qdrant -s /sbin/nologin --system -g qdrant qdrant
sudo touch /var/lib/qdrant/config.yaml
sudo chown -R qdrant:qdrant /var/lib/qdrant/
```

qdrant config file
```
sudo nano /var/lib/qdrant/config.yaml
```
```
log_level: INFO
storage:
  storage_path: ./storage
  snapshots_path: ./snapshots
  snapshots_config:
    snapshots_storage: local
  temp_path: null
  on_disk_payload: true
  update_concurrency: null
  wal:
    wal_capacity_mb: 32
    wal_segments_ahead: 0
  node_type: "Normal"
  performance:
    max_search_threads: 0
    max_optimization_threads: 0
    optimizer_cpu_budget: 0
    update_rate_limit: null
  optimizers:
    deleted_threshold: 0.2
    vacuum_min_vector_number: 1000
    default_segment_number: 0
    max_segment_size_kb: null
    memmap_threshold_kb: null
    indexing_threshold_kb: 20000
    flush_interval_sec: 5
    max_optimization_threads: null
  hnsw_index:
    m: 16
    ef_construct: 100
    full_scan_threshold_kb: 10000
    max_indexing_threads: 0
    on_disk: false
    payload_m: null
  shard_transfer_method: null
  collection:
    replication_factor: 1
    write_consistency_factor: 1
    vectors:
      on_disk: null
    quantization: null
    strict_mode:
      enabled: false
      max_query_limit: null
      max_timeout: null
      unindexed_filtering_retrieve: null
      unindexed_filtering_update: null
      search_max_hnsw_ef: null
      search_allow_exact: null
      search_max_oversampling: null
service:
  max_request_size_mb: 32
  max_workers: 0
  host: 0.0.0.0
  http_port: 6333
  grpc_port: 6334
  enable_cors: true
  enable_tls: false
  verify_https_client_certificate: false
telemetry_disabled: false
```


### Run at Startup
```
sudo nano /etc/systemd/system/qdrant.service
```
```
[Unit]
Description=Qdrant Vector Store
Wants=network-online.target
After=postgresql.target

[Service]
User=qdrant
Group=qdrant
Type=simple
Restart=always
RestartSec=10
WorkingDirectory=/var/lib/qdrant
ExecStart=/usr/bin/qdrant --config-path /var/lib/qdrant/config.yaml

[Install]
WantedBy=multi-user.target
```
```
sudo systemctl daemon-reload
sudo systemctl enable qdrant
sudo systemctl start qdrant
sudo systemctl status qdrant
```


configure nginx port forwarding
```
sudo nano /etc/nginx/sites-available/default
```

```
server {
    listen 80;
    server_name workflow;  # Replace with your actual domain or use localhost

    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

```
sudo nginx -t && sudo systemctl restart nginx
```


option, enable firewall
```
sudo ufw allow http
sudo ufw allow https
sudo ufw allow ssh
sudo ufw enable
```