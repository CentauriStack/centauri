# Centauri

** Warning: This bot is still in development and there IS NO GUARANTEE, NO DOCS, and little support! Use at your own risk for now! **

## About

Centauri is a complex Discord Moderation Bot with a few features for now but more will be added in the future.

## Actively being Used on the following servers:
- [The Zerio Community](https://discord.gg/5cGSYV8ZZj)

## Features

- Link Moderation
- Welcome Messages (with a few options)


## Configuration

config.js 

file located in the main folder `config.js`. (you need to create this file yourself, all configs are below)

```js
module.exports = {
    Tokens: { 
        Discord: 'XXX',
        Mongo: 'XXX'
    },
    Bot: {
        Global: false,
        Guild: 'XXX',
        playing: 'XXX'
    
    },
     Colors: {
        Default: '#2F3136',
        Error: '#FF0000',
        AutoModAlert: '#FF2D00',
        AutoModWarn: '#FAF605',
        AutoModAction: '#FAA005',
        AutoModMessage: '#27FA05',
        WelcomeMessage: '#2f3136',
    },
    
  
}
```
