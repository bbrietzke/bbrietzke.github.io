# Installing SSL on Apache2

This guide covers how to install and configure SSL certificates on Apache2 web server.

## Prerequisites

- Apache2 web server installed and running
- Domain name pointing to your server
- Root or sudo access to the server

## Step 1: Enable SSL Module

Enable the Apache2 SSL module:

```bash
sudo a2enmod ssl
sudo a2enmod rewrite
sudo systemctl restart apache2
```

## Step 2: Obtain SSL Certificate

### Option A: Using Let's Encrypt (Recommended)

Install Certbot:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-apache

# CentOS/RHEL
sudo yum install certbot python3-certbot-apache
```

Obtain certificate:

```bash
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

### Option B: Using Self-Signed Certificate (Development Only)

Create a self-signed certificate:

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/apache-selfsigned.key \
    -out /etc/ssl/certs/apache-selfsigned.crt
```

## Step 3: Configure Apache Virtual Host

Create or edit the SSL virtual host configuration:

```bash
sudo nano /etc/apache2/sites-available/yourdomain-ssl.conf
```

Add the following configuration:

```apache
<VirtualHost *:443>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem

    # Security headers
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"

    # Modern SSL configuration
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder off
    SSLSessionTickets off

    ErrorLog ${APACHE_LOG_DIR}/ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/ssl_access.log combined
</VirtualHost>
```

For self-signed certificates, use these SSL directives instead:

```apache
SSLCertificateFile /etc/ssl/certs/apache-selfsigned.crt
SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key
```

## Step 4: Enable HTTP to HTTPS Redirect

Edit the HTTP virtual host to redirect to HTTPS:

```bash
sudo nano /etc/apache2/sites-available/yourdomain.conf
```

Add redirect configuration:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    Redirect permanent / https://yourdomain.com/
</VirtualHost>
```

## Step 5: Enable Sites and Restart Apache

Enable the SSL site and restart Apache:

```bash
sudo a2ensite yourdomain-ssl.conf
sudo a2ensite yourdomain.conf
sudo systemctl restart apache2
```

## Step 6: Test SSL Configuration

Test your SSL configuration:

```bash
# Check Apache configuration
sudo apache2ctl configtest

# Test SSL certificate
sudo certbot certificates

# Online SSL test
# Visit: https://www.ssllabs.com/ssltest/
```

## Automatic Certificate Renewal

For Let's Encrypt certificates, set up automatic renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job for automatic renewal
sudo crontab -e
```

Add this line to crontab:

```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

## Firewall Configuration

Ensure HTTPS traffic is allowed:

```bash
# UFW
sudo ufw allow 'Apache Full'

# iptables
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## Troubleshooting

### Common Issues

1. **Certificate path errors**: Verify certificate file paths and permissions
2. **Mixed content warnings**: Ensure all resources load over HTTPS
3. **Redirect loops**: Check virtual host configurations

### Verify SSL Installation

```bash
# Check certificate details
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout

# Test HTTPS connection
curl -I https://yourdomain.com
```

## Security Best Practices

- Use strong SSL protocols (TLS 1.2+)
- Implement HSTS headers
- Regular certificate monitoring
- Keep Apache2 updated
- Use secure cipher suites
- Monitor SSL certificate expiration

## Additional Resources

- [Apache SSL/TLS Documentation](https://httpd.apache.org/docs/2.4/ssl/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)