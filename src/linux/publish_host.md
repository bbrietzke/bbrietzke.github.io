# Custom Host Publishing
If you're like me, you probably have __AVAHI__ running on all your servers just to make name resolution simplier.  What you *probably* didn't know is you can do some neat tricks with Avahi.

## Neat Trick Number One
There is a command call `avahi-publish` that will publish a hostname on your network.  This is pretty cool, because it means you don't have to remember to add the hostname to your hosts file.  It also means you can use this to publish a hostname on a server that doesn't have Avahi installed.

For example:
```
avahi-publish -a -R pandora.local 192.168.1.10 # or what-ever IP address that you want...
```

Now you can `ping pandora.local` and it will respond!

What good is this? Imagine giving your router an avahi registered name and you can log into it without having to remember the IP. If you're on Xfinity, you can do:
```
avahi-publish -a -R router.local 10.0.0.1
```

You will be able to `ping router.local` and it will respond! 

## Neat Trick Number Two
So pinging a router by name is nice and all, but not really *that* exciting.

What you can do is combine the above with Kubernetes' ingress resource definations to have multiple ingress' on the same host without having to anything magical to DNS.

## Neat Trick Number Three
Again, neat-o and all, but now you have a terminal up and running hosting names and that's just a waste of energy.  What if the terminal window closes or the machine resets? Then you have to manually execute the commands to get the network back online.

Systemd to the rescue!

```
[Unit]
Description=Avahi OwnCloud

[Service]
ExecStart=/usr/bin/avahi-publish -a -R pandora.local 10.0.0.238
Restart=always

[Install]
WantedBy=default.target
```

Save the file in `/etc/systemd/system` ( i.e. /etc/systemd/system/avahi-pandora.service ).  Then treat it as any normal service.
```
sudo systemctl enable avahi-pandora
sudo systemctl start avahi-pandora
```

