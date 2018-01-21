const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0,
    },
    tooltips: {
        callbacks: {
            title: (tooltipItem, data) => {
                return moment(tooltipItem[0].xLabel).format("DD-MM-YYYY HH:mm");
            },
        },
    },
    elements: {
        point: {
            radius: 2 ,
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
    wrapperDiv.onclick = () => {
        wrapperDiv.style.display = "none";
    };

    const wrapperContentDiv = document.createElement("div");
    wrapperContentDiv.setAttribute("style", "background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%;");

    const wrapperCloseBtn = document.createElement("span");
    wrapperCloseBtn.setAttribute("style", "color: #aaaaaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;");
    wrapperCloseBtn.innerHTML = "&times;";
    wrapperCloseBtn.onclick = (e) => {
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

    const loading = document.createElement("img");
    loading.setAttribute("src", loadingUrl);
    wrapperInnerBlock.appendChild(loading);
    wrapperDiv.style.display = "block";

    const xmlhttpStatistics = new XMLHttpRequest();
    xmlhttpStatistics.responseType = "json";

    const videoId = this.getAttribute("data-videoId");

    xmlhttpStatistics.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            removeNodeChildList(wrapperInnerBlock);

            const canvas = document.createElement("canvas");
            canvas.setAttribute("style", "height: 300px;");
            wrapperInnerBlock.appendChild(canvas);
            const data = this.response;
            const ctxLike = canvas.getContext("2d");

            setTimeout(() => {
                const chartLike = new Chart(ctxLike, {
                    type: "line",
                    data: {
                        datasets: [{
                            label: "Лайков",
                            backgroundColor: "#268808",
                            borderColor: "#268808",
                            fill: false,
                            lineTension: 0,
                            data: data.map((d) => ({x: new Date (d.updatedAt), y: d.likeCount } )),
                        },
                        {
                            label: "Дизлайков",
                            fill: false,
                            backgroundColor: "#de1616",
                            borderColor: "#de1616",
                            lineTension: 0,
                            data: data.map((d) => ({x: new Date (d.updatedAt), y: d.dislikeCount } ))
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
