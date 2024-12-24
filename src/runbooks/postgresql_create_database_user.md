# Create User for PostgreSQL
## Overview

## Pre-Requistes
* Access to login into database server via ssh.
* `sudo` access on database server

## Steps
1. Log into database server via SSH.
1. Sudo into the `postgres` user and execute the `psql` command line tool.
    * `sudo -u postgres psql`
1. Create the user with and encrypted password:
   * We recommend using a long and complex password since the values will only be saved here and can be input into the target system at the same time.
   * The user name should reflect the database that they are primarily accessing.
   * `CREATE USER db01 WITH ENCRYPTED PASSWORD 'R3@llyL0ngP@ssw0rd123456790';`
1. Grant the new user dbcreate privileges:
   * `ALTER USER db01 CREATEDB;` 

## Troubleshooting
* If the target system can not log into the database after the database/user creation process, you can simply re-run the above steps to make sure to make sure that they are correct.
* If the user is present, but the password has been forgotten, you may reset the password as follows:
    * `ALTER USER db01_user WITH ENCRYPTED PASSWORD '3^On9D4p59^4';`

## Completion and Verification
You can log into the target database from `callisto.lan` to verify if everything is setup correctly
```
psql -h 'callisto.lan' -U 'db01' -d 'db01_prod'
```
It will prompt you for the password, which we have available and should provide.  If the login occurs, then the database/user/permissions should be okay.

## Contacts
Not Applicable

## Appendix
### Changelog
    * 2023/04/06 - Created