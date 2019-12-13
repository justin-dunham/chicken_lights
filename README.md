# Chicken Lights
Automated solution for controlling [Wyze bulbs](https://amzn.to/2oCULfK) using [IFTTT Webhooks](https://ifttt.com/maker_webhooks)

## Problem
Laying hens egg production is greatly dependend on the hours of daylight. To maximize production hens require at least 14 hours of daylight. 
My hens free range, I want to encourage them to return to their roost at dusk. I want to use as much natural light as possible to reduce energy consumtion of the bulb.

## Solution
Additional light hours will be added before sunrise, sunset is always the end of the day.


## Setup
If you want to use it yourself the setup is something along these lines.
* Install Wyze bulbs
* Link to IFTTT account
* Create IFTTT recipes using webhooks
* Sign up for [Dark Sky API](https://darksky.net/dev/docs) access
* 


## TODO

I am hoping that Wyze will come out with a direct API to remove the requirement for IFTTT but as it stands there is no direct integration.

## Feedback / Usage

I have now used this solution for two months. Overall it has been working great,  there are a couple of small issues I would like to find a solution for. 
* When power is lost the light turns to an on state when restored, this seems like an option which should be configurable on the bulb
* I run this is a cron job on a RasberryPi but it requires running 24-7
