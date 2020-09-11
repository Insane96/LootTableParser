function OnOverCell(cell){
	try{
		var cellId = cell.id.split("-");
		for (var i = 0; i < tables.length; i++){
			if (tables[i].id == cellId[0]){
				table = tables[i];
				break;
			}
		}
		table.tooltips[cellId[1] - 1].Show(cell);
		}
	catch(e){
		console.log(" " + cell.id + " tooltip seems missing");
	}
}

function OnOutCell(cell){
	try{
		var cellId = cell.id.split("-");
		for (var i = 0; i < tables.length; i++){
			if (tables[i].id == cellId[0]){
				table = tables[i];
				break;
			}
		}
		table.tooltips[cellId[1] - 1].Hide();
	}
	catch(e){
		
	}
}

var tables = [];
var pools;
function Parse(){
	var parsed;
	var json = document.getElementById("json").value;
	json = json.replace("/\s\t\n\r/g", "");

	try {
		parsed = JSON.parse(json, (key, value) => {
			return value;
		});
	}
	catch (err) {
		document.getElementById("json").value = "";
		alert("Failed to parse json\n" + err);
		return;
	}
	pools = parsed.pools;
	document.body.innerHTML = "";
	Utils.WriteString("Pools: " + pools.length, "title", true);
	for (var i = 0; i < pools.length; i++){
		var rolls = pools[i].rolls;
		if (typeof rolls === 'object')
		{
			if (rolls.type === undefined)
				Utils.WriteString("from " + rolls.min + " to " + rolls.max + " times", "rolls", true);
			else
				Utils.WriteString("from " + rolls.min + " to " + rolls.max + " times (" + rolls.type.replace("minecraft:", "") + ")", "rolls", true);
		}
		else
		{
			Utils.WriteString(rolls + " times", "rolls", true);
		}
		var entries = pools[i].entries;
		var table = new Table(entries.length, 0, "pool");
		tables.push(table);
		table.AddHeader("Item", 0);
		table.AddHeader("Chance", 1);
		table.AddHeader("Min Count", 2);
		table.AddHeader("Max Count", 3);
		table.AddHeader("Min Durability", 4);
		table.AddHeader("Max Durability", 5);
		table.AddHeader("Min Level", 6);
		table.AddHeader("Max Level", 7);
		table.AddHeader("EnchantRandomly", 8);
		table.AddHeader("SetNbt", 9);
		table.AddHeader("SetAttributes", 10);
		table.AddHeader("SetName", 11);
		var totalWeight = 0;
		for (var entry = 0; entry < entries.length; entry++){
			table.AddToolTip("The chance for the item to appear calculated from Total Weight of the entries", entry, 1);
			var min = 1;
			var	max = 1;
			table.AddToolTip("The minimum number of items that can generate in a roll", entry, 2);
			table.AddToolTip("The maximum number of items that can generate in a roll", entry, 3);
			var damageMin = "N/A";
			var damageMax = "N/A";
			table.AddToolTip("The minimum durability that the item can generate", entry, 4);
			table.AddToolTip("The maximum durability that the item can generate", entry, 5);
			var levelMin = "Not";
			var levelMax = "Used";
			table.AddToolTip("This item will not be enchanted with levels", entry, 6);
			table.AddToolTip("This item will not be enchanted with levels", entry, 7);
			var enchantRandomly = "This item will not be enchanted randomly";
			table.AddToolTip("This item will not be enchanted randomly", entry, 8);
			var nbt = "";
			table.AddToolTip("Nbt data will not be set for this item", entry, 9);
			var attributes = "";
			table.AddToolTip("Attributes will not be set for this item", entry, 10);
			var name = "";
			table.AddToolTip("Custom Name will not be set for this item", entry, 11);
			
			var functions = entries[entry].functions;
			if (typeof functions !== 'undefined'){
				for (var f = 0; f < functions.length; f++){
					var func = functions[f].function;
					if (func.startsWith("minecraft:"))
						func = func.replace("minecraft:", "");
					if (func == "set_count"){
						var count = functions[f].count;
						if (typeof count.min === 'undefined'){
							min = count;
							max = count;
						}
						else{
							min = count.min;
							max = count.max;
						}
					}
					
					if (func == "set_data"){
						entries[entry].name += ":" + functions[f].data;
					}
					
					if (func == "set_damage"){
						var dmg = functions[f].damage;
						if (typeof dmg.min === 'undefined'){
							damageMin = dmg;
							damageMax = dmg;
						}
						else{
							damageMin = dmg.min;
							damageMax = dmg.max;
						}
					}
					
					if (func == "enchant_with_levels"){
						var level = functions[f].levels;
						var treasure = functions[f].treasure;
						if (typeof level.min === 'undefined'){
							levelMin = level;
							levelMax = level;
						}
						else{
							levelMin = level.min;
							levelMax = level.max;
						}
						table.EditToolTip("Treasure: " + treasure, entry, 6);
						table.EditToolTip("Treasure: " + treasure, entry, 7);
					}
					if (func == "enchant_randomly"){
						if (functions[f].enchantments === undefined) {
							enchantRandomly = "Item will be enchanted with a random enchantment";
						}
						else {
							enchantRandomly = "";
							var enchantments = functions[f].enchantments;
							enchantRandomly += "Roll: <br />";
							for (var e = 0; e < enchantments.length; e++){
								enchantRandomly += enchantments[e] + "<br />";
							}
						}
					}
					if (func == "set_nbt"){
						var tag = functions[f].tag;
						tag = tag.replace(/,/g, ",<br />");
						//tag = tag.replace(/[123456789abcdef]/g,"[c]");
						nbt = tag;
					}
					if (func == "set_attributes"){
						var modifiers = JSON.stringify(functions[f].modifiers);
						for (var m = 0; m < modifiers.length; m++){
							var boh = modifiers[m].replace(/,/g, ",<br />");
							attributes += boh;
						}
					}
					if (func == "set_name"){
						name = JSON.stringify(functions[f].name);
					}
				}
			}
			if (entries[entry].type.includes("empty")) {
				table.EditCell(entry, 0, "empty");
			}
			else {
				table.EditCell(entry, 0, entries[entry].name.split(":")[1]);
			}
			if (entries[entry].weight === undefined) {
				entries[entry].weight = 1;
			}
			totalWeight += parseInt(entries[entry].weight);
			table.EditCell(entry, 2, min);
			table.EditCell(entry, 3, max);
			if (damageMin != "N/A"){
				table.EditCell(entry, 4, damageMin * 100 + "%");
				table.EditCell(entry, 5, damageMax * 100 + "%");
			}
			else{
				table.EditCell(entry, 4, damageMin);
				table.EditCell(entry, 5, damageMax);
			}
			table.EditCell(entry, 6, levelMin);
			table.EditCell(entry, 7, levelMax);
			table.EditCell(entry, 8, "NO");
			if (enchantRandomly != "This item will not be enchanted randomly"){
				table.EditCell(entry, 8, "YES");
				table.EditToolTip(enchantRandomly, entry, 8);
			}
			else if (enchantRandomly == "Item will be enchanted with a random enchantment"){
				table.EditCell(entry, 8, "YES");
			}
			else if (table.GetCell(entry, 8) == "YES"){
				table.EditToolTip("This item will be enchanted with a random enchantment", entry, 8);
			}
			table.EditCell(entry, 9, "NO");
			if (nbt != ""){
				table.EditCell(entry, 9, "YES");
				table.EditToolTip(nbt, entry, 9);
			}
			table.EditCell(entry, 10, "NO");
			if (attributes != ""){
				table.EditCell(entry, 10, "YES");
				table.EditToolTip(attributes, entry, 10);
			}
			table.EditCell(entry, 11, "NO");
			if (name != ""){
				table.EditCell(entry, 11, "YES");
				table.EditToolTip(name, entry, 11);
			}
		}
		for (var e = 0; e < entries.length; e++){
			table.EditCell(e, 1, (1 / totalWeight * entries[e].weight * 100).toFixed(1) + "%");
			table.EditToolTip(entries[e].weight + " / " + totalWeight, e, 1);
		}
		
		table.Write(true);
	}
}