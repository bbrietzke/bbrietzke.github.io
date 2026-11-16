# Python Trading Bot
I wish to have a python trading bot that deals with crypto-currencies, in particular Ethereum.  The bot should be able to have multiple algorithms associated with it in a *Strategy design pattern*.  There should also be a database ( with it's own strategy pattern ) to allow for tracking of transactions, money earned and fees.

There should be a paper-trading mode in addition to a live-mode.

The primary broker will be CoinBase, though this should be in and of itself a strategy pattern to allow for the paper-trading mode and possibly other brokers.

## Configuration
All configuration should be done through environment variables with logical defaults if a value is not provided.

## Algorithms
The first algorithm strategy should be a simple RSI pattern.  

Data should be gathered on an interval.  Preffered interval are 15 seconds, 30 seconds, 1 minute, 5 minutes, 15 minutes, 30 minutes and 1 hour.

## Extras
There should be a stop-loss escape hatch.

There should be a Prometheus endpoint that tracks crypto-currency price, the current RSI, whether or not we are in a position, the available funds on hand, the amount of crypto purchased and the equity.

Presentation of data should be a strategy as well.  I can very well see this having a either web or TUI front end besides a simple log output.  This front-end should allow for manual purchases as well as manual selling options.

## Kubernetes
This bot will run inside a Kubernetes environment.  We will need a docker file that will build a container that can be pushed to a repository and then pulled into a Kubernetes cluster for execution.

There will need to be liveness and readyness checks.  The ready-ness check should include a check to make sure that we can talk with the broker API ( either coinbase or others as part of the broker strategy ) to make sure we are getting data.  