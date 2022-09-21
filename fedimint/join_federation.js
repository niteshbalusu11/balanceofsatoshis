const asyncAuto = require('async/auto');
const {returnResult} = require('asyncjs-util');

const url = 'wss://fm-signet.sirion.io:443';
const bufferAsHex = buffer => buffer.toString('hex');

function hex2a(hex) {
  let str = '';
  for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
const obj = {
  members: [[0,"wss://fm-signet.sirion.io:443"]],
  max_evil: 0,
};
module.exports = (args, cbk) => {
  return new Promise((resolve, reject) => {
    return asyncAuto({
      // Check arguments
      validate: cbk => {
        if (!args.ask) {
          return cbk([400, 'ExpectedAskFunctionToJoinFederation']);
        }

        if (!args.lnd) {
          return cbk([400, 'ExpectedLndToJoinFederation']);
        }

        if (!args.logger) {
          return cbk([400, 'ExpectedLoggerToJoinFederation']);
        }

        if (!args.request) {
          return cbk([400, 'ExpectedRequestFunctionToJoinFederation']);
        }

        if (!args.ws) {
          return cbk([400, 'ExpectedWebSocketFunctionToJoinFederation']);
        }

        return cbk();
      },

      // Join a federation
      join: ['validate', ({ask}, cbk) => {
        const socket = new args.ws(url);
        
        socket.on('open', () => {
          args.logger.info('connection opened');

          socket.send('join-federation');
        });

        socket.on('message', (data) => {
          args.logger.info('inside message');
          // args.logger.info(data);
          console.log(hex2a(bufferAsHex(data)));
        })
        
        socket.on('close', () => {
          args.logger.info('connection closed');
        });
        
        socket.on('error', (e) => {
          args.logger.info('connection error', e);
        });

        return cbk();
      }],

      send: ['join', ({}, cbk) => {
        console.log('inside send');

        return cbk();
      }],
    },
    returnResult({reject, resolve}, cbk));
  });
};
