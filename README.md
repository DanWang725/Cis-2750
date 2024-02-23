# Assignment 4

## Running

There are two sections of code that will be needed to execute to run the full stack.

### Web Server

To start the server, first run the command:

```
make
```

Then enter the command

```
python3 server.py [port]
```

where [port] is the specified port.

The intended port to use with this server is `51584`.

Then go to `localhost:[port]`

### Front End

To initialize the node server, you will need `node` and `npm`.

Run

```
yarn install --immutable
```

If the port you have entered to run for the webserver was not 51584, you will need to go to the `package.json` and edit the line:

```json
"proxy": "http://localhost:51584", //change 51584 to the port number
```

To start the front end, run the following command

```
yarn start
```

And it will automatically run on `localhost:3000`.

### Nightmare Mode

This assignment was done in nightmare mode.
The molecule has an option to continually spin.

## About

Author: Daniel Wang

ID: 1191584
