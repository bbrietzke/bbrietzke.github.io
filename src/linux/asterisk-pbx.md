# Asterisk Open Source PBX
So, in my youth ( many years ago ) I worked with a telecom company that sold properitery phone systems.  This was back in the 
day before VOIP, so you had to run cable and all that jazz.  Thankfully, you don't have to do that much anymore.

## Installation
### Prerequistes
```bash
# Create user and group
sudo groupadd --system asterisk
sudo useradd -s /sbin/nologin --system -g asterisk asterisk
```

```bash
# Install dependencies
sudo apt update && sudo apt upgrade -y

sudo apt install -y build-essential wget curl git subversion libncurses5-dev libssl-dev libedit-dev libxml2-dev uuid-dev \
    libsqlite3-dev libjansson-dev libcurl4-openssl-dev libspeexdsp-dev pkg-config libsrtp2-dev
```

### Get the Asterisk's Software
```bash
cd /usr/src/
sudo wget https://downloads.asterisk.org/pub/telephony/asterisk/asterisk-22-current.tar.gz
sudo tar -xvzf asterisk-22-current.tar.gz
cd asterisk-22.*/
```

### Asterisk Dependencies and Configuration
```bash
sudo ./contrib/scripts/install_prereq install
sudo ./configure --with-jansson-bundled
sudo make menuselect
sudo make -j$(nproc)
sudo make install
sudo make samples
sudo make config
sudo ldconfig
```

```bash
sudo sed -i 's/#AST_USER="asterisk"/AST_USER="asterisk"/' /etc/default/asterisk
sudo sed -i 's/#AST_GROUP="asterisk"/AST_GROUP="asterisk"/' /etc/default/asterisk
```

```bash
# adjust folder permissions
sudo chown -R asterisk:asterisk /var/run/asterisk
sudo chown -R asterisk:asterisk /etc/asterisk /var/lib/asterisk /var/log/asterisk /var/spool/asterisk /usr/lib/asterisk
```

### Adjust SYSTEMD nonsense
```bash
sudo systemctl edit asterisk --full
```

```ini
[Service]
User=asterisk
Group=asterisk
```

## Start the Service
```bash
sudo systemctl enable asterisk
sudo systemctl start asterisk
sudo systemctl status asterisk
sudo asterisk -rvvv
```