# Raspberry Pi

Some notes and sources on [Raspberry Pi]() things that I should keep track of.

Basically, I look for these things all the time, and never can find them.

## Mechanical Drawings:
[Raspberry Pi 3](https://datasheets.raspberrypi.com/rpi3/raspberry-pi-3-b-plus-mechanical-drawing.pdf)
[Raspberry Pi 4](https://datasheets.raspberrypi.com/rpi4/raspberry-pi-4-mechanical-drawing.pdf)

## Using LED0 & LED1
```
echo heartbeat | sudo tee /sys/class/leds/led1/trigger
echo cpu | sudo tee /sys/class/leds/led0/trigger
```

## GPIO from Bash
```
echo 3 > /sys/class/gpio/export
cat /sys/class/gpio/gpio3/value
echo out > /sys/class/gpio/gpio3/direction
echo 0 > /sys/class/gpio/gpio3/value
echo 1 > /sys/class/gpio/gpio3/value

echo high > /sys/class/gpio/gpio4/direction
```

## Rust
* [Raspberry Pi Peripheral Access Library](https://github.com/golemparts/rppal)

## Sources
* [Jeff Geerling](https://www.jeffgeerling.com/blogs/jeff-geerling/controlling-pwr-act-leds-raspberry-pi)
* [GPIO with sysfs](http://www.auctoris.co.uk/2012/08/23/gpio-with-sysfs-on-raspberry-pi-part-2/)
* [Basic GPIO](http://codefoster.com/pi-basicgpio/)

