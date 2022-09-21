const asyncAuto = require('async/auto');
const {returnResult} = require('asyncjs-util');
const joinFederation = require('./join_federation');

const createInvoiceAction = 'create';
const joinAction = 'join';
const payInvoiceAction = 'pay';

module.exports = (args, cbk) => {
  return new Promise((resolve, reject) => {
    return asyncAuto({
      // Check arguments
      validate: cbk => {
        if (!args.ask) {
          return cbk([400, 'ExpectedAskFunctionToManageFedimint']);
        }

        if (!args.lnd) {
          return cbk([400, 'ExpectedLndToManageFedimint']);
        }

        if (!args.logger) {
          return cbk([400, 'ExpectedLoggerToManageFedimint']);
        }

        if (!args.request) {
          return cbk([400, 'ExpectedRequestFunctionToManageFedimint']);
        }

        if (!args.ws) {
          return cbk([400, 'ExpectedWebSocketFunctionToManageFedimint']);
        }

        return cbk();
      },

      // Ask for a fedimint action
      ask: ['validate', ({}, cbk) => {
        return args.ask({
          choices: [
            {name: 'Join Federation', value: joinAction},
            {name: 'Create Invoice', value: createInvoiceAction},
            {name: 'Pay Invoice', value: payInvoiceAction},
          ],
          loop: false,
          message: 'Select Action?',
          name: 'action',
          type: 'list',
        },
        res => cbk(null, res));
      }],

      // Join a federation
      join: ['ask', async ({ask}) => {
        // Exit early if not joining a federation
        if (ask.action !== joinAction) {
          return;
        }
        return joinFederation({
          ask: args.ask,
          lnd: args.lnd,
          logger: args.logger,
          request: args.request,
          ws: args.ws,
        },cbk)
      }]
    },
    returnResult({reject, resolve}, cbk));
  });
};
