

import ModbusClient from './modbus-client.js'
import ModbusTCPClientRequestHandler from './tcp-client-request-handler.js'
import ModbusTCPClientResponseHandler from './tcp-client-response-handler.js'
import { Socket } from 'net';

/** This client must be initiated with a net.Socket object. The module does not handle reconnections
 * or anything related to keep the connection up in case of an unplugged cable or a closed server. See
 * the node-net-reconnect module for these issues.
 * @extends ModbusClient
 * @class
 * @example <caption>Create new Modbus/TCP Client</caption>
 * const net = require('net')
 * const socket = new net.Socket()
 * const client = new Modbus.tcp.Client(socket)
 *
 * socket.connect({'host' : hostname, 'port' : 502 })
 *
 * socket.on('connect', function () {
 *
 *  client.readCoils(...)
 *
 * })
 *
 */
export default class ModbusTCPClient extends ModbusClient<Socket> {
  protected readonly _unitId: number;
  protected readonly _timeout: number;
  protected readonly _requestHandler: ModbusTCPClientRequestHandler;
  protected readonly _responseHandler: ModbusTCPClientResponseHandler;

  /**
   * Creates a new Modbus/TCP Client.
   * @param {Socket} socket The TCP Socket.
   * @param {number} [unitId=1] Unit ID
   * @param {number} [timeout=5000] Timeout for requests in ms.
   * @memberof ModbusTCPClient
   */
  constructor(socket: Socket, unitId: number = 1, timeout: number = 5000) {
    super(socket)
    this._unitId = unitId
    this._timeout = timeout

    /* Simply set the request and response handler and you are done.
     * The request handler needs to implement the following methods
     *   - register(pdu) returns a promise
     * The response handler needs to implement the following methods
     *   - handelData(buffer)
     *   - shift () // get latest message from the socket
     *      and remove it internally
     */
    this._requestHandler = new ModbusTCPClientRequestHandler(this._socket, this._unitId, timeout)
    this._responseHandler = new ModbusTCPClientResponseHandler()
  }

  get slaveId() {
    return this._unitId;
  }

  get unitId() {
    return this._unitId;
  }
}
