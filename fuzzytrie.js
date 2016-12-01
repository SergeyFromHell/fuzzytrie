var stop = '';

var FuzzyTrie = function() {
	this._root = {};
}

FuzzyTrie.prototype.add = function(word) {
	var node = this._root;
	for(var i=0; i<word.length; ++i) {
		var c = word.charAt(i);
		if(node[c] === undefined) 
			node[c] = {};
		node = node[c];
	}
	if(node[stop])
		return false;
	node[stop] = true;
	return true;
}

FuzzyTrie.prototype.has = function(word) {
	var node = this._root;
	for(var i=0; i<word.length; ++i) {
		var c = word.charAt(i);
		if(node[c] === undefined)
			return false;
		node = node[c];
	}
	return node[stop];
}

FuzzyTrie.prototype.all = function() {
	var result = [];
	this._all(result,this._root,'');
	return result;
}

FuzzyTrie.prototype._all = function(result,node,stack) {
	if(node[stop])
		result.push(stack);
	for(var k in node) {
		if(k === stop)
			continue;
		this._all(result,node[k],stack+k);
	}
}

FuzzyTrie.prototype.delete = function(word) {
	var node = this._root;
	var stack = [node];
	for(var i=0; i<word.length; ++i) {
		var c = word.charAt(i);
		if(node[c] === undefined)
			return false;
		node = node[c];
		stack.push(node);
	}
	if(!node[stop])
		return false;
	delete node[stop];
	for(var i=stack.length-2; i>=0; --i) {
		if(!this._empty(stack[i+1]))
			break;
		delete stack[i][word.charAt(i)];		
	}
	return true;
}

FuzzyTrie.prototype.empty = function() {
	return this._empty(this._root);
}

FuzzyTrie.prototype._empty = function(node) {
	if(node[stop])
		return false;
	for(var k in node) {
		if(k !== stop)
			return false;
	}
	return true;
}

FuzzyTrie.prototype.find = function(word,errors) {
	var result = {};	
	this._find(word,result,errors,0,0,this._root,'');
	for(var k in result) {
		result[k] = errors - result[k];
	}
	return result;
}

FuzzyTrie.prototype._find = function(word,result,errors,replaces,pos,node,stack,inserted,tail) {
	var c = (pos === word.length) ? undefined : word.charAt(pos);
	if(tail === undefined) {
		if(c === undefined) {
			if(node[stop] && (result[stack] === undefined || result[stack] < errors)) 
					result[stack] = errors;
		} else if(node[c] !== undefined) {
			this._find(word,result,errors,0,pos+1,node[c],stack+c);
		}
		if(errors) {
			// delete
			if(c !== undefined && !inserted)
				this._find(word,result,errors-1,replaces+1,pos+1,node,stack);			
			// transposition
			var maxpos = Math.min(pos+errors,word.length-1);
			for(var i=pos+1; i<=maxpos; ++i) {
				var c2 = word.charAt(i);
				if(c2 === c)
					continue;
				var node2 = node[c2];
				if(node2 !== undefined) {
					var node3 = node2[c];
					// with delete of middle part
					if(node3 !== undefined)
						this._find(word,result,errors-(i-pos),0,i+1,node3,stack+c2+c);
					if(i === pos+1) {
						// with insert into the middle part
						this._find(word,result,errors-1,0,pos+2,node2,stack+c2,undefined,c);
					}
				}			
			}					
		}
	} else if(inserted && node[tail]) {
		this._find(word,result,errors,0,pos,node[tail],stack+tail);
	}
	if(errors || replaces) {
		// insert / replace
		for(var k in node) {
			if(k === stop || (k === c && !replaces))
				continue;
			this._find(word,result,replaces ? errors : errors-1,replaces ? replaces-1 : 0,pos,node[k],stack+k,true,tail)
		}
	}
}

exports = module.exports = FuzzyTrie;