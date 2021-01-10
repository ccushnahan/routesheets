# Todo list

## Create route sheet

- Test it works on the pi
- At minute it only adds what is there
    - Create process to add in missing days with off?

## Send route sheet

- Set up script to email the completed routesheet to me
- Write script to take query db to get a user with a specified email address

## Work bot

- update reads csv to have a user component
    
    if (workUsers.includes(message.author.username))

- Or something similar

- Command to add a user

- When someone invited to the work group

- work bot general message => !setup 
    - Take username
    - Actual name
    - email address
    
- Start working on a db?
    - Table the reads csv basically
    - one user table
    - Not really part of the bot but more a backend to the bot that it and the other project modules can use

## Raspberry Pi stuff

- Set up cron to run createRouteSheet on a sunday
- Set up script to backup files to a mounted usb stick
- Mount a usb stick to backup files to
- Create a script to email reads.csv to an email address (amrroutesheetbackups@gmail.com) and create cron job to run it daily
- create a set up script to run to set all the stuff up in case I need to do all this stuff again
    
    !#bin/source/bash ???

    

    cd ~
    mkdir readsRecords
    touch readsRecords/reads.csv

