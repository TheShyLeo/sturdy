/* 
获取哔哩哔哩直播的真实流媒体地址，默认获取直播间提供的最高画质
qn=150高清
qn=250超清
qn=400蓝光
qn=10000原画 
*/
const fetch = require('node-fetch');
async function get_real_url(rid) {
    let room_url = `https://api.live.bilibili.com/room/v1/Room/room_init?id=${rid}`
    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
            'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Mobile Safari/537.36 '
    };
    let room = await fetch(room_url, { method: 'get', headers });
    let room_info = await room.json();
    if (room_info.code === 0) {
        let liveStatus = room_info["data"]["live_status"];
        if (liveStatus == 1) {
            let room_id = room_info["data"]["room_id"];
            let flv_url = await u('web', room_id)
            let hls_url = await u('h5', room_id)
            return { flv_url, hls_url }
        } else {
            throw new Error("未开播!")
        }
    } else {
        throw new Error("房间不存在!")
    }
}
async function u(platform, room_id) {
    let url = 'https://api.live.bilibili.com/xlive/web-room/v1/playUrl/playUrl';
    const params = new URLSearchParams({
        cid: room_id,
        qn: 10000,
        platform: platform,
        https_url_req: 1,
        ptype: 16
    });
    url = url + '?' + params;
    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    let res = await fetch(url, {
        method: 'get', headers
    })
    try {
        let json = await res.json();
        let durl = json["data"]["durl"];
        let real_url = durl[0].url;
        return real_url;
    } catch (error) {
        throw new Error("获取失败!")
    }

}
module.exports = get_real_url;