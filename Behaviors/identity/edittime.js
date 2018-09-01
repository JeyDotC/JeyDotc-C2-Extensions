function GetBehaviorSettings()
{
	return {
		"name":			"Identity",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"Identity",			// this is used to Identity this behavior and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Applies a Name and/or a series of tags to an object and pick those object by Name or Tag.",
		"author":		"JeyDotC",
		"help url":		"<your website or a manual entry on Scirra.com>",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely Identity this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>, and {my} for the current behavior icon & name
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
// AddCondition(0, cf_none, "Is moving", "My category", "{my} is moving", "Description for my condition!", "IsMoving");
AddStringParam("Name", "Instance name");
AddCondition(0, cf_static, "Is Named", "Name", "{my} is named {0}", "Pick instances by their name.", "PickByName");

AddStringParam("Tag", "A tag to look for");
AddCondition(1, cf_static, "Has Tag", "Tag", "{my} has tag {0}", "Pick all instances that contain the given tag.", "PickByTag");

AddStringParam("Tag", "The tag that has been added.");
AddCondition(2, cf_trigger, "On tagged", "Tag triggers", "{my} has been tagged with <b>{0}</b>", "Triggered when the given tag is added", "OnTagged");

AddStringParam("Tag", "The tag that has been removed.");
AddCondition(3, cf_trigger, "On un-tagged", "Tag triggers", "{my} tag <b>{0}</b> has been removed", "Triggered when the given tag is removed", "OnUnTagged");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely Identity this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
// AddAction(0, af_none, "Stop", "My category", "Stop {my}", "Description for my action!", "Stop");
AddStringParam("Name", "The name this instance will have. We recomend it to be unique, though, it's not mandatory.");
AddAction(0, af_none, "Set Name", "Name", "Set {my} name to {0}", "Sets this instance name", "SetName");

AddStringParam("Tag", "The tag name to add");
AddAction(1, af_none, "Add Tag", "Tags", "Add {0} tag to {my}", "Adds a tag to this instance", "AddTag");

AddStringParam("Tag", "The tag name to remove");
AddAction(2, af_none, "Remove Tag", "Tags", "Remove {0} tag from {my}", "Removes a tag from this instance", "RemoveTag");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely Identity this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_string, "Name", "Name", "Name", "Return the name given to this instance.");

AddStringParam("Tag", "The tag name to find");	// a string
AddExpression(1, ef_return_number, "Has tag", "Tags", "HasTag", "Returns 1 if this instance has the given tag, 0 otherwise");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	new cr.Property(ept_text, 	"Name",		"",		"A name for this object."),
	new cr.Property(ept_text, 	"Tags",		"",		"A list of tags. Separate separator"),
	new cr.Property(ept_text, 	"Tags separator",		",",		"The separator for this object's tags.")
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of the behavior in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
