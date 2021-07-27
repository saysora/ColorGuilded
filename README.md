# ColorGuilded
A simple addon to Guilded to allow users to have some appearance controls over Guilded

To use before installer / sustainable way of distribution follow instructions below

### Alpha usage
Download the latest release and follow the install instructions below.

Please keep in mind that this is not fully finished, not every area is matched up to be a working themed piece (yet).
The goal here is to give the user a simple hex / slider input fields so that they can customize Guilded's color theme to their liking, as well as resize emojis and chat text.

To toggle the theme dialogue once the files are installed, reopen Guilded after placing the files in the proper instructions below, then use the keybind of `ctrl .` to toggle the theme window. That's control (ctrl) and period (.) 

Feel free to open issues if you have any problems

As well you can talk to me directly thru Guilded at (https://guilded.hch)[https://guilded.gg/hch]

##### Windows Users
Navigate to C:\\Users\<Username>\AppData\Local\Programs\Guilded\resources\app
Put index.js and preload.js and package.json files into app folder

File structure after install should be:
`C:\\Users\<Username>\AppData\Local\Programs\Guilded\resources\app\package.json`
`C:\\Users\<Username>\AppData\Local\Programs\Guilded\resources\app\index.js`
`C:\\Users\<Username>\AppData\Local\Programs\Guilded\resources\app\preload.js`


##### Linux Users
Navigate to /opt/Guilded/resources/app
Put `assets` folder `index.js` `package.json` and `preload.js` in the app folder.
File structure after install should be:
`/opt/Guilded/resources/app/assets`
`/opt/Guilded/resources/app/index.js`
`/opt/Guilded/resources/app/package.json`
`/opt/Guilded/resources/app/preload.js`

##### Mac Users - Coming Soon

#### Is it ok?
As of now, Guilded has yet to reprimand the usage of extensions made within good faith.
