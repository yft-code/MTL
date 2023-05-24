var popo = {}
//注册
popo.install = function (Vue, options) {
    Vue.prototype.$popo = popo
    Vue.popo = popo
}
popo.sendPopo = function (type, theme, id, personList, url) {
    // 是否发送单子详情.
    let sendDetail = true
    if (type == 'person' && personList.length == 1) {
        let obj = {
            opss: {
                sstp: 0,
                ssid: personList[0]
            },
            from: 'MTL测试平台',
            content: theme,
            cshare: 1,
            title: `#${id}`,
            image: 'http://mtl.leihuo.netease.com:8000/site_media/favicon.ico',
            tabid: '',
            fromPid: '',
            url: `${url}${id}`
        };
        obj.workTabShare = {
            shmobileurl: '',
            shpcurl: '',
            shtag: '易协作'
        }
        this.sendMessage(obj)
    } else if (type == 'person' && personList.length > 1) {
        let obj = {
            opss: {
                sstp: 10,
                multis: [{
                    stitle: `#${id}`,
                    uids: personList
                }],
                from: 'MTL测试平台',
                content: theme,
            }
        }
        // console.log('objj',obj)
        this.sendMessage(obj)
    }
}

popo.singalPopo = function (popo) {
    window.location.href = this.sendPopoMessage(popo)
}

// 单人popo会话
popo.sendPopoMessage = function (popoNum) {
    // 从OA平台上抄过来的
    let ssid = popoNum;
    let sstp = 0;
    if (!ssid) {
        return;
    }
    let b = { opss: { sstp: parseInt(sstp), ssid: ssid } };
    let a = JSON.stringify(b);
    return "netease-popoapp://" + this.encrypt(a);
}

popo.sendMessage = function (data) {
    var str = JSON.stringify(data);
    // location.href = "netease-popoapp://" + encrypt(str);
    var action = "netease-popoapp://" + this.encrypt(str);
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.action = action;
    form.method = 'post';
    form.submit();
    document.body.removeChild(form);
}

popo.encrypt = function (str) {
    var arr = [];
    var e = 0;
    for (let i = 0; i < str.length; i++) {
        var f = encodeURI(str[i]);
        if (f.length === 1) {
            const d = f.charCodeAt(0);
            arr[2 * e] = ((d & 240) >> 4).toString(16);
            arr[2 * e + 1] = (d & 15).toString(16);
            e++;
        } else {
            var c = f.split("%");
            for (var b = 1; b < c.length; b++) {
                const d = parseInt("0x" + c[b]);
                arr[2 * e] = ((d & 240) >> 4).toString(16);
                arr[2 * e + 1] = (d & 15).toString(16);
                e++;
            }
        }
    }
    return arr.join("");
}

export default popo