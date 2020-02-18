const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const blockIconURI = 'data:image/png;base64,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';

const isNumber = n => {
    n = n.replace(/'/g, '')
    return !isNaN(parseFloat(n)) && isFinite(n);
};

class Scratch3TelloBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Tello';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'tello';
    }
    constructor (runtime){
        this.runtime = runtime;
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension('Tello', this);
        // session callbacks
        this.onmessage = this.onmessage.bind(this);
        this.onclose = this.onclose.bind(this);

        this.decoder = new TextDecoder();
        this.lineBuffer = '';
        this.hostIP = '192.168.10.1';
        this.hostPort = 8889;
        this.rxport = 12345;
    }

    write (data){
        // if (!data.endsWith('\n')) data += '\n';
        if (this.session) this.session.write(data);
    }

    report (data){
        return new Promise(resolve => {
            this.write(data);
            this.reporter = resolve;
        });
    }


    onmessage (data){
        const dataStr = this.decoder.decode(data);
        this.lineBuffer += dataStr;
        if (this.lineBuffer.indexOf('\n') !== -1){
            const lines = this.lineBuffer.split('\n');
            this.lineBuffer = lines.pop();
            for (const l of lines){
                console.log("Tello >>", l);
                if (this.reporter) this.reporter(l);
            }
        }
    }

    onclose (error){
        log.warn('on close', error);
        this.session = null;
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_ERROR);
    }

    // method required by vm runtime
    scan (){
        this.comm.ping(this.hostIP).then(result => {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
        });
    }

    connect (id){
        this.comm.connectUDP(id, this.hostIP, this.hostPort, this.rxport).then(sess => {
            this.session = sess;
            this.session.onmessage = this.onmessage;
            this.session.onclose = this.onclose;
            // notify gui connected
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
        }).catch(err => {
            log.warn('connect peripheral fail', err);
        });
    }

    disconnect (){
        this.session.close();
    }

    isConnected (){
        return Boolean(this.session);
    }

    getInfo (){

        return {
            id: Scratch3TelloBlocks.EXTENSION_ID,
            name: Scratch3TelloBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            color1: '#5b8c00',
            color2: '#3f6600',
            color3: '#254000',

            blocks: [
                {
                    opcode: 'command',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.command',
                        default: 'Command Flight'
                    }),
                    func: 'command'
                },
                {
                    opcode: 'takeOff',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.takeOff',
                        default: 'Take Off'
                    }),
                    func: 'takeOff'
                },
                {
                    opcode: 'land',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.land',
                        default: 'Land'
                    }),
                    func: 'land'
                },
                {
                    opcode: 'flyUp',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.flyUp',
                        default: 'Up [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    func: 'flyUp'
                },
                {
                    opcode: 'flyDown',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.flyDown',
                        default: 'Down [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    func: 'flyDown'
                },
                {
                    opcode: 'flyFw',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.flyFw',
                        default: 'Forward [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    func: 'flyFw'
                },
                {
                    opcode: 'flyBack',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.flyBack',
                        default: 'Back [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    func: 'flyBack'
                },
                {
                    opcode: 'flyLeft',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.flyLeft',
                        default: 'Left [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    func: 'flyLeft'
                },
                {
                    opcode: 'flyRight',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.flyRight',
                        default: 'Right [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    func: 'flyRight'
                },
                {
                    opcode: 'rollCw',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.rollCw',
                        default: 'Roll CW [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    },
                    func: 'rollCw'
                },
                {
                    opcode: 'rollCcw',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.rollCcw',
                        default: 'Roll CCW [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    },
                    func: 'rollCcw'
                },
                {
                    opcode: 'setSpeed',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.setSpeed',
                        default: 'Speed [LEN]'
                    }),
                    arguments: {
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    func: 'setSpeed'
                },
                {//flip
                    opcode: 'flip',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'Tello.flip',
                        default: 'Flip [TAKEPUT]'
                    }),
                    arguments: {
                        TAKEPUT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Forward',
                            menu: 'takeput'
                        }
                    },
                    func: 'flip'
                },
                {
                    opcode: 'getBattery',
                    blockType: BlockType.REPORTER,

                    text: formatMessage({
                        id: 'Tello.getBattery',
                        default: 'Battery'
                    }),
                    func: 'getBattery'
                }
            ],
            menus: {
                takeput: ['Forward', 'Back', 'Left','Right']
            }
        };
    }

    noop (){

    }
    flip (args){
        let param = 'f';
        if (args.TAKEPUT === 'forward') {
            param = 'f';
        }
        else if (args.TAKEPUT === 'back') {
            param = 'b';
        }
        else if (args.TAKEPUT === 'left') {
            param = 'l';
        }
        else {
            param = 'r';
        }
        const cmd = `flip ${param}`;
        this.write(cmd);
    }

    command (args){
        const cmd = 'command';
        this.write(cmd);
    }

    takeOff (args){
        const cmd = 'takeoff';
        this.write(cmd);
    }

    land (args){
        const cmd = 'land';
        this.write(cmd);
    }

    flyUp (args){
        const cmd = `up ${args.LEN}`;
        this.write(cmd);
    }

    flyDown (args){
        const cmd = `down ${args.LEN}`;
        this.write(cmd);
    }

    flyFw (args){
        const cmd = `forward ${args.LEN}`;
        this.write(cmd);
    }

    flyBack (args){
        const cmd = `back ${args.LEN}`;
        this.write(cmd);
    }

    flyLeft (args){
        const cmd = `left ${args.LEN}`;
        this.write(cmd);
    }

    flyRight (args){
        const cmd = `right ${args.LEN}`;
        this.write(cmd);
    }

    rollCw (args){
        const cmd = `cw ${args.LEN}`;
        this.write(cmd);
    }

    rollCcw (args){
        const cmd = `ccw ${args.LEN}`;
        this.write(cmd);
    }

    setSpeed (args){
        const cmd = `speed ${args.LEN}`;
        this.write(cmd);
    }

    getBattery (args){
        const cmd = 'battery?';
        return this.report(cmd).then(ret => this.parseCmd(ret));
    }


    parseCmd (msg){
        msg = msg.toString();
        if (isNumber(msg)){
            return parseInt(msg, 10);
        } else {
            return msg;
        }
    }
}

module.exports = Scratch3TelloBlocks;
