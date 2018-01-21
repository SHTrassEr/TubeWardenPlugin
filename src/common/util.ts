function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) {
        return null;
    }

    if (!results[2]) {
        return "";
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function formatString(format: string, ...args: string[]) {
    // var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, (match, i) => {
        return typeof args[i] !== "undefined"
        ? args[i]
        : match
        ;
    });
}

function removeNodeChildList(node) {

    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function atTrendsNow() {
    if (location.href.indexOf("feed/trending") > -1) {
        const progressList = document.getElementsByTagName("yt-page-navigation-progress");
        if (progressList.length > 0) {
            const progress = progressList[0];
            const value = progress.getAttribute("aria-valuenow");
            if (value  &&  value !== "100") {
                return false;
            }
        }

        if (document.getElementsByTagName("ytd-video-renderer").length > 0) {
            return true;
        }
    }

    return false;
}
