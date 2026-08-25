# Configure OpenWRT as a Router

So this particular How-To is written to be specific to how OpenWrt can be made to be a router instead of a network access device.  This is a two-way communication between a host network that serves WIFI and the local network that runs off of the 
ethernet port.

Ironically, this is for a Raspberry Pi 4.  It should work for any device though.

## Make it a Router
### First Steps
You should be on a machine that is connected to the etherport of the device in question, either through a switch or a 
good ole fashioned hub.  You'll need to point your browser to `192.168.1.1` and log in as **root** with no password.

Put a password in.  Even a simple one that isn't secure but that you'll remember.

### Configure the WIFI
Go to *Network* -> *Wireless* and choose the option to **scan** for *radio0*.  Choose the your network and put the WIFI 
password in.  Hit *Submit*.  Then go to *Save & Apply*.

### Configure the Local Network
Go to *Network* -> *Interfaces* and choose *Edit* on the **LAN** interface.  Delete the entry in *IPv4 address* and put 
in the IP address and the correct subnet mask.  Hit **Save**.  Then hit *Save & Apply*

### Quickly Now!
Renew the DHCP lease ( operating system dependent ) and change the address in the browser to be what ever you put in 
for the previous step and go to the new page.  You should have a new IP address with the new network and you should be
able to hit the router at the new address.  If you can't, then re-flash and try again.

### Adjust the Firewall
Right now, the new network can see out, but the outside network cannot see if, which is fine if you want it that way.
To make it a two-way street, go to *Network* -> *Firewall* and change the **drop** to be **accept** and then hit 
**Save & Apply**.

## Testing
`traceroute` and `ping` are your friends here.  You should be able to traceroute and ping back and forth across both networks,
assuming you have hosts that you can contact.  If nothing else, test against the individual routers that you have setup.