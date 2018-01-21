var videoList = null;
var videoCache = null;
var loaded = false;
var dataUpdatedAt = null;
var wrapperInnerBlock;
var wrapperDiv;
var loadingUrl;
function setTimeoutUpdate() {
    if (atTrendsNow()) {
        if (!loaded) {
            loaded = true;
            Update();
        }
    }
    else {
        loaded = false;
    }
    setTimeout(setTimeoutUpdate, 1000);
}
function isDataReloadRequired() {
    if (!dataUpdatedAt || !videoList || !videoCache) {
        return true;
    }
    var now = new Date();
    return now.getTime() - dataUpdatedAt.getTime() > 2 * 60 * 1000;
}
function Update() {
    if (isDataReloadRequired()) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.responseType = "json";
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                dataUpdatedAt = new Date();
                videoList = this.response;
                videoCache = {};
                for (var _i = 0, videoList_1 = videoList; _i < videoList_1.length; _i++) {
                    var r = videoList_1[_i];
                    videoCache[r.videoId] = r;
                }
                initInfoPanelList(videoCache);
            }
        };
        xmlhttp.open("GET", "https://tubewarden.ru/api/trendsVideoList", true);
        xmlhttp.send();
    }
    else {
        initInfoPanelList(videoCache);
    }
    if (!wrapperDiv) {
        initModalWindow();
    }
}
setTimeoutUpdate();
var chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0,
    },
    tooltips: {
        callbacks: {
            title: function (tooltipItem, data) {
                return moment(tooltipItem[0].xLabel).format("DD-MM-YYYY HH:mm");
            },
        },
    },
    elements: {
        point: {
            radius: 2,
            hitRadius: 3,
            hoverRadius: 3,
        },
    },
    scales: {
        xAxes: [{
                type: "time",
                time: {
                    displayFormats: {
                        millisecond: "HH:mm:ss",
                        second: "HH:mm:ss",
                        minute: "HH:mm",
                        hour: "HH:mm",
                        day: "MMM D",
                        week: "ll",
                        month: "MMM YYYY",
                        quarter: "[Q]Q - YYYY",
                        year: "YYYY",
                    },
                },
            }],
    },
};
function initModalWindow() {
    wrapperDiv = document.createElement("div");
    wrapperDiv.setAttribute("style", " display: none; position: fixed; z-index: 1; " +
        "padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; " +
        "background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);");
    wrapperDiv.onclick = function () {
        wrapperDiv.style.display = "none";
    };
    var wrapperContentDiv = document.createElement("div");
    wrapperContentDiv.setAttribute("style", "background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%;");
    var wrapperCloseBtn = document.createElement("span");
    wrapperCloseBtn.setAttribute("style", "color: #aaaaaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;");
    wrapperCloseBtn.innerHTML = "&times;";
    wrapperCloseBtn.onclick = function (e) {
        wrapperDiv.style.display = "none";
    };
    wrapperInnerBlock = document.createElement("div");
    wrapperInnerBlock.setAttribute("style", "text-align: center;");
    wrapperContentDiv.appendChild(wrapperCloseBtn);
    wrapperContentDiv.appendChild(wrapperInnerBlock);
    wrapperDiv.appendChild(wrapperContentDiv);
    document.body.appendChild(wrapperDiv);
}
function showStatistics(e) {
    e.preventDefault();
    e.stopPropagation();
    removeNodeChildList(wrapperInnerBlock);
    var loading = document.createElement("img");
    loading.setAttribute("src", loadingUrl);
    wrapperInnerBlock.appendChild(loading);
    wrapperDiv.style.display = "block";
    var xmlhttpStatistics = new XMLHttpRequest();
    xmlhttpStatistics.responseType = "json";
    var videoId = this.getAttribute("data-videoId");
    xmlhttpStatistics.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            removeNodeChildList(wrapperInnerBlock);
            var canvas = document.createElement("canvas");
            canvas.setAttribute("style", "height: 300px;");
            wrapperInnerBlock.appendChild(canvas);
            var data_1 = this.response;
            var ctxLike_1 = canvas.getContext("2d");
            setTimeout(function () {
                var chartLike = new Chart(ctxLike_1, {
                    type: "line",
                    data: {
                        datasets: [{
                                label: "Лайков",
                                backgroundColor: "#268808",
                                borderColor: "#268808",
                                fill: false,
                                lineTension: 0,
                                data: data_1.map(function (d) { return ({ x: new Date(d.updatedAt), y: d.likeCount }); }),
                            },
                            {
                                label: "Дизлайков",
                                fill: false,
                                backgroundColor: "#de1616",
                                borderColor: "#de1616",
                                lineTension: 0,
                                data: data_1.map(function (d) { return ({ x: new Date(d.updatedAt), y: d.dislikeCount }); })
                            }],
                    },
                    options: chartJsOptions,
                });
            }, 100);
        }
    };
    xmlhttpStatistics.open("GET", "https://tubewarden.ru/api/statistics/" + videoId, true);
    xmlhttpStatistics.send();
}
function createInfoPanel(video, el) {
    if (video && video.viewCount) {
        var likeTemplate = '<div style="display: inline-block; width: 16px; height: 15px; margin-bottom: -2px; padding-right: 2px;"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path style="{0}" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" class="style-scope yt-icon"></path></g></svg></div>';
        var dislikeTemplate = '<div style="display: inline-block; width: 16px; height: 15px; margin-bottom: -4px; padding-right: 2px;"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path style="{0}" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" class="style-scope yt-icon"></path></g></svg></div>';
        var template = '<ul style="padding-left: 0;margin-left: -5px;list-style: none;"><li style="display: inline-block;padding-right: 5px;padding-left: 5px;">{0}<i>{1}</i></li><li style="display: inline-block;padding-right: 5px;padding-left: 5px;">{2}<i>{3}</i></li><li style="display: inline-block;padding-right: 5px;padding-left: 5px;"><span style="font-size: 1.2em; color:#23527c;">Посмотреть статистику</span></ul>';
        var likeStyle = "fill: #868686";
        if (video.likeViolationCnt) {
            likeStyle = "fill: #06b75a;";
        }
        var like = formatString(likeTemplate, likeStyle);
        var dislikeStyle = "fill: #868686";
        if (video.dislikeViolationCnt) {
            dislikeStyle = "fill: #f30000";
        }
        var dislike = formatString(dislikeTemplate, dislikeStyle);
        var div = document.createElement("div");
        div.setAttribute("data-videoid", video.videoId);
        div.setAttribute("class", "tube-warden-info-panel");
        var likeCount = video.likeCount;
        if (likeCount === null) {
            likeCount = "?";
        }
        var dislikeCount = video.dislikeCount;
        if (dislikeCount === null) {
            dislikeCount = "?";
        }
        div.innerHTML = formatString(template, like, likeCount, dislike, dislikeCount);
        div.onclick = showStatistics;
        var elText = el.getElementsByClassName("text-wrapper")[0];
        elText.appendChild(div);
    }
}
function removeOldPanelList() {
    var oldPanelList = document.getElementsByClassName("tube-warden-info-panel");
    for (var index = oldPanelList.length - 1; index >= 0; index--) {
        oldPanelList[index].parentNode.removeChild(oldPanelList[index]);
    }
}
function initInfoPanelList(videoCache) {
    setTimeout(function () {
        if (!atTrendsNow()) {
            return;
        }
        removeOldPanelList();
        var elList = document.getElementsByTagName("ytd-video-renderer");
        for (var i = 0; i < elList.length; i++) {
            var el = elList[i];
            var elTitle = el.getElementsByTagName("a")[0];
            var href = elTitle.getAttribute("href");
            var videoId = getParameterByName("v", href);
            if (videoCache[videoId]) {
                createInfoPanel(videoCache[videoId], el);
            }
        }
    }, 500);
}
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function formatString(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, i) {
        return typeof args[i] !== "undefined"
            ? args[i]
            : match;
    });
}
function removeNodeChildList(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
function atTrendsNow() {
    if (location.href.indexOf("feed/trending") > -1) {
        var progressList = document.getElementsByTagName("yt-page-navigation-progress");
        if (progressList.length > 0) {
            var progress = progressList[0];
            var value = progress.getAttribute("aria-valuenow");
            if (value && value !== "100") {
                return false;
            }
        }
        if (document.getElementsByTagName("ytd-video-renderer").length > 0) {
            return true;
        }
    }
    return false;
}
loadingUrl = chrome.extension.getURL("loading.gif");
