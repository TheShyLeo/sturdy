const fetch = require('node-fetch');
async function get_real_url(rid) {
    try {
        let room_url = 'https://m.huya.com/' + rid;
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':
                'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Mobile Safari/537.36 '
        };
        let response = await fetch(room_url, { method: 'get', headers });
        let data = await response.text();
        let streamInfo = JSON.parse(new RegExp('<script> window.HNF_GLOBAL_INIT = (.*)</script>').exec(data)[1])['roomInfo']['tLiveInfo']['tLiveStreamInfo'][
            'vStreamInfo'
        ]['value'];
        if (!streamInfo || streamInfo.length === 0) {
            throw new Error('未开播或直播间不存在');
        }
        let real_url = {};
        for (const info of streamInfo) {
            real_url[info['sCdnType'].toLowerCase() + '_flv'] =
                info['sFlvUrl'] + '/' + info['sStreamName'] + '.' + info['sFlvUrlSuffix'] + '?' + info['sFlvAntiCode'];
            real_url[info['sCdnType'].toLowerCase() + '_hls'] =
                info['sHlsUrl'] + '/' + info['sStreamName'] + '.' + info['sHlsUrlSuffix'] + '?' + info['sHlsAntiCode'];
        }
        return real_url;
    } catch (error) {
        throw new Error('未开播或直播间不存在');
    }
}

module.exports = get_real_url;
