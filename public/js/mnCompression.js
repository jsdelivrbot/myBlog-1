function compressorClass(compressor){

	this.compressor = compressor;
	this.blocksHTML  = compressor.getElementsByClassName("block-compressor");
	this.blocks = [];
	this.root = {
		x: 0,
		y: 0,
		w: compressor.offsetWidth,
		h: compressor.offsetHeight
	};
	this.getSizesBlocks();

	this.sortBlocks();

	this.fit(this.blocks);

	console.log(this.blocks);
	console.log(this.root);
	this.setSizesBlocks();


}



compressorClass.prototype.getSizesBlocks = function(){
	this_ = this;
	[].forEach.call(this.blocksHTML, function(elem, i){
		this_.blocks[i] = {
			w: elem.offsetWidth,
			h: elem.offsetHeight,
			n: i
		}
	});

}

compressorClass.prototype.setSizesBlocks = function(){
	this_ = this;
	this.blocks.forEach(function(elem, i){
		if(elem.exist){
			this_.blocksHTML[elem.n].style.top = elem.fit.y + "px";
			this_.blocksHTML[elem.n].style.left = elem.fit.x + "px";
		}else{
			this_.blocksHTML[elem.n].style.top = this_.root.h + "px";
			this_.blocksHTML[elem.n].style.left = this_.root.w + "px";
		}
	});

}



compressorClass.prototype.sortBlocks = function(){
	this_ = this;
	this.blocks.sort(function(a, b){
		switch(this_.compressor.getAttribute("sort")){
			case "area":
			var el1 = a.w * a.h;
			var el2 = b.w * b.h;
			break;
			case "width":
			var el1 = a.w;
			var el2 = b.w;
			break;
			case "height":
			var el1 = a.h;
			var el2 = b.h;
			break;
			case "none":
			default:
			return 0;
			break;
		}
		console.log(this_.compressor.getAttribute("sort"));
		if(el1 < el2)
			return 1;
		if(el1 > el2)
			return -1;
		return 0;
	});
	console.log(this.blocks);
}



compressorClass.prototype.fit = function(blocks){
	var n, node, block;
	for (n = 0; n < blocks.length; n++) {
		block = blocks[n];
		if (node = this.findNode(this.root, block.w, block.h)){
			block.fit = this.splitNode(node, block.w, block.h);
			block.exist = true;
		}else{
			block.exist = false;
		}
	};
}

compressorClass.prototype.findNode = function(root, w, h){
	if (root.used)
		return (this.findNode(root.right, w, h) || this.findNode(root.down, w, h));
	else if ((w <= root.w) && (h <= root.h))
		return root;
	else
		return null;
}

compressorClass.prototype.splitNode = function(node, w, h){
	node.used = true;
	node.down  = {
		x: node.x,
		y: node.y + h,
		w: node.w,
		h: node.h - h
	};
	node.right = {
		x: node.x + w,
		y: node.y,
		w: node.w - w,
		h: h
	};
	return node;
}




var compressors = document.getElementsByClassName("wrapper-compressor"),
newCompressor = new Array();

for(var i = 0; i < compressors.length; i++){
	newCompressor[i] = new compressorClass(compressors[i]);
}

