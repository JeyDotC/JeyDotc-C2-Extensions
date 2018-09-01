// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Identity = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Identity.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		
		this.name = '';
		this.tags = [];
		
		this._addedTag = '';
		this._removedTag = '';
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.name = this.properties[0];
		
		var tagsString = this.properties[1];
		var tagsSeparator = this.properties[2];
		
		if(tagsString){
			if(tagsSeparator){
				this.tags = tagsString.split(tagsSeparator);
			}else{
				this.tags = [ tagsString ];
			}
		}
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;
	};
	
	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your behavior's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			"n": this.name,
			"t": this.tags
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
		this.name = o["n"];
		this.tags = o["t"];
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": this.type.name,
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				{"name": "Name", "value": this.name},
				{"name": "Tags", "value": this.tags.join(',')}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "Name")
			this.name = value;
		
		if (name === "Tags")
			this.tags = value.split(',');
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.IsMoving = function ()
	{
		// ... see other behaviors for example implementations ...
		return false;
	};
	
	// ... other conditions here ...
	
	// static condition
	Cnds.prototype.PickByName = function (name)
	{
		return PickBy.call(this, inst => { 
			var behaviorInstance = GetIdentityBehavior(inst);
			return behaviorInstance.name == name;
		});
	};
	
	Cnds.prototype.PickByTag = function (tag)
	{
		return PickBy.call(this, inst => { 
			var behaviorInstance = GetIdentityBehavior(inst);
			return behaviorInstance.tags.indexOf(tag) !== -1;
		});
	};
	
	Cnds.prototype.OnTagged = function(tag) {
		var result = this._addedTag && this._addedTag == tag;
		
		if(result)
			this._addedTag = '';
		
		return result;
	};
	
	Cnds.prototype.OnUnTagged = function(tag) {
		var result = this._removedTag && this._removedTag == tag;
		
		if(result)
			this._removedTag = '';
		
		return result;
	};
	
	function GetIdentityBehavior(inst){
		
		for(var index in inst.behavior_insts){
			var behaviorInstance = inst.behavior_insts[index];
			
			if(behaviorInstance.behavior instanceof cr.behaviors.Identity){
				return behaviorInstance;
			}
		}
		
		return undefined;
	};
	
	function PickBy(condition){
		var i, len, j, inst, families, instances, sol;
		var cnd = this.runtime.getCurrentCondition();
		
		sol = this.objtype.getCurrentSol();
		
		if (sol.select_all)
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			cr.clearArray(sol.else_instances);
			
			instances = this.objtype.instances;
			
			for (i = 0, len = instances.length; i < len; i++)
			{
				inst = instances[i];
				
				if (condition(inst)){
					if(!cnd.inverted)
						sol.instances.push(inst);
					else
						sol.else_instances.push(inst);
				}
				else{
					if(!cnd.inverted)
						sol.else_instances.push(inst);
					else
						sol.instances.push(inst);
				}
			}
		}
		else
		{
			for (i = 0, j = 0, len = sol.instances.length; i < len; i++)
			{
				inst = sol.instances[i];
				sol.instances[j] = inst;
				
				if(!cnd.inverted){
					if (!condition(inst)){
						sol.else_instances.push(inst);
					}
					else {
						j++;
					}
				} else {
					if (condition(inst)){
						sol.else_instances.push(inst);
					}
					else {
						j++;
					}
				}
			}
			
			cr.truncateArray(sol.instances, j);
		}			
		
		this.objtype.applySolToContainer();
		return !!sol.instances.length;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetName = function (name)
	{
		this.name = name;
	};
	
	Acts.prototype.AddTag = function (tag)
	{
		if(this.tags.indexOf(tag) === -1){
			this.tags.push(tag);
			this._addedTag = tag;
			this.runtime.trigger(cr.behaviors.Identity.prototype.cnds.OnTagged, this.inst);
		}
	};
	
	Acts.prototype.RemoveTag = function (tag)
	{
		var index = this.tags.indexOf(tag);
		
		if(index !== -1){
			cr.arrayRemove(this.tags, index);
			this._removedTag = tag;
			this.runtime.trigger(cr.behaviors.Identity.prototype.cnds.OnUnTagged, this.inst);
		}
	};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	/*Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/
	
	Exps.prototype.Name = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.name);		// for ef_return_string
	};
	
	Exps.prototype.HasTag = function (ret, tag)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.tags.indexOf(tag) !== -1 ? 1 : 0);
	};
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());