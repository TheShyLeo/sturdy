'use strict';

const base = shared.get('base').data;
const qqMusic = require('qq-music-api');
const miguMusic = require('migu-music-api').default;

const formatQQ = async (data) => {
    let result = {};
    result.id = data.songmid;
    result.name = data.songname;
    result.singer = data.singer.map(item => item.name).join('/');
    result.albumname = data.albumname;
    result.isVip = data.pay.payplay > 0;
    result.source = 'qq';
    result.detail = JSON.stringify(data);
    try {
        result.url = await qqMusic.api('song/url', { id: data.songmid, mediaId: data.strMediaMid });
    } catch (err) {
        result.url = null;
    }
    return result;
}

const formatMigu = async (data) => {
    let result = {};
    result.id = data.cid;
    result.name = data.name;
    result.singer = data.artists.map(item => item.name).join('/');
    result.albumname = data.album.name;
    result.isVip = data.url === null;
    result.detail = JSON.stringify(data);
    result.source = 'migu';
    if (data.url === null) {
        try {
            result.url = await miguMusic('song/url', { cid: data.cid });
        } catch (err) {
            result.url = null;
        }
    } else {
        result.url = data.url;
    }
    return result;
}

class data extends base {
    constructor(ctx) {
        super(ctx);
    }
    dao = this.new_dao('music');

    async searchList(condition) {
        // qqMusic.setCookie('pgv_pvid=2369564888; eas_sid=a1E6o4w0V704x7e4Y28119k8S9; RK=oyjc5pgbGW; ptcz=5e67d0af0053b2c1f7a436c1c73a215fbe7d9182be496da91e3ce5b8a1e9c892; luin=o0874791162; lskey=0001000073bd96e79cf895871fa25dd131afd986bccd57c013853e5fa8ee31248d15f079cca871b27b27b362; fqm_pvqid=4ff67e78-4593-41aa-97e6-3afe9905defc; ts_uid=2154004940; fqm_sessionid=4e0c9788-a7f5-4cd4-a03e-6206bbfca893; pgv_info=ssid=s1982674416; ts_refer=www.google.com/; _qpsvr_localtk=0.8593864608745165; login_type=1; psrf_qqopenid=9E46A5A08E674EAF224B82A95B692F80; psrf_qqaccess_token=CB4103F329B77B49149E412A283BDC0E; psrf_qqrefresh_token=883ED0B9300F8014E31674596836B9FB; wxunionid=; qqmusic_key=Q_H_L_5RLYgoqGYWk50_8wVtOGGnZ-TcU78cXQstdjKUJNJvqBtUxj-8BeaiQ; tmeLoginType=2; qm_keyst=Q_H_L_5RLYgoqGYWk50_8wVtOGGnZ-TcU78cXQstdjKUJNJvqBtUxj-8BeaiQ; euin=NeSP7iE5oKCA; wxrefresh_token=; qm_keyst=Q_H_L_5RLYgoqGYWk50_8wVtOGGnZ-TcU78cXQstdjKUJNJvqBtUxj-8BeaiQ; psrf_access_token_expiresAt=1661409231; wxopenid=; psrf_qqunionid=080D5C1DF2DBC510A158469EB409F46A; uin=874791162; psrf_musickey_createtime=1653633231; ts_last=y.qq.com/')
        //异步并发获取
        let res = await Promise.all([
            this.searchQQ(condition),
            this.searchMigu(condition)
        ])
        return res;
    };
    async setCookie(condition) {
        return qqMusic.setCookie(condition.cookie);
    };
    async searchQQ(condition) {
        let res = await qqMusic.api('search', { key: condition.input });
        if (res && res.list) {
            //并发获取url
            let task = [];
            for (const v of res.list) {
                task.push(formatQQ(v));
            }
            let result = await Promise.all(task);
            this.dao.add(result);
            return result;
        }
        return [];
    }
    async searchMigu(condition) {
        let res = await miguMusic('search', { keyword: condition.input });
        if (res && res.list) {
            //并发获取url
            let task = [];
            for (const v of res.list) {
                task.push(formatMigu(v));
            }
            let result = await Promise.all(task);
            this.dao.add(result);
            return result;
        }
        return [];
    }
}

module.exports = data;