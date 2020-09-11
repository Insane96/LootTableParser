var Utils = new Object();

Utils.WriteString = function(string, cssClass, br){
	document.body.innerHTML += "<span class=\"" + cssClass + "\">" + string + "</span>";
	if (br)
		document.body.innerHTML += "<br />";
}

function r9(){
	return Math.floor(Math.random() * 68719476735).toString(16);
}

function ToolTip(text){
	this.text = text,
	this.id = "Tooltip" + r9(),
	this.html = "<span class=\"tooltip\" id=\"" + this.id + "\">" + this.text +"</span>",
	document.body.innerHTML += this.html,
	this.dom = document.getElementById(this.id),
	this.dom.style.visibility = "hidden",
	this.dom.style.display = "none",
	
	this.Show = function(cell){
		this.dom = document.getElementById(this.id);
		this.dom.style.visibility = "visible";
		this.dom.style.display = "initial";
		var width = this.dom.getBoundingClientRect().width;
		var height = this.dom.getBoundingClientRect().height;
		var rect = cell.getBoundingClientRect();
		var x = rect.left;
		if (x + width >= document.body.getBoundingClientRect().width){
			x -= width + rect.width;
		}
		if (x < 0)
			x = 0;
		var y = rect.top + rect.height + document.body.scrollTop;
		if (y + height >= document.body.getBoundingClientRect().height){
			y -= height + rect.height;
		}
		this.dom.style.left = x;
		this.dom.style.top = y;
	},
	
	this.Hide = function(){
		//this.dom = document.getElementById(this.id);
		this.dom.style.visibility = "hidden";
		this.dom.style.display = "none";
	},
	
	this.EditText = function(text){
		this.dom = document.getElementById(this.id);
		this.text = text;
		this.dom.innerHTML = this.text;
	}
}

function Table(rows, columns, cssClass){
	this.rows = rows,
	this.cols = columns,
	this.cellsCount = this.rows * this.cols,
	this.cells = new Array(this.cellsCount),
	this.tooltips = new Array(this.cellsCount),
	this.headers = new Array(this.cols),
	
	this.id = r9(),

	this.cssClass = cssClass,
	
	this.Write = function(br){
		var toWrite = "";
		toWrite += "<table class=\"" + this.cssClass + "\" id=\"" + this.id + "\">";
		for (var r = -1; r < this.rows; r++){
			toWrite += "<tr>";
			for(var c = 0; c < this.cols; c++){
				//console.log(this.headers[c]);
				if (r == -1){
					if (typeof this.headers[c] === 'undefined')
						toWrite += "<th> </th>";
					else
						toWrite += "<th>" + this.headers[c] + "</th>";
				}
				else{
					if (typeof this.cells[this.RowColToCell(r, c)] === 'undefined')
						toWrite += "<td></td>";
					else
						toWrite += "<td><span class=\"tableCell\" id=\"" + this.id + "-" + this.RowColToCell(r, c + 1) + "\" onmouseover=\"OnOverCell(this);\" onmouseout=\"OnOutCell(this);\">" + this.cells[this.RowColToCell(r, c)] + "</span></td>";
				}
			}
			toWrite += "</tr>";
		}
		toWrite += "</table>";
		if (br)
			toWrite += "<br />";
		
		document.body.innerHTML += toWrite;
	},
	
	this.AddHeader = function(header, column){
		if (column > this.cols)
			return;
		
		this.headers[column] = header;
		this.cols++;
	},
	
	this.EditCell = function(r, c, content){
		if (r > this.rows || c > this.cols)
			return;
		this.cells[this.RowColToCell(r, c)] = content;
	},
	
	this.GetCell = function(r, c){
		if (r > this.rows || c > this.cols)
			return;
		return this.cells[this.RowColToCell(r, c)];
	},

	this.AddToolTip = function(text, r, c){
		var cell = this.RowColToCell(r, c);
		this.tooltips[cell] = new ToolTip(text);
		//console.log("Added Tooltip", text, "to", r, c, "at", cell);
	},
	
	this.EditToolTip = function(text, r, c){
		var cell = this.RowColToCell(r, c);
		this.tooltips[cell].EditText(text);
		//console.log("Added Tooltip", text, "to", r, c, "at", cell);
	},
	
	this.RowColToCell = function(r, c){
		return (r * this.cols + c - 1);
	}
}