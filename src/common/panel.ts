function createInfoPanel(video, el) {

    if (video && video.viewCount) {
        const likeTemplate = '<div style="display: inline-block; width: 16px; height: 15px; margin-bottom: -2px; padding-right: 2px;"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path style="{0}" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" class="style-scope yt-icon"></path></g></svg></div>';
        const dislikeTemplate = '<div style="display: inline-block; width: 16px; height: 15px; margin-bottom: -4px; padding-right: 2px;"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path style="{0}" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" class="style-scope yt-icon"></path></g></svg></div>';
        const template = '<ul style="padding-left: 0;margin-left: -5px;list-style: none;"><li style="display: inline-block;padding-right: 5px;padding-left: 5px;">{0}<i>{1}</i></li><li style="display: inline-block;padding-right: 5px;padding-left: 5px;">{2}<i>{3}</i></li><li style="display: inline-block;padding-right: 5px;padding-left: 5px;"><span style="font-size: 1.2em; color:#23527c;">Посмотреть статистику</span></ul>';

        let likeStyle = "fill: #868686";

        if (video.likeViolationCnt) {
            likeStyle = "fill: #06b75a;";
        }
        const like = formatString(likeTemplate, likeStyle);

        let dislikeStyle = "fill: #868686";

        if (video.dislikeViolationCnt) {
            dislikeStyle = "fill: #f30000";
        }
        const dislike = formatString(dislikeTemplate, dislikeStyle);
        const div = document.createElement("div");
        div.setAttribute("data-videoid", video.videoId);
        div.setAttribute("class", "tube-warden-info-panel");

        let likeCount = video.likeCount;
        if (likeCount === null) {
            likeCount = "?";
        }

        let dislikeCount = video.dislikeCount;
        if (dislikeCount === null) {
            dislikeCount = "?";
        }

        div.innerHTML = formatString(template, like, likeCount, dislike, dislikeCount);
        div.onclick = showStatistics;

        const elText = el.getElementsByClassName("text-wrapper")[0];
        elText.appendChild(div);
    }

}

function removeOldPanelList() {
    const oldPanelList = document.getElementsByClassName("tube-warden-info-panel");

    for (let index = oldPanelList.length - 1; index >= 0; index--) {
        oldPanelList[index].parentNode.removeChild(oldPanelList[index]);
    }
}

function initInfoPanelList(videoCache) {
    setTimeout(() => {
        if (!atTrendsNow()) {
            return;
        }

        removeOldPanelList();

        const elList = document.getElementsByTagName("ytd-video-renderer");

        for (let i = 0; i < elList.length; i++) {
            const el = elList[i];
            const elTitle = el.getElementsByTagName("a")[0];
            const href = elTitle.getAttribute("href");
            const videoId = getParameterByName("v", href);

            if (videoCache[videoId]) {
                createInfoPanel(videoCache[videoId], el);
            }
        }

    }, 500);
}
