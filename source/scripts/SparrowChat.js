//小端模式
//number 要转换的整形数值
//length 要转成什么byte数组，规定数组的长度
//如uint16，则lenght=2表示两个字节，转成的byte数组长度是length=2
//如uint32，则lenght=2表示两个字节，转成的byte数组长度是length=4
Number.prototype.toBytes = function () {
    number = this;
    var bytes = [];
    length = 4;
    var i = length;
    do {
        bytes[--i] = number & (255);
        number = number >> 8;
    } while (i)
    return bytes;
}

Array.prototype.toUint8Array = function () {
    bytes = this;
    var array = new Uint8Array(bytes.length + 1);
    for (i = 0; i < array.length; i++) {
        array[i] = bytes[i];
    }
    return array;
}

String.prototype.toArray = function () {
    var bytes = [];
    var len, c;
    len = this.length;
    for (var i = 0; i < len; i++) {
        c = this.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
};

Uint8Array.prototype.toString = function () {
    /**
     * https://www.javascripture.com/DataView
     * DataViews allow heterogeneous access to data stored in an ArrayBuffer. Values can be read and stored at any byte offset without alignment constraints.
     * @type {DataView}
     */
    var dataView = new DataView(this.buffer);
    var ints = new Uint8Array(this.buffer.byteLength);
    for (var i = 0; i < ints.length; i++) {
        ints[i] = dataView.getUint8(i);
    }
    var str = '', _arr = ints;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
};

var TEXT_MESSAGE = 0;
var IMAGE_MESSAGE = 1;
var CHAT_TYPE_1_2_1 = 0;
var CHAT_TYPE_1_2_N = 1;
var SparrowProtocol = function (chatType, msgType, currentUserId, sessionKey, msg) {
    if (window === this) {
        return new SparrowProtocol(chatType, msgType, currentUserId, sessionKey, msg);
    }

    if(typeof(chatType)=="object"){
        data=chatType;
        callback=msgType;
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
            (async () => {
                const blob =data;
                const buf = await blob.arrayBuffer();
                if(buf.byteLength===1){
                        console.log("对方不在线!!!!");
                        return;
                }
                var dataView = new DataView(buf);
                var offset=0;
                this.chatType= dataView.getUint8(offset);
                offset+=1;//chat type length=1
                this.msgType=dataView.getUint8(offset);
                offset+=1;//msg type length=1
                this.fromUserId=dataView.getInt32(offset);
                offset+=4;//from user id length=4
                if (this.chatType === CHAT_TYPE_1_2_1) {
                    this.currentUserId=dataView.getInt32(offset);
                    offset+=4;
                }
                if (this.chatType === CHAT_TYPE_1_2_N) {
                    this.sesessionKeyLength=dataView.getInt32(offset);
                    offset+=4;//session key length=4
                    const sessionKeyBuffer = buf.slice(offset,this.sesessionKeyLength+offset);
                    offset+=this.sesessionKeyLength;
                    this.sessionKey=new Uint8Array(sessionKeyBuffer);
                }

                offset+=4;//msg length =4

                if(this.msgType===TEXT_MESSAGE) {
                    const msgBuffer = buf.slice(offset, buf.byteLength);
                    const chars = new Uint8Array(msgBuffer);
                    this.msg = chars.toString();
                    //console.log(this.msg);
                }
                else {
                    //const img = document.getElementById('img');
                    const msgBuffer = buf.slice(offset, buf.byteLength);
                    fileBlob = new Blob([msgBuffer]);
                    //本地直接读即可
                    //const url = window.URL.createObjectURL(file);
                    const url = window.URL.createObjectURL(fileBlob);
                    this.url=url;
                }
                callback(this);
            })();
    }
    if (typeof (chatType) == "number") {
        this.chatType = chatType;
        this.chatTypeLength = 1;
        this.msgType = msgType;
        this.msgTypeLegnth = 1;
        this.currentUserId = parseInt(currentUserId, 10);
        this.currentUserIdBytes = this.currentUserId.toBytes();
        this.currentUserIdLength = this.currentUserIdBytes.length;
        if (chatType === CHAT_TYPE_1_2_N) {
            this.sessionKey = sessionKey;
            this.sessionKeyBytes = sessionKey.toArray();
            //session key length
            this.sesessionKeyBytesLength = this.sessionKeyBytes.length;
            //session key length's bytes
            this.sesessionKeyLengthBytes = this.sesessionKeyLengthLength.toBytes();
            //session key length's bytes length
            this.sesessionKeyLengthLength = sesessionKeyLengthBytes.length;
        } else {
            this.targetUserId = parseInt(sessionKey, 10);
            this.targetUserIdBytes = this.targetUserId.toBytes();
            this.targetUserIdLength = this.targetUserIdBytes.length;
        }
        this.msg = msg;
        let msgLength = (msg.length ? msg.length : msg.byteLength);
        this.msgLength = msgLength;
        this.msgLengthBytes=msgLength.toBytes();
        this.msgLengthLength=this.msgLengthBytes.length;
        return this;
    }
};

SparrowProtocol.prototype.toBytes = function () {
    totalLength = 0;
    if (this.chatType === CHAT_TYPE_1_2_N) {
        totalLength = this.chatTypeLength +
            this.msgTypeLegnth +
            this.currentUserIdLength +//4
            this.sesessionKeyLengthLength +//4
            this.sesessionKeyBytesLength +
            this.msgLengthLength+//4
            this.msgLength;
    } else {
        totalLength = this.chatTypeLength +
            this.msgTypeLegnth +
            this.currentUserIdLength +//4
            this.targetUserIdLength +//4
            this.msgLengthLength+//4
            this.msgLength;
    }
    let result = new Uint8Array(totalLength);
    offset = 0
    result.set([this.chatType,this.msgType], offset);
    offset += this.msgTypeLegnth + this.chatTypeLength;
    result.set(this.currentUserIdBytes, offset);
    offset += this.currentUserIdLength;
    if (this.chatType === CHAT_TYPE_1_2_N) {
        result.set(this.sesessionKeyLengthBytes, offset);
        offset += this.sesessionKeyLengthLength;
        result.set(this.sessionKeyBytes, offset);
        offset += this.sesessionKeyBytesLength;
    } else {
        result.set(this.targetUserIdBytes, offset);
        offset += this.targetUserIdLength;
    }
    result.set(this.msgLengthBytes, offset);
    offset+=this.msgLengthLength;
    result.set(this.msg, offset);
    return result;
}