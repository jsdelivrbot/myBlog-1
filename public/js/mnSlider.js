function sliderClass(slider){
	this.slider = slider;
	this.sliderLine = this.slider.getElementsByClassName("slider-line")[0];
	this.sliderBlocks = this.slider.getElementsByClassName("slider-block");
	this.createButtons();
	this.buttonLeft = this.slider.getElementsByClassName("button-left")[0];
	this.buttonRight = this.slider.getElementsByClassName("button-right")[0];
	this.width = this.sliderBlocks[0].offsetWidth;
	this.height = this.sliderBlocks[0].offsetHeight;
	this.length = this.sliderBlocks.length;
	this.position = 0;
	this.lastPosition = 0;
	this.duration = parseFloat(getComputedStyle(this.sliderLine).transitionDuration) * 1000;

	this.createStatusBlocks();
	this.statusWrapper = this.slider.getElementsByClassName("status-wrapper")[0];
	this.statusBlocks = this.slider.getElementsByClassName("status-blocks");
	this.statusBlocks[0].classList.add("active"); 


	switch(this.slider.getAttribute("sliderType")){ 
		default:
		case "1":
		this.formation = this.formation1;
		this.refresh = this.refresh1;
		break;
		case "2":
		this.formation = this.formation2;
		this.refresh = this.refresh2;
		break;
		case "3":
		this.formation = this.formation3;
		this.refresh = this.refresh3;
		break;
		case "4":
		this.formation = this.formation4;
		this.refresh = this.refresh4;
		break;
	}

	this.formation();

	this.setClick();
	this.setSliderInterval();

	var that = this;
	window.onfocus = function(){
		that.setSliderInterval();
	}
	window.onblur = function(){
		that.removeSliderInterval();
	}

	this.slider.style.width = this.width + "px";
	this.slider.style.height = this.height - 4 + "px";

}

sliderClass.prototype.setClick = function(that_){
	var that = that_ || this;
	that.buttonLeft.onclick = function(){
		that.left.apply(that);
	}

	that.buttonRight.onclick = function(){
		that.right.apply(that);
	}

	that.statusWrapper.onclick = function(e){
		that.goTo.apply(that, [e]);
	}

	
}

sliderClass.prototype.removeClick = function(){
	this.buttonLeft.onclick = function(){}

	this.buttonRight.onclick = function(){}

	this.statusWrapper.onclick = function(e){
	}


}

sliderClass.prototype.setTimeoutClick = function(){
	var that = this;
	this.removeClick();
	setTimeout(this.setClick, this.duration, that);
}

sliderClass.prototype.formation1 = function(){
	this.sliderLine.style.width = (this.width * this.length) + "px";
	this.sliderLine.style.height = this.height + "px";
	this.sliderLine.classList.add("slider-line1");
}

sliderClass.prototype.formation2 = function(){
	this.sliderLine.style.width = this.width + "px";
	this.sliderLine.style.height = this.height + "px";
	this.sliderLine.classList.add("slider-line2");
	for(var i = 0; i < this.length; i++){
		this.sliderBlocks[i].classList.add("hide-opacity");
	}
	this.sliderBlocks[0].classList.remove("hide-opacity");
}

sliderClass.prototype.formation3 = function(){
	this.sliderLine.style.width = this.width + "px";
	this.sliderLine.style.height = this.height + "px";
	this.sliderLine.classList.add("slider-line3");
	for(var i = 0; i < this.length; i++){
		this.sliderBlocks[i].classList.add("rotate");
	}
	this.sliderBlocks[0].classList.remove("rotate");
}

sliderClass.prototype.formation4 = function(){
	this.sliderLine.style.width = this.width + "px";
	this.sliderLine.style.height = this.height + "px";
	console.log(this.duration);
	this.sliderLine.classList.add("slider-line4");
	for(var i = 0; i < this.length; i++){
		this.sliderBlocks[i].classList.add("hide-display");
	}
	this.sliderBlocks[0].classList.remove("hide-display");
}

sliderClass.prototype.refresh1 = function(){
	this.sliderLine.style.left = this.width * this.position * -1 + "px";
}

sliderClass.prototype.refresh2 = function(){
	for(var i = 0; i < this.length; i++){
		this.sliderBlocks[i].classList.add("hide-opacity");
	}
	this.sliderBlocks[this.position].classList.remove("hide-opacity");
}

sliderClass.prototype.refresh3 = function(){
	for(var i = 0; i < this.length; i++){
		if(i != this.position){
			this.sliderBlocks[i].classList.add("toBack");
		}
	}
	this.sliderBlocks[this.position].classList.remove("toBack");
	this.sliderBlocks[this.position].classList.remove("rotate");
	var that = this;
	function hide(that){
		for(var i = 0; i < that.length; i++){
			if(i != that.position){
				that.sliderBlocks[i].classList.add("rotate");
			}
		}
	}
	setTimeout(hide, this.duration, that);
}

sliderClass.prototype.refresh4 = function(){
	this.sliderLine.classList.remove("not-animate");
	if((this.position >= this.lastPosition) && (this.position != this.length - 1 || this.lastPosition != 0) || (this.position == 0 && this.lastPosition == this.length - 1)){
		this.sliderLine.classList.add("rotate-right");
	}else{
		this.sliderLine.classList.add("rotate-left");
	}
	var that = this;
	function replacement(that){
		for(var i = 0; i < that.length; i++){
			that.sliderBlocks[i].classList.add("hide-display");
		}
		that.sliderBlocks[that.position].classList.remove("hide-display");
	}

	function replacementEnd(that){
		that.sliderLine.classList.remove("rotate-right");
		that.sliderLine.classList.remove("rotate-left");
		that.sliderLine.classList.add("not-animate");
	}
	setTimeout(replacement, this.duration / 2, that);
	setTimeout(replacementEnd, this.duration, that);
}

sliderClass.prototype.refreshStatus = function(){
	for(var i = 0; i < this.length; i++){
		this.statusBlocks[i].classList.remove("active");
	}
	this.statusBlocks[this.position].classList.add("active");
}

sliderClass.prototype.left = function(){
	this.lastPosition = this.position;
	if(this.position > 0){
		this.position--;
	}else{
		this.position = this.length - 1;
	}
	this.refresh();
	this.refreshStatus();
	this.setTimeoutClick();
	this.setSliderInterval();
}

sliderClass.prototype.right = function(){
	this.lastPosition = this.position;
	if(this.position < this.length - 1){
		this.position++;
	}else{
		this.position = 0;
	}
	this.refresh();
	this.refreshStatus();
	this.setTimeoutClick();
	this.setSliderInterval();
}

sliderClass.prototype.goTo = function(e){
	for(var i = 0; i < this.length; i++){
		if(e.target == this.statusBlocks[i] && i != this.position){
			this.lastPosition = this.position;
			this.position = i;
			this.refresh();
			this.refreshStatus();
			this.setTimeoutClick();
			this.setSliderInterval();
			break;
		}
	}
}

sliderClass.prototype.createStatusBlocks = function(){
	var statusWrapper = document.createElement("div"),
	statusBlock = document.createElement("div"),
	clone;
	statusWrapper.classList.add("status-wrapper");
	statusBlock.classList.add("status-blocks");
	for(var i = 1; i <= this.length; i++){
		clone = statusBlock.cloneNode(true);
		statusWrapper.appendChild(clone);
	}
	this.slider.appendChild(statusWrapper);
}

sliderClass.prototype.createButtons = function(){
	var buttonLeft = document.createElement("div"),
	buttonRight = document.createElement("div");

	buttonLeft.classList.add("button-left");
	buttonRight.classList.add("button-right");

	this.slider.appendChild(buttonLeft);
	this.slider.appendChild(buttonRight);
}

sliderClass.prototype.setSliderInterval = function(){
	if(this.slider.hasAttribute("timeout") && this.slider.getAttribute("timeout") * 1000 > this.duration){
		var that = this;
		clearInterval(this.sliderInterval);
		this.sliderInterval = setInterval(function(that_){
			that_.right();
		}, this.slider.getAttribute("timeout") * 1000, that);
	}
}

sliderClass.prototype.removeSliderInterval = function(){
	if(this.slider.hasAttribute("timeout") && this.slider.getAttribute("timeout") * 1000 > this.duration){
		clearInterval(this.sliderInterval);
	}
}


window.addEventListener("load", function(){
	var sliders = document.getElementsByClassName("slider"),
	newSlider = new Array();

	for(var i = 0; i < sliders.length; i++){
		newSlider[i] = new sliderClass(sliders[i]);
	}
})
