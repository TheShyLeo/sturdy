const fetch = require('node-fetch');
const crypto = require('crypto');
const ROOM = "$ROOM.room_id =";
const did = '10000000000000000000000000001501';
//Douyu清晰度 1流畅；2高清；3超清；4蓝光4M；0蓝光8M或10M

async function get_params(rid) {
    let html = await get_html(rid);
    let room_index = html.indexOf(ROOM);
    let real_rid = html.substr(room_index + ROOM.length);
    real_rid = real_rid.split(';')[0];
    if (rid !== real_rid) {
        html = await get_html(real_rid);
        rid = real_rid;
    }
    let str_arr = new RegExp('(vdwdae325w_64we[\\s\\S]*function ub98484234[\\s\\S]*?)function').exec(html)
    let js_str = str_arr[1];
    let v = eval(js_str);
    //正则匹配ub9 ub9是sign值的加密函数
    let ub9_arr = js_str.match(/(function ub9.*)[\s\S](var.*)/i);
    //ub98484234的函数内容
    let ub9 = String(ub9_arr[1]);
    //加括号eval才能返回一个函数
    ub9 = '(' + ub9 + ')';
    //修改字符串里的eval使返回真实的函数
    ub9 = ub9.replaceAll(/eval.*?;/g, "strc;");
    //执行eval得到真实的ub9加密函数
    let call_func = eval(ub9);
    let ub9_new = call_func();
    const tt = Math.floor((new Date).getTime() / 1000);
    //用我们md5加密的值 替换掉加密函数字符串里的MD5操作
    let md5rb = crypto.createHash('md5').update(rid + did + tt + v).digest('hex');
    ub9_new = ub9_new.replace("CryptoJS.MD5(cb).toString()", "\"" + md5rb + "\"");
    //执行加密函数得到sign值
    let ub9_func = eval(ub9_new);
    let params = ub9_func(rid, did, tt);
    //rate是清晰度
    params = params + "&cdn=ws-h5&rate=0";
    console.log('params: ', params);
    return params;
}

async function get_html(rid) {
    let room_url = `https://www.douyu.com/${rid}`;
    let room = await fetch(room_url, { method: 'get' });
    let html = await room.text();
    return html;
}

async function get_real_url(rid) {
    let params = await get_params(rid);
    let url = "https://www.douyu.com/lapi/live/getH5Play/" + rid;
    let res = await fetch(url, { method: 'post', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    let json = await res.json();
    let key = json.data.rtmp_live.split("?")[0];
    let cdn = [
        "http://akm-tct.douyucdn.cn/live/",
        "http://ws-tct.douyucdn.cn/live/",
        "http://hdltctwk.douyucdn2.cn/live/",
    ];
    let real_url = {};
    for (const i in cdn) {
        real_url["flv_url_" + i] = cdn[i] + key;
    }
    return { real_url };
}
module.exports = get_real_url;