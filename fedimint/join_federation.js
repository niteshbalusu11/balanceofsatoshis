const asyncAuto = require('async/auto');
const {returnResult} = require('asyncjs-util');

const url = 'wss://fm-signet.sirion.io:443';


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

          socket.send('yo!');
        });

        socket.on('message', (data) => {
          args.logger.info('inside message');
          args.logger.info(data);
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
