var config = {
	byteArraySize: 4096000,
	charArraySize: 2048
}


var funcLoad = function (e, conf) {
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
	this.handledBytes = 0;
	this.preloadedBytes = 0;
	this.byteArrays = [];
	this.byteArraysCounter = 0;
	this.partsOfTextCounter = 0;
	this.byteArraySize = conf.byteArraySize || 4096000;
	this.charArraySize = conf.charArraySize || 512;
	this.loadEndFlag = false;
	this.pauseFlag = false;


	this.onceFuncProgressBind = this.onceFuncProgress.bind(this, e);
	this.funcProgressBind = this.funcProgress.bind(this);
	this.stopStartDwnlWrapFuncBind = this.stopStartDwnlWrapFunc.bind(this, e);

	this.closeDownload.addEventListener("click", this.closeDownloadFunc.bind(this));
	this.stopStartDwnlWrap.addEventListener("click", this.stopStartDwnlWrapFuncBind);

	this.xhr.addEventListener("progress", this.onceFuncProgressBind);
	this.xhr.addEventListener("progress", this.funcProgressBind);
	this.xhr.addEventListener("error", this.onerrorFunc.bind(this));
	this.xhr.addEventListener("readystatechange", this.onreadystatechange.bind(this));


	this.xhr.open('GET', e.target.href);
	this.xhr.responseType = 'text';
	this.xhr.overrideMimeType('text\/plain; charset=x-user-defined');
	this.xhr.send();
	return false;
}

funcLoad.prototype.onceFuncProgress = function (e, event) {
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
	this.textSize.innerText = this.textSize.innerText || "(" + ((this.totalSize || event.total) / 1024000).toFixed(2) + "Mb)";
	this.totalSize = event.total;
	if ((this.textWrapper.offsetWidth - this.textSizeWrapper.offsetWidth) < this.textNameLimiter.offsetWidth) {
		this.textNameLimiter.classList.add("size-limiter");
		this.textDotsWrapper.classList.remove("load-hide");
	}
}

funcLoad.prototype.funcProgress = function (event) {
	this.colorLineWrapper.style.width = ((event.loaded + this.preloadedBytes) / (this.totalSize + this.preloadedBytes)) * this.maxWidthLine + "px";
	this.loaded = event.loaded;
	this.bytesHandler.call(this);
}

funcLoad.prototype.bytesHandler = function () {
	if ((this.handledBytes < this.loaded && (this.loaded - this.handledBytes) >= this.byteArraySize) || this.pauseFlag || this.loaded == this.totalSize) {
		var start = this.handledBytes;
		var end = (this.loaded - start) < this.byteArraySize ? (this.pauseFlag ? this.loaded : this.totalSize) : (start + this.byteArraySize);
		var worker = new Worker(workerURL);
		this.handledBytes += end - start;
		worker.onmessage = function (event) {
			this.byteArrays[event.data.byteArraysPosition - 1] = event.data.byteArray;
			this.byteArraysCounter++;
			if (this.loadEndFlag && this.partsOfTextCounter === this.byteArraysCounter) {
				this.stopStartDwnlWrap.removeEventListener("click", this.stopStartDwnlWrapFuncBind);
				this.byteArraysCounter++;
				this.xhr.abort();
				this.xhr = undefined;
				var blob = new Blob(this.byteArrays);
				this.byteArrays = undefined;
				this.hidenLink.href = this.url.createObjectURL(blob);
				this.hidenLink.setAttribute("download", this.filename);
				this.hidenLink.click();
				blob = undefined;
				this.hidenLink = undefined;
				this.stopStartDwnl.classList.add("start-dwnl");
				this.stopStartDwnl.classList.remove("stop-dwnl");
				this.colorLine.classList.remove("color-line-animated");
			}
			worker = undefined;
		}.bind(this);
		this.partsOfTextCounter++;

		worker.postMessage({
			byteCharacters: this.xhr.responseText.slice(start, end),
			byteArraysPosition: this.partsOfTextCounter,
			sliceSize: this.charArraySize
		});
		this.loadEndFlag = end == this.totalSize;
		this.pauseFlag = false;
		if (this.loaded == this.totalSize && end != this.totalSize) {
			this.bytesHandler.call(this);
		}
	}
}


funcLoad.prototype.closeDownloadFunc = function (event) {
	if (this.xhr) {
		this.xhr.abort();
	}
	this.wrapper.removeChild(this.panelDownload);
	if (!this.wrapper.childElementCount) {
		document.body.removeChild(this.wrapper);
	}
}


funcLoad.prototype.stopStartDwnlWrapFunc = function (e) {
	switch (this.xhr.readyState) {
		case 0:
		case 1:
		case 4:
			this.xhr.open('GET', e.target.href);
			this.xhr.responseType = 'text';
			this.xhr.overrideMimeType('text\/plain; charset=x-user-defined');
			this.xhr.setRequestHeader("range", "bytes=" + this.preloadedBytes + "-");
			this.xhr.addEventListener("progress", this.onceFuncProgressBind);
			this.xhr.addEventListener("progress", this.funcProgressBind);
			this.loaded = 0;
			this.handledBytes = 0;

			this.xhr.send();
			this.stopStartDwnl.classList.add("stop-dwnl");
			this.stopStartDwnl.classList.remove("start-dwnl");
			this.colorLine.classList.add("color-line-animated");
			break;
		case 2:
		case 3:
			this.pauseFlag = true;
			this.xhr.removeEventListener("progress", this.funcProgressBind);
			this.bytesHandler.call(this);
			this.preloadedBytes += this.loaded;
			this.xhr.abort();
			this.handledBytes = this.loaded;
			this.stopStartDwnl.classList.add("start-dwnl");
			this.stopStartDwnl.classList.remove("stop-dwnl");
			this.colorLine.classList.remove("color-line-animated");
			break;

	}
}

funcLoad.prototype.onreadystatechange = function () {
	if (this.xhr.readyState == 2 && !this.xhr.getResponseHeader("Content-Range")) {
		this.byteArrays = [];
		this.partsOfTextCounter = 0;
		this.byteArraysCounter = 0;
		this.preloadedBytes = 0;
	}
};


funcLoad.prototype.onerrorFunc = function () {
	this.textName.innerText = "Error";
	this.byteArrays = [];
	this.stopStartDwnlWrap.removeEventListener("click", this.stopStartDwnlWrapFuncBind);
};

var url = window.URL || window.webkitURL;
var workerScriptString = "onmessage = function (event) {postMessage(b64toBlob(event.data.byteCharacters, event.data.byteArraysPosition, event.data.sliceSize));};function b64toBlob(byteCharacters, byteArraysPosition, sliceSize, lastPartFlag){sliceSize = sliceSize;var byteArrays = [];for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {var slice = byteCharacters.slice(offset, offset + sliceSize);var byteNumbers = new Array(slice.length); for (var i = 0; i < slice.length; i++) {byteNumbers[i] = slice.charCodeAt(i);}var byteArray = new Uint8Array(byteNumbers);byteArrays.push(byteArray); byteArray = undefined;}	return {byteArray: new Blob(byteArrays),byteArraysPosition: byteArraysPosition};}";
var workerURL = url.createObjectURL(new Blob([workerScriptString]));


var loads = document.getElementsByClassName("load");
for (var i = 0; i < loads.length; i++) {
	loads[i].addEventListener("click", function (e) {
		new funcLoad(e, config)
	})
}
