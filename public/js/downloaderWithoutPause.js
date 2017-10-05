var funcLoad2 = function (e) {
	e.preventDefault();
	this.wrapper = document.querySelector("#panelDownloadWrapper");
	if (!this.wrapper) {
		this.wrapper = document.createElement("div");
		this.wrapper.id = "panelDownloadWrapper";
		document.body.appendChild(this.wrapper);
	}
	this.panelDownload = document.createElement("div");
	this.PDRightSide = document.createElement("div");
	this.PDLeftSide = document.createElement("div");
	this.textWrapper = document.createElement("div");
	this.textNameWrapper = document.createElement("div");
	this.textDotsWrapper = document.createElement("div");
	this.textNameLimiter = document.createElement("div");
	this.textSizeWrapper = document.createElement("div");
	this.line = document.createElement("div");
	this.colorLineWrapper = document.createElement("div");
	this.colorLine = document.createElement("div");
	this.stopStartDwnlWrap = document.createElement("div");
	this.stopStartDwnl = document.createElement("div");
	this.closeDownload = document.createElement("div");
	this.textName = document.createElement("span");
	this.textDots = document.createElement("span");
	this.textSize = document.createElement("span");
	this.closeButoonTextNode = document.createElement("span");

	this.panelDownload.classList.add("panel-download");
	this.PDRightSide.classList.add("p-d-right-side");
	this.PDLeftSide.classList.add("p-d-left-side");
	this.textWrapper.classList.add("text-wrapper");
	this.textNameWrapper.classList.add("text-name-wrapper");
	this.textDotsWrapper.classList.add("text-dots-wrapper");
	this.textDotsWrapper.classList.add("load-hide");
	this.textNameLimiter.classList.add("text-name-limiter");
	this.textSizeWrapper.classList.add("text-size-wrapper");
	this.line.classList.add("line");
	this.colorLineWrapper.classList.add("color-line-wrapper");
	this.colorLine.classList.add("color-line");
	this.colorLine.classList.add("color-line-animated");
	this.textName.classList.add("text-name");
	this.textDots.classList.add("text-dots");
	this.textSize.classList.add("text-size");
	this.stopStartDwnlWrap.classList.add("stop-start-dwnl-wrap");
	this.stopStartDwnl.classList.add("stop-dwnl");
	this.closeDownload.classList.add("close-download");

	this.closeDownload.appendChild(this.closeButoonTextNode);
	this.line.appendChild(this.colorLineWrapper);
	this.colorLineWrapper.appendChild(this.colorLine);
	this.textNameWrapper.appendChild(this.textNameLimiter);
	this.textNameLimiter.appendChild(this.textName);
	this.textDotsWrapper.appendChild(this.textDots);
	this.textSizeWrapper.appendChild(this.textSize);
	this.panelDownload.appendChild(this.PDLeftSide);
	this.panelDownload.appendChild(this.PDRightSide);
	this.textWrapper.appendChild(this.textNameWrapper);
	this.textWrapper.appendChild(this.textDotsWrapper);
	this.textWrapper.appendChild(this.textSizeWrapper);
	this.PDLeftSide.appendChild(this.textWrapper);
	this.PDLeftSide.appendChild(this.line);
	this.PDRightSide.appendChild(this.stopStartDwnlWrap);
	this.PDRightSide.appendChild(this.closeDownload);
	this.stopStartDwnlWrap.appendChild(this.stopStartDwnl);
	this.wrapper.appendChild(this.panelDownload);

	this.closeButoonTextNode.innerHTML = "✖";
	this.textDots.innerHTML = "...";

	this.xhr = new XMLHttpRequest();
	this.hidenLink = document.createElement("a");
	this.url = window.URL || window.webkitURL;
	this.maxWidthLine = this.panelDownload.querySelector(".line").offsetWidth;
	this.filename = "";


	this.stopStartDwnlWrapFuncBind = this.stopStartDwnlWrapFunc.bind(this, e);

	this.closeDownload.addEventListener("click", this.closeDownloadFunc.bind(this));
	this.stopStartDwnlWrap.addEventListener("click", this.stopStartDwnlWrapFuncBind);

	this.xhr.addEventListener("progress", this.onceFuncProgress.bind(this, e));
	this.xhr.addEventListener("progress", this.funcProgress.bind(this));
	this.xhr.addEventListener("error", this.onerrorFunc.bind(this));
	this.xhr.addEventListener("loadend", this.onloadendFunc.bind(this));


	this.xhr.open('GET', e.target.href);
	this.xhr.responseType = 'blob';
	this.xhr.send();
	return false;
}

funcLoad2.prototype.onceFuncProgress = function (e, event) {
	this.xhr.removeEventListener("progress", this.onceFuncProgressBind);
	var disposition = this.xhr.getResponseHeader('Content-Disposition');
	var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	var matches = filenameRegex.exec(disposition);
	if (matches != null && matches[1]) {
		this.filename = matches[1].replace(/['"]/g, '');
	} else {
		this.filename = e.target.href.slice(e.target.href.lastIndexOf("/") + 1);
	}

	this.textName.innerText = this.filename;
	this.textName.setAttribute("title", this.filename);
	this.textSize.innerText = this.textSize.innerText || "(" + (event.total / 1024000).toFixed(2) + "Mb)";

	if ((this.textWrapper.offsetWidth - this.textSizeWrapper.offsetWidth) < this.textNameLimiter.offsetWidth) {
		this.textNameLimiter.classList.add("size-limiter");
		this.textDotsWrapper.classList.remove("load-hide");
	}
}

funcLoad2.prototype.funcProgress = function (event) {
	this.colorLineWrapper.style.width = (event.loaded / event.total) * this.maxWidthLine + "px";
}


funcLoad2.prototype.closeDownloadFunc = function (event) {
	if (this.xhr) {
		this.xhr.abort();
	}
	this.wrapper.removeChild(this.panelDownload);
	if (!this.wrapper.childElementCount) {
		document.body.removeChild(this.wrapper);
	}
}


funcLoad2.prototype.stopStartDwnlWrapFunc = function (e) {
	switch (this.xhr.readyState) {
		case 0:
		case 1:
		case 4:
			this.xhr.open('GET', e.target.href);
			this.xhr.responseType = 'blob';
			this.xhr.send();
			this.stopStartDwnl.classList.add("stop-dwnl");
			this.stopStartDwnl.classList.remove("start-dwnl");
			this.colorLine.classList.add("color-line-animated");
			break;
		case 2:
		case 3:
			this.xhr.abort();
			this.stopStartDwnl.classList.add("start-dwnl");
			this.stopStartDwnl.classList.remove("stop-dwnl");
			this.colorLine.classList.remove("color-line-animated");
			break;

	}
}



funcLoad2.prototype.onloadendFunc = function () {
	if (this.xhr.readyState == 4 && this.xhr.status == 200) {
		this.stopStartDwnlWrap.removeEventListener("click", this.stopStartDwnlWrapFuncBind);
		this.hidenLink.href = this.url.createObjectURL(this.xhr.response);
		this.hidenLink.setAttribute("download", this.filename);
		this.hidenLink.click();
		this.stopStartDwnl.classList.add("start-dwnl");
		this.stopStartDwnl.classList.remove("stop-dwnl");
	}
};

funcLoad2.prototype.onerrorFunc = function () {
	this.textName.innerText = "Error";
};





var loads = document.getElementsByClassName("load2");
for (var i = 0; i < loads.length; i++) {
	loads[i].addEventListener("click", function (e) {
		new funcLoad2(e)
	})
}
