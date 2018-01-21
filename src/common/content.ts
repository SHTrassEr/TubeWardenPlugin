
let videoList = null;
let videoCache = null;
let loaded = false;
let dataUpdatedAt = null;
let wrapperInnerBlock;
let wrapperDiv;
let loadingUrl;

function setTimeoutUpdate() {
    if (atTrendsNow()) {
        if (!loaded) {
            loaded = true;
            Update();
        }
    } else {
        loaded = false;
    }

    setTimeout(setTimeoutUpdate, 1000);
}

function isDataReloadRequired() {
    if (!dataUpdatedAt || !videoList || !videoCache) {
        return true;
    }

    const now = new Date();

    return now.getTime() - dataUpdatedAt.getTime() > 2 * 60 * 1000;
}

function Update() {

    if (isDataReloadRequired()) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.responseType = "json";

        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {

                dataUpdatedAt = new Date();
                videoList = this.response;
                videoCache = {};
                for (const r of videoList)  {
                    videoCache[r.videoId] = r;
                }

                initInfoPanelList(videoCache);
            }
        };

        xmlhttp.open("GET", "https://tubewarden.ru/api/trendsVideoList", true);
        xmlhttp.send();
    } else {
        initInfoPanelList(videoCache);
    }

    if (!wrapperDiv) {
        initModalWindow();
    }
}

setTimeoutUpdate();
