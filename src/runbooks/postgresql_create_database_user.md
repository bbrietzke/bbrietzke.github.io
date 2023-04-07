# Create Database and User for PostgreSQL
## Overview

## Pre-Requistes
* Access to login into `callisto.lan` via ssh.

## Steps
1. Log into `callisto.lan` via SSH:
    * `ssh ubuntu@callisto.lan`
1. Sudo into the `postgres` user and execute the `psql` command line tool.
    * `sudo -u postgres psql`
1. Create the database:
    * The database name should reflect the application that is using it and if it is production with the inclusion of `_prod`.
    * `CREATE DATABASE db01_prod;`
1. Create the user with an encrypted password:
    * We recommend using a long and complex password since the values will only be saved here and can be input into the target system at the same time.
    * The user name should reflect the database that they are primarily accessing.
    * `CREATE USER db01_user WITH ENCRYPTED PASSWORD 'db01_user';`
1. Grant permissions for the user to access the database:
    * `GRANT ALL PRIVILEGES ON db01_prod TO db01_user;`

## Troubleshooting
* If the target system can not log into the database after the database/user creation process, you can simply re-run the above steps to make sure to make sure that they are correct.
* If the user is present, but the password has been forgotten, you may reset the password as follows:
    * `ALTER USER db01_user WITH ENCRYPTED PASSWORD 'db01_user';`

## Completion and Verification

## Contacts
Not Applicable

## Appendix
Not Applicable