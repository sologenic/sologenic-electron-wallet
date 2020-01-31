'use strict';
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const ripple_lib_1 = require('ripple-lib');
const RippleError = __importStar(require('ripple-lib/dist/npm/common/errors'));
const error_1 = require('./error');
const mathjs_1 = require('mathjs');
const stxmq_1 = require('./stxmq');
const events_1 = require('events');
const uuid_1 = require('uuid');
const wait = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
class SologenicTxHandler extends events_1.EventEmitter {
  /**
     * Constructor
     *
     * @param rippleApiOptions This parameter is used to construct ripple-lib and takes in:
            server?: string;
            feeCushion?: number; // This property is overridden by Sologenic to 1
            maxFeeXRP?: string;
            trace?: boolean;
            proxy?: string;
            timeout?: number; // This property is overridden by Sologenic to 1000000
  
     * @param sologenicOptions
          {
            queueType?: QueueType;
  
            redis?: {
              port?: number;
              host?: string;
              family?: number;
              password?: string;
              db?: number;
            };
          }
  
      @example sologenicOptions: {
  
            // Clear queues before initilizing, default to false
            clearCache: true,
  
            // When using in-memory hashes
            queueType: 'hash',
            hash: {}
  
            // When using redis
            queueType: 'redis',
            redis: {
              host: 'localhost',
              port: 6379,
              family: 'redis5.0',
              password: 'password',
              db: '1',
            }
          }
     */
  constructor(rippleApiOptions, sologenicOptions) {
    super();
    this.clearCache = false;
    this.account = '';
    this.secret = '';
    this.keypair = { publicKey: '', privateKey: '' };
    this.txEvents = {};
    this.feeCushion = 1.2;
    this.sequence = 0;
    try {
      /* Initialize RippleAPI driven from the ripple-lib. Sologenic uses the following methods from this library:
            connect()
            on()
            isValidAddress()
            isConnected()
            getLedgerVersion()
            getFee()
            request()
            xrpToDrops()
            sign()
            submit()
            getTransaction()
            txFlags
            */
      this.rippleApi = new ripple_lib_1.RippleAPI(
        Object.assign({ feeCushion: 1, timeout: 1000000 }, rippleApiOptions)
      );
      // Subscribe to ripple-lib on("") events
      this._subscribeWS();
      // Init ledger object
      this.ledger = {
        baseFeeXRP: '0',
        ledgerTimestamp: '0',
        ledgerVersion: 0
      };
      /*
              Initialize TXMQƨ (Sologenic Transaction Message Queue)
            */
      try {
        this.txmq = new stxmq_1.TXMQƨ(sologenicOptions); // Pass on the queue connection details
      } catch (error) {
        throw new error_1.SologenicError('1002');
      }
      // Set clearCache to true if the client needs to ignore and clean the queue before starting
      if (
        typeof sologenicOptions.clearCache !== 'undefined' &&
        sologenicOptions.clearCache
      ) {
        this.clearCache = true;
      }
      /*
              Initialize BigNumber
            */
      this.math = mathjs_1.create(mathjs_1.all, {
        epsilon: 1e-12,
        number: 'BigNumber',
        precision: 64
      });
    } catch (error) {
      throw new error_1.SologenicError('1001', error);
    }
  }
  /* Added for testing support to be able to override base fee */
  setLedgerBaseFeeXRP(fee) {
    this.ledger.baseFeeXRP = fee;
    return this;
  }
  getLedgerBaseFeeXRP() {
    return this.ledger.baseFeeXRP;
  }
  /* Added for testing support to set ledger version */
  setLedgerVersion(version) {
    this.ledger.ledgerVersion = version;
    return this;
  }
  getLedgerVersion() {
    return this.ledger.ledgerVersion;
  }
  /* Added for testing support to set account sequence */
  setAccountSequence(sequence) {
    this.sequence = sequence;
    return this;
  }
  getAccountSequence() {
    return this.sequence;
  }
  /**
   * Expose the ripple API so that our tests can use it to check
   * transaction status and states.
   */
  getRippleApi() {
    return this.rippleApi;
  }
  /**
   * Connect to various services: RippleAPI, fetch current ledger state.
   */
  async connect() {
    try {
      await this.getRippleApi().connect();
      await this._connected();
      // Start the dispatcher listener
      this._dispatch();
      // Start the validator listener
      this._validateOnLedger();
      // Return the current class
      return this;
    } catch (error) {
      // if there is a disconnection error, keep trying until connection is made. Retry in 1000ms
      if (error instanceof RippleError.DisconnectedError) {
        await this._connected();
        return this;
        // throw new SologenicError('1003');
      }
      return this;
    }
  }
  async setAccount(account) {
    console.log('setAccount: ', 1, account);

    try {
      /*
              Is this a valid XRP address?
            */
      if (this.getRippleApi().isValidAddress(account.address)) {
        console.log('setAccount: ', 2);
        this.account = account.address;
      } else {
        console.log('setAccount: ', 3);

        throw new error_1.SologenicError(
          '2000',
          new RippleError.ValidationError()
        );
      }
      /*
              Is this a valid XRP secret? and if no keypair is set
            */
      if (typeof account.keypair === 'undefined') {
        console.log('setAccount: ', 4);

        if (this.getRippleApi().isValidSecret(account.secret)) {
          console.log('setAccount: ', 5);

          this.secret = account.secret;
        } else {
          console.log('setAccount: ', 6);

          throw new error_1.SologenicError(
            '2001',
            new RippleError.ValidationError()
          );
        }
      } else {
        console.log('setAccount: ', 7);

        this.keypair = account.keypair;
      }

      console.log('setAccount: ', 2, this.secret, this.account, this.keypair);

      // Fetch the current state of the ledger and account sequence
      await this._fetchCurrentState();
      if (this.clearCache) {
        await this.txmq.delAll();
      } else {
        // proccess missed transactions before continuing.
        // Transactions can be missed if they are in the dispatched state. This function processes previous
        // transactions left in the queue, if any.
        await this._validateMissedTransactions();
      }
    } catch (error) {
      throw new error_1.SologenicError('1001', error);
    }
  }
  /**
   * Submit transaction to system. This transaction will then be move to persistent data storage(Redis) or hash store and will be handeled.
   * Each transaction is assigned an id (uuid) to be tracked in the system. Assigned IDs remain with the transaction until validated.
   * Since the transactions are not final until validated, the only way to track transactions in the system is to track them with
   * ids across different channels in the system (e.g. message queue). This ID is also submitted as a refference withing the transaction
   * in the Memo field (HEX representation)
   * Submit() is non-blocking, but returns an object with three properties explain in the return.
   *
   * @param tx Transaction Object e.g.:
   *  {
   *    TransactionType: "AccountSet",
   *    Account: "rEzaLebaTBXNy7C4s8Ru7yxxkE65bDAAkF",
   *    SetFlag: 5
   *  }
   *  It is important to note that certain properties such as Fee, Sequence, Flags, LastLedgerSequence are inserted by this class
   *  and are overridden if provided.
   *
   * @returns TransactionObject
   *    events: Each instance of the submit() gets an instance of `EventEmitter` these events are emitted when certain actions take place
   *            within the transaction submission.
   *            Events: queued, dispatched, requeued, warning, validated
   *    id: This is the uuid generated in a non-blocking approach so clients can later use this id for refference. The id is of type of string
   *        and are generated using v4 of uuid library. e.g: 6316751c-bde4-412b-ac9a-7d05e548171f
   *    promise: This property contains a promise and resolves only when a transaction has been validated.
   *              Contains: hash, dispatchedSequence, accountSequence, ledgerVersion, timestamp, fee
   */
  submit(tx) {
    try {
      // Generate a unique ID using the uuid library
      const id = uuid_1.v4();
      // Add a new EventEmitter to txEvents array identifiable with the generated id.
      this.txEvents[id] = new events_1.EventEmitter();
      this._initiateTx(id, tx);
      return {
        events: this.txEvents[id],
        id,
        promise: (() => {
          return this._resolve(id);
        })()
      };
    } catch (error) {
      return error;
    }
  }
  async _connected() {
    if (this.getRippleApi().isConnected()) {
      return true;
    } else {
      await wait(100);
      return this._connected();
    }
  }
  /**
   * recursivley loop and query TXMQƨ to see when the id is validated
   * @param id
   * @returns ResolvedTX
   */
  async _resolve(id) {
    const validated = await this.txmq.get('txmq:validated:' + this.account, id);
    if (typeof validated !== 'undefined') {
      return validated.data;
    } else {
      const failed = await this.txmq.get('txmq:failed:' + this.account, id);
      if (typeof failed !== 'undefined') {
        return failed.data;
      }
      // retry in 100ms
      await wait(100);
      return this._resolve(id);
    }
  }
  /**
   *  Fetch the current ledger and account information to be used for transaction submission
   */
  async _fetchCurrentState() {
    try {
      // If the Ripple API is not connected, make sure we connect.
      if (!this.getRippleApi().isConnected()) {
        await this.connect();
      }
      // Use the ripple-lib built in REST functions to get the ledger version and fee. Please note that these
      // values are updated using the WS after the first initilization, until this method is called again
      this.setLedgerVersion(await this.getRippleApi().getLedgerVersion());
      this.setLedgerBaseFeeXRP(await this.getRippleApi().getFee());
      // Get account info of the current XRP account and set the sequence to submit transactions
      const account = await this.getRippleApi().request('account_info', {
        account: this.account
      });
      this.setAccountSequence(account.account_data.Sequence);
    } catch (error) {
      // if there is a disconnection error, keep trying until connection is made. Retry in 1000ms
      if (error instanceof RippleError.DisconnectedError) {
        // wait for connection to be re-established
        await this.connect();
        // try fetching the current state again
        await this._fetchCurrentState();
        // Unspecific RippleError
      } else if (error instanceof RippleError.RippledError) {
        throw new error_1.SologenicError('1004', error);
      } else {
        throw new error_1.SologenicError('1000', error);
      }
    }
  }
  /*
    Testing helper to get the current state, so we can make sure we
    actually got the next sequence */
  async fetchCurrentState() {
    await this._fetchCurrentState();
    return this.sequence;
  }
  /**
   * Subscribe to ripple-lib ws implementation of XRPL WebSockets
   */
  _subscribeWS() {
    try {
      this.getRippleApi().on('connect', () => {
        // Reconnect
      });
      this.getRippleApi().on('disconnect', () => {
        // Reconnect
        this.connect();
      });
      this.getRippleApi().on('error', () => {
        // Reconnect
        this.connect();
      });
      this.getRippleApi().on('ledger', ledger => {
        // Update the ledger version
        this.ledger = ledger;
      });
    } catch (error) {
      throw new error_1.SologenicError('1005', error);
    }
  }
  /**
   * Initiate the transaction, prepare it to add the queue
   * @param id
   * @param tx
   */
  async _initiateTx(id, tx) {
    try {
      await this._addRawTXtoQueue(this._constructRawTx(tx), id);
    } catch (error) {
      throw new error_1.SologenicError('1000', error);
    }
  }
  /**
   * Helper function to add any other properties to the TX before being added to the queue.
   * @param tx
   * @returns tx;
   */
  _constructRawTx(tx) {
    return { txJSON: tx };
  }
  /**
   * Add the raw transaction to the queue.
   * @param tx
   * @param id
   */
  async _addRawTXtoQueue(tx, id) {
    try {
      const item = await this.txmq.add('txmq:raw:' + this.account, tx, id);
      // emit on object specific listener
      if (typeof this.txEvents[item.id] !== 'undefined') {
        this.txEvents[item.id].emit('queued', item.data.txJSON);
      }
      // emit globally
      this.emit('queued', item.id, item.data.txJSON);
    } catch (error) {
      throw new error_1.SologenicError('1000', error);
    }
  }
  /**
   * Add id to the memo field of the transactions.
   * More info: https://xrpl.org/transaction-common-fields.html#memos-field
   *
   * @param tx
   */
  _addMemo(tx) {
    try {
      const constructedTx = Object.assign({}, tx.data.txJSON, {
        Memos: [
          {
            Memo: {
              MemoData: unescape(encodeURIComponent(tx.id))
                .split('')
                .map(v => {
                  return v.charCodeAt(0).toString(16);
                })
                .join('')
                .toUpperCase()
            }
          }
        ]
      });
      return constructedTx;
    } catch (error) {
      throw new error_1.SologenicError('1000', error);
    }
  }
  /**
   * Dispatch listener. Recursivley loop and fetch the persistent data store to fetch groups of transactions to be dispatched
   */
  async _dispatch() {
    try {
      // Get raw transactions from the queue
      const unsignedTXs = await this.txmq.getAll('txmq:raw:' + this.account);
      // Loop through each, FIFO order, and dispatch the transaction
      for (const unsignedTX of unsignedTXs) {
        await this._dispatchHandler(unsignedTX);
      }
      // Once the queue is dispatched, wait 100ms and re-fetch the queue.
      await wait(100);
      return await this._dispatch();
    } catch (error) {
      // Ignore errors and re-try the queue, wait 100ms and re-fetch the queue.
      await wait(100);
      return this._dispatch();
    }
  }
  /**
   * dispatch job handler. Recursively try transactions and based on the dispatch result try again, or a
   * @param unsignedTX
   */
  async _dispatchHandler(unsignedTX) {
    try {
      const result = await this._dispatchToLedger(unsignedTX);
      if (result) {
        await this.txmq.del('txmq:raw:' + this.account, unsignedTX.id);
        return;
      } else {
        return await this._dispatchHandler(unsignedTX);
      }
    } catch (error) {
      throw new error_1.SologenicError('1000', error);
    }
  }
  /**
   * Dispatch the transaction to the ledger
   * @param unsignedTX
   */
  async _dispatchToLedger(unsignedTX) {
    try {
      // Add id in the memo common field for tracking
      const tx = this._addMemo(unsignedTX);
      // Make sure the account is valid
      if (!this.getRippleApi().isValidAddress(tx.Account)) {
        throw new error_1.SologenicError(
          '2000',
          new RippleError.ValidationError()
        );
      }
      if (typeof tx.Flags === 'undefined') {
        // Transaction Specific Settings
        switch (tx.TransactionType) {
          case 'AccountSet':
            tx.Flags = this.getRippleApi().txFlags.Universal.FullyCanonicalSig;
            // JavaScript converts operands to 32-bit signed ints before doing bitwise
            // operations. We need to convert it back to an unsigned int.
            tx.Flags = tx.Flags >>> 0;
            break;
        }
      } else {
        tx.Flags = tx.Flags >>> 0;
      }
      // multiply the fee by 1.2 to make sure the tx goes through
      // Suggestion. In cases of surge in network fee, this value can be dynamically increased.
      tx.Fee = this.getRippleApi().xrpToDrops(
        this.math.multiply(this.ledger.baseFeeXRP, this.feeCushion).toFixed(6)
      );
      // Set the sequence of this tx to the latest sequence obtained from account_info
      tx.Sequence = this.sequence;
      // Set LastLedgerSequence for this tx to make sure it becomes invalid after 3 verified closed ledgers
      tx.LastLedgerSequence = this.ledger.ledgerVersion + 3;
      // Sign the transaction using the secret provided on init

      console.log(
        '_dispatchToLedger: ',
        1,
        JSON.stringify(tx),
        this.secret === '' ? undefined : this.secret,
        this.keypair.publicKey !== '' && this.keypair.privateKey
      );

      const signedTx = this.getRippleApi().sign(
        JSON.stringify(tx),
        this.secret === '' ? undefined : this.secret,
        undefined,
        this.keypair.publicKey !== '' && this.keypair.privateKey !== ''
          ? this.keypair
          : undefined
      );

      console.log('signedTx: ', signedTx);

      // store the `before` ledger this transaction is being submitted
      const firstLedgerSequence = this.ledger.ledgerVersion;
      // Submit the transaction to the ledger
      const result = await this.getRippleApi().submit(
        signedTx.signedTransaction
      );
      // increase the sequence for next transaction
      this.sequence++;
      /*
              If the result code is NOT tesSUCCESS, emit to object listner and globally warning the error.
              Note transaction is not ignore as it could be still validated due to many reasons
              Check:
              https://xrpl.org/tec-codes.html
              https://xrpl.org/tef-codes.html
              https://xrpl.org/tel-codes.html
              https://xrpl.org/tem-codes.html
              https://xrpl.org/ter-codes.html
              https://xrpl.org/tes-success.html
            */
      if (result.resultCode !== 'tesSUCCESS') {
        this.emit('warning', unsignedTX.id, 'dispatch', result.resultCode);
        if (typeof this.txEvents[unsignedTX.id] !== 'undefined') {
          this.txEvents[unsignedTX.id].emit(
            'warning',
            'dispatch',
            result.resultCode
          );
        }
      }
      // Specific actions based on different errors
      // 	The account sending the transaction does not have enough XRP to pay the Fee specified in the transaction.
      if (result.resultCode === 'terINSUF_FEE_B') {
        await wait(100);
      }
      // The network fee has increased due to load
      // The Fee from the transaction is not high enough to meet the server's current
      // transaction cost requirement, which is derived from its load level.
      if (result.resultCode === 'telINSUF_FEE_P') {
        await wait(100);
      }
      // The transaction did not meet the open ledger cost and also was not added to the transaction queue. This code occurs when a transaction with the same sender and sequence number already exists in the queue and the new one does not pay a large enough transaction cost to replace the existing transaction. To replace a transaction in the queue, the new transaction must have a Fee value that is at least 25% more, as measured in fee levels. You can increase the Fee and try again, send this with a higher Sequence number so it doesn't replace an existing transaction, or try sending to another server. New in: rippled 0.70.2
      if (result.resultCode === 'telCAN_NOT_QUEUE_FEE') {
        await wait(100);
      }
      // The transaction did not meet the open ledger cost and also was not added to the transaction queue because a transaction queued ahead of it from the same sender blocks it. (This includes all SetRegularKey and SignerListSet transactions, as well as AccountSet transactions that change the RequireAuth/OptionalAuth, DisableMaster, or AccountTxnID flags.) You can try again later, or try submitting to a different server.
      if (result.resultCode === 'telCAN_NOT_QUEUE_BLOCKED') {
        await wait(100);
      }
      // 	The address sending the transaction is not funded in the ledger (yet).
      if (result.resultCode === 'terNOaccount') {
        this.sequence--;
        return await this._txFailed(unsignedTX, 'terNOaccount');
      }
      // 	The transaction would involve adding currency issued by an account with lsfRequireAuth enabled to a trust line that is not authorized. For example, you placed an offer to buy a currency you aren't authorized to hold.
      if (result.resultCode === 'terNO_AUTH') {
        await wait(100);
      }
      // 	The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the lsfRequireAuth flag if it has any trust lines or available offers.
      if (result.resultCode === 'terOWNERS') {
        await wait(100);
      }
      // The sequence number of the transaction is lower than the current sequence number of the account sending the transaction.
      // Wait 1000ms and get the current sequence so the next transaction has the correct sequence
      if (result.resultCode === 'tefPAST_SEQ') {
        await this._fetchCurrentState();
        await wait(1000);
      }
      // 	The Sequence number of the current transaction is higher than the current sequence number of the account sending the transaction.
      // Wait 1000ms and get the current sequence so the next transaction has the correct sequence
      if (result.resultCode === 'terPRE_SEQ') {
        await this._fetchCurrentState();
        await wait(1000);
      }
      // 	Unspecified retriable error.
      if (result.resultCode === 'terRETRY') {
        await wait(100);
      }
      // 	The transaction met the load-scaled transaction cost but did not meet the open ledger requirement, so the transaction has been queued for a future ledger.
      if (result.resultCode === 'terQUEUED') {
        // Wait 4000ms and continue, possibly too many transactions were submitted to the same rippled server
        await wait(4000);
      }
      // These codes indicate that the transaction was malformed, and cannot succeed according to the XRP Ledger protocol.
      if (result.resultCode.startsWith('tem')) {
        await wait(100);
      }
      // These codes indicate an error in the local server processing the transaction; it is possible that another server with a different configuration or load level could process the transaction successfully. They have numerical values in the range -399 to -300. The exact code for any given error is subject to change, so don't rely on it.
      if (result.resultCode.startsWith('tel')) {
        await wait(100);
      }
      // These codes indicate that the transaction failed and was not included in a ledger, but the transaction could have succeeded in some theoretical ledger. Typically this means that the transaction can no longer succeed in any future ledger. They have numerical values in the range -199 to -100. The exact code for any given error is subject to change, so don't rely on it.
      if (result.resultCode.startsWith('tef')) {
        if (result.resultCode === 'tefBAD_AUTH_MASTER') {
          this.sequence--;
          return await this._txFailed(unsignedTX, result.resultCode);
        }
      }
      // These codes indicate that the transaction failed, but it was applied to a ledger to apply the transaction cost. They have numerical values in the range 100 to 199. Ripple recommends using the text code, not the numeric value.
      if (result.resultCode.startsWith('tec')) {
        return await this._txFailed(unsignedTX, result.resultCode);
      }
      // handle the dispatched transaction
      return await this._txDispatched(
        unsignedTX,
        tx,
        result,
        signedTx,
        firstLedgerSequence
      );
    } catch (error) {
      // // wait 1000ms and return false allowing transaction to be re-processed
      // // emit globally
      // this.emit('warning', unsignedTX.id, 'dispatch', error.message);
      // // emit on object specific listener channel warning and requeued. Letting the client know that this transaction is being re-processed
      // if (typeof this.txEvents![unsignedTX.id] !== 'undefined') {
      //   this.txEvents![unsignedTX.id].emit(
      //     'warning',
      //     'dispatch',
      //     error.message
      //   );
      // }
      // Catch malformed transactions, invalid addresses etc.
      // remove from the transaction queue allow the rest of the queue to be processed.
      // if (error.status === '2000') {
      //   return await this._txFailed(unsignedTX, error.message);
      // }
      if (typeof error.name !== 'undefined' && error.name === 'RippledError') {
        if (error.data.resultCode.startsWith('tem')) {
          return this._txFailed(unsignedTX, error.data.resultCode);
        }
      }
      return this._txFailed(unsignedTX, error.message);
      // return await this._txFailed(unsignedTX, error.name);
      // These codes indicate that the transaction was malformed, and cannot succeed according to the XRP Ledger protocol.
      // if (error) {
      //   this.sequence--;
      //   return await this._txFailed(unsignedTX, 'terNOaccount');
      // }
      await wait(1000);
      return false;
    }
  }
  /**
   * Handle dispatched transaction
   * @param unsignedTX
   * @param tx
   * @param result
   * @param signedTx
   * @param firstLedgerSequence
   */
  async _txDispatched(unsignedTX, tx, result, signedTx, firstLedgerSequence) {
    try {
      // construct the dispatched object
      const dispatchedTX = Object.assign(
        { unsignedTX },
        {
          result: Object.assign(
            { status: result.resultCode },
            {
              firstLedger: firstLedgerSequence,
              hash: signedTx.id,
              lastLedger: tx.LastLedgerSequence,
              sequence: tx.Sequence
            }
          )
        }
      );
      // add to dispatched queue
      const dispatched = await this.txmq.add(
        'txmq:dispatched:' + this.account,
        dispatchedTX,
        unsignedTX.id
      );
      // emit on object specific listener
      if (typeof this.txEvents[unsignedTX.id] !== 'undefined') {
        this.txEvents[unsignedTX.id].emit(
          'dispatched',
          unsignedTX,
          dispatchedTX
        );
      }
      // emit globally
      this.emit('dispatched', unsignedTX.id, dispatchedTX);
      return dispatched ? true : false;
    } catch (error) {
      return false;
    }
  }
  /**
   * Handle failed transaction
   * @param unsignedTX
   * @param tx
   * @param result
   * @param signedTx
   * @param firstLedgerSequence
   */
  async _txFailed(unsignedTX, reason) {
    try {
      // construct the dispatched object
      const failedTX = Object.assign(
        { unsignedTX },
        {
          result: Object.assign({ status: 'failed', reason })
        }
      );
      await this.txmq.del('txmq:dispatched:' + this.account, unsignedTX.id);
      await this.txmq.add(
        'txmq:failed:' + this.account,
        failedTX,
        unsignedTX.id
      );
      // emit globally
      this.emit('failed', unsignedTX.id, 'dispatch', reason);
      // emit on object specific listener channel
      if (typeof this.txEvents[unsignedTX.id] !== 'undefined') {
        this.txEvents[unsignedTX.id].emit('failed', 'dispatch', reason);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  /**
   * Validate missed transactions sitting on the dispatched queue
   */
  async _validateMissedTransactions() {
    try {
      const dispatchedTXs = await this.txmq.getAll(
        'txmq:dispatched:' + this.account
      );
      for (const dispatchedTX of dispatchedTXs) {
        await this._ValidateTxOnLedger(dispatchedTX.id, dispatchedTX.data);
      }
      return;
    } catch (error) {
      throw new error_1.SologenicError('1006');
    }
  }
  /**
   * eventListener to validate transactions that are added to the dispatched queue
   */
  _validateOnLedger() {
    this.on('dispatched', async (id, dispatchedTX) => {
      await this._ValidateTxOnLedger(id, dispatchedTX);
    });
  }
  /**
   * Validate transaction on the XRP Ledger
   * @param id
   * @param dispatchedTX
   */
  async _ValidateTxOnLedger(id, dispatchedTX) {
    try {
      // Check and see if the dispatched transaction's ledger is passed or we are in the current ledger
      if (dispatchedTX.result.lastLedger <= this.ledger.ledgerVersion) {
        // Get the transaction details from the ledger
        const validate = await this.getRippleApi().getTransaction(
          dispatchedTX.result.hash,
          {
            includeRawTransaction: false,
            maxLedgerVersion: dispatchedTX.result.lastLedger,
            minLedgerVersion: dispatchedTX.result.firstLedger
          }
        );
        // remove the transaction from the dispatched queue
        const exists = await this.txmq.del(
          'txmq:dispatched:' + this.account,
          id
        );
        // Make sure this transaction existed in the queue
        if (exists) {
          // only if the result from the closed ledger is tesSUCCESS, consider this transaction to be final
          if (validate.outcome.result === 'tesSUCCESS') {
            /*
                          add them to `validated` queue for archiving. This queue is not processed and is just for the records.
                          Suggestion: add a TTL to these transactions in this queue to avoid overloading Redis or memory and possibly move these
                          transactions to a database
                        */
            await this.txmq.add(
              'txmq:validated:' + this.account,
              {
                accountSequence: validate.sequence,
                dispatchedSequence: dispatchedTX.result.sequence,
                fee: validate.outcome.fee,
                hash: dispatchedTX.result.hash,
                ledgerVersion: validate.outcome.ledgerVersion,
                timestamp: validate.outcome.timestamp
              },
              id
            );
            // emit on object specific listener
            if (typeof this.txEvents[id] !== 'undefined') {
              this.txEvents[id].emit(
                'validated',
                dispatchedTX,
                dispatchedTX.result
              );
            }
            // emit on object specific listener
            this.emit('validated', id, dispatchedTX.result);
            // At this stage, it is safe to delete the object specific listner's EventEmitter object since validation is
            // the last event that is emitted.
            delete this.txEvents[id];
          } else {
            // Transaction was in the ledger but failed for any reason.
            // This transaction is now moved to txmq:raw: for re-processing.
            // emit globally
            this.emit('warning', id, 'validation', 'not_validated');
            this.emit('requeued', id);
            // emit on object specific listener channel warning and requeued. Letting the client know that this transaction is being re-processed
            if (typeof this.txEvents[id] !== 'undefined') {
              this.txEvents[id].emit('warning', 'validation', 'not_validated');
              this.txEvents[id].emit(
                'requeued',
                dispatchedTX,
                dispatchedTX.result
              );
            }
            // add the transaction to the raw queue
            this._addRawTXtoQueue(dispatchedTX.unsignedTX.data.txJSON, id);
          }
        }
      } else {
        /*
                  If the current ledger is greater than the lastLedgerSequence of the transaction
                  Or in other words, this transaction is not in a final ledger
                  Recursivley wait 1000ms and try again
                */
        await wait(1000);
        return await this._ValidateTxOnLedger(id, dispatchedTX);
      }
      return;
    } catch (error) {
      // Transaction not found on the ledger, It means this transaction was ignore for whatever reason. Re-queue and re-process
      if (error instanceof RippleError.NotFoundError) {
        // emit globally
        this.emit('warning', id, 'validation', 'not_validated');
        this.emit('requeued', id);
        // emit on object specific listener channel warning and requeued. Letting the client know that this transaction is being re-processed
        if (typeof this.txEvents[id] !== 'undefined') {
          this.txEvents[id].emit('warning', 'validation', 'not_validated');
          this.txEvents[id].emit(
            'requeued',
            id,
            dispatchedTX,
            dispatchedTX.result
          );
        }
        // remove transaction from the dispatched queue
        await this.txmq.del('txmq:dispatched:' + this.account, id);
        // add the transaction to the raw queue
        this._addRawTXtoQueue(dispatchedTX.unsignedTX.data.txJSON, id);
      } else {
        // if unspecified error, wait 1000ms re-try validation
        await wait(1000);
        return this._ValidateTxOnLedger(id, dispatchedTX);
      }
    }
  }
}
exports.SologenicTxHandler = SologenicTxHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sb2dlbmljdHhoYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zb2xvZ2VuaWN0eGhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkNBQXVDO0FBRXZDLCtFQUFpRTtBQUNqRSxtQ0FBeUM7QUFDekMsbUNBQThEO0FBQzlELG1DQUFnQztBQUNoQyxtQ0FBc0M7QUFDdEMsK0JBQWtDO0FBRWxDLE1BQU0sSUFBSSxHQUFHLENBQUMsWUFBb0IsRUFBRSxFQUFFO0lBQ3BDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDO0FBRUYsTUFBYSxrQkFBbUIsU0FBUSxxQkFBWTtJQWFsRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQTJDRztJQUVILFlBQ0UsZ0JBQWlELEVBQ2pELGdCQUEwRDtRQUUxRCxLQUFLLEVBQUUsQ0FBQztRQTVEQSxlQUFVLEdBQVksS0FBSyxDQUFDO1FBRTVCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixZQUFPLEdBQTJCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDcEUsYUFBUSxHQUFvQyxFQUFFLENBQUM7UUFFL0MsZUFBVSxHQUFXLEdBQUcsQ0FBQztRQUN6QixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBcUQ3QixJQUFJO1lBQ0Y7Ozs7Ozs7Ozs7Ozs7Y0FhRTtZQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxzQkFBUyxpQkFDNUIsVUFBVSxFQUFFLENBQUMsRUFDYixPQUFPLEVBQUUsT0FBTyxJQUNiLGdCQUFnQixFQUNuQixDQUFDO1lBRUgsd0NBQXdDO1lBQ3hDLElBQUksQ0FBQyxZ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
