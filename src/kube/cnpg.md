# Cloud Native PostgreSQL

It's hard to build modern applications without a database.  I prefer PostgreSQL and this is the 
operator that will help setup a clustered PostgreSQL installation in Kubernetes

## Installation

```bash
kubectl apply --server-side -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.30/releases/cnpg-1.30.0.yaml
```

## The Actual Cluster

You will want to use a good and fast network attached storage to keep database performance high. I'm using iSCI here.

```bash
kubectl create namespace db
```

```yaml
---
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgresql
  namespace: db
spec:
  instances: 3
  postgresql:
    parameters:
      shared_buffers: "256MB"
  storage:
    size: 50G
    storageClass: iscsi
  resources:
    requests:
      memory: "1024Mi"
      cpu: 500m
    limits:
      memory: "4096Mi"
      cpu: 2000m
```

To create a role and a database, you will need to also create a secret to hold the password for the role.

```yaml
---
apiVersion: v1
data:
  username: YXBwLW5hbWU=
  password: YWxsZWdvcnk=
kind: Secret
metadata:
  name: pqsql-secret-application-name
  labels:
    cnpg.io/reload: "true"
type: kubernetes.io/basic-auth
```

Now let's create a role and a database:

```yaml
---
apiVersion: postgresql.cnpg.io/v1
kind: DatabaseRole
metadata:
  name: role-application-name
spec:
  cluster:
    name: postgresql
  name: app-name
  comment: "Descriptive Application Name"
  login: true
  superuser: false
  createdb: false
  databaseRoleReclaimPolicy: retain
  inRoles:
    - pg_monitor
  passwordSecret:
    name: pqsql-secret-application-name
---
apiVersion: postgresql.cnpg.io/v1
kind: Database
metadata:
  name: application-db
spec:
  name: application-name
  owner: app-name
  cluster:
    name: postgresql
  extensions:
    - name: pgvector
      ensure: present
```