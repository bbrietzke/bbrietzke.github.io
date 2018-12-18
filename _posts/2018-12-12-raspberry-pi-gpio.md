---
layout: post
title: Raspberry Pi and GPIO
---

# Using LED0 & LED1

```
echo heartbeat | sudo tee /sys/class/leds/led1/trigger
echo cpu | sudo tee /sys/class/leds/led0/trigger
```

# GPIO from Bash
```
echo 3 > /sys/class/gpio/export
cat /sys/class/gpio/gpio3/value
echo out > /sys/class/gpio/gpio3/direction
echo 0 > /sys/class/gpio/gpio3/value
echo 1 > /sys/class/gpio/gpio3/value

echo high > /sys/class/gpio/gpio4/direction
```


# Sources
* [Jeff Geerling](https://www.jeffgeerling.com/blogs/jeff-geerling/controlling-pwr-act-leds-raspberry-pi)
* [GPIO with sysfs](http://www.auctoris.co.uk/2012/08/23/gpio-with-sysfs-on-raspberry-pi-part-2/)
* [Basic GPIO](http://codefoster.com/pi-basicgpio/)
