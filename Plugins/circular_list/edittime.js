function GetPluginSettings()
{
    return {
        "name":         "Circular List",                // as appears in 'insert object' dialog, can be changed as long as "id" stays the same
        "id":           "circular_list",                // this is used to identify this plugin and is saved to the project; never change it
        "version":      "1.0",                  // (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
        "description":  "Implementation of a circular list data structure",
        "author":       "JeyDotC",
        "help url":     " ",
        "category":     "Data & Storage",               // Prefer to re-use existing categories, but you can set anything here
        "type":         "object",               // either "world" (appears in layout and is drawn), else "object"
        "rotatable":    false,                  // only used when "type" is "world".  Enables an angle property on the object.
        "flags":        0                       // uncomment lines to enable flags...
                    //  | pf_singleglobal       // exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
                    //  | pf_texture            // object has a single texture (e.g. tiled background)
                    //  | pf_position_aces      // compare/set/get x, y...
                    //  | pf_size_aces          // compare/set/get width, height...
                    //  | pf_angle_aces         // compare/set/get angle (recommended that "rotatable" be set to true)
                    //  | pf_appearance_aces    // compare/set/get visible, opacity...
                    //  | pf_tiling             // adjusts image editor features to better suit tiled images (e.g. tiled background)
                    //  | pf_animations         // enables the animations system.  See 'Sprite' for usage
                    //  | pf_zorder_aces        // move to top, bottom, layer...
                    //  | pf_nosize             // prevent resizing in the editor
                    //  | pf_effects            // allow WebGL shader effects to be added
                    //  | pf_predraw            // set for any plugin which draws and is not a sprite (i.e. does not simply draw
                                                // a single non-tiling image the size of the object) - required for effects to work properly
    };
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])          // a number
// AddStringParam(label, description [, initial_string = "\"\""])       // a string
// AddAnyTypeParam(label, description [, initial_string = "0"])         // accepts either a number or string
// AddCmpParam(label, description)                                      // combo with equal, not equal, less, etc.
// AddComboParamOption(text)                                            // (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])          // a dropdown list parameter
// AddObjectParam(label, description)                                   // a button to click and pick an object type
// AddLayerParam(label, description)                                    // accepts either a layer number or name (string)
// AddLayoutParam(label, description)                                   // a dropdown list with all project layouts
// AddKeybParam(label, description)                                     // a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)                                // a string intended to specify an animation name
// AddAudioFileParam(label, description)                                // a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,                 // any positive integer to uniquely identify this condition
//              flags,              // (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//                                  // cf_deprecated, cf_incompatible_with_triggers, cf_looping
//              list_name,          // appears in event wizard list
//              category,           // category in event wizard list
//              display_str,        // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//              description,        // appears in event wizard dialog when selected
//              script_name);       // corresponding runtime function name
                
// example              
AddCondition(0, cf_none, "Is empty", "General", "Is empty", "Check if the list is empty", "IsEmpty");

AddCmpParam("Comaprison", "How to compare the count to");
AddNumberParam("Number", "Number to compare the count to");
AddCondition(1, cf_none, "Compare count", "General", "Compare <b>count</b> {0} <i>{1}</i>", "Compare a number with the count of the list", "CompareCount");

AddCmpParam("Comaprison", "How to compare the current element to");
AddAnyTypeParam("Element", "Value to compare the current to");
AddCondition(2, cf_none, "Compare current", "Cursor", "Compare <b>current value</b> {0} <i>{1}</i>", "Compare a value with the current of the list", "CompareCurrent");

AddAnyTypeParam("Element", "Value to find out");
AddCondition(3, cf_none, "Contains", "General", "Check if <i>{0}</i> is in the list", "Checks if an element is in the list", "Contains");

////////////////////////////////////////
// Actions

// AddAction(id,                // any positive integer to uniquely identify this action
//           flags,             // (see docs) af_none, af_deprecated
//           list_name,         // appears in event wizard list
//           category,          // category in event wizard list
//           display_str,       // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//           description,       // appears in event wizard dialog when selected
//           script_name);      // corresponding runtime function name

// example
AddNumberParam("Width", "The new number of elements on list.", "1");
AddAction(0, af_none, "Set size", "Circular list", "Set size to (<i>{0}</i>)", "Set the number of elements in the list.", "SetSize");

AddAction(1, af_none, "Next", "Cursor", "Move the cursor to next element.", "Moves the cursor to the next element in the list. If it gets to the end, it will start again from index 0", "CursorNext");
AddAction(2, af_none, "Previous", "Cursor", "Move the cursor to previous element.", "Moves the cursor to the previous element in the list. If it gets to the beginning, it will start again from the last element.", "CursorPrevious");

AddNumberParam("Index", "The index at where to put the cursor.", "0");
AddAction(3, af_none, "Put cursor at", "Cursor", "Put the cursor at <i>{0}</i>.", "Moves the cursor to the given index.", "CursorAt");

AddAnyTypeParam("Value", "The value to look for.", "0");
AddAction(4, af_none, "Put cursor at the value", "Cursor", "Put the cursor at the index of <i>{0}</i>.", "Tries to move the cursor to the index of the given value.", "CursorAtValue");

AddNumberParam("Index", "The index (0-based) of the list value to set.", "0");
AddAnyTypeParam("Value", "The value to store in the list.", "0");
AddAction(5, af_none, "Set value at Index", "Manipulation", "Set value at <i>{0}</i> to <i>{1}</i>", "Set the value at a position in the list.", "SetValue");

AddComboParamOption("back");
AddComboParamOption("front");
AddComboParam("Where", "Whether to insert at the beginning or the end of the list.");
AddAnyTypeParam("Value", "The value to insert to the list.", "0");
AddAction(6, af_none, "Push", "Manipulation", "Push {0} <i>{1}</i>", "Add a new element to the front or back of the list.", "Push");

AddComboParamOption("back");
AddComboParamOption("front");
AddComboParam("Where", "Whether to remove at the beginning or the end of the list.");
AddAction(7, af_none, "Pop", "Manipulation", "Pop {0}", "Remove an element from the front or back of the list.", "Pop");

AddAction(8, af_none, "Clear", "General", "Clear", "Clears the list", "Clear");

AddAction(9, af_none, "Sort", "Manipulation", "Sort", "Sorts the list", "Sort");

AddComboParamOption("Do not allow repeated values");
AddComboParamOption("Allow repeated values");
AddComboParam("Distinct", "Whether to allow repeated values or not.");
AddAction(10, af_none, "Distinct", "General", "{0}", "Allow/disallow repeated values in the list.", "SetDistinct");

AddAction(11, af_none, "Remove Current", "Manipulation", "Remove Current Element", "Removes the element at the current index", "RemoveCurrent");
////////////////////////////////////////
// Expressions

// AddExpression(id,            // any positive integer to uniquely identify this expression
//               flags,         // (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//                              // ef_return_any, ef_variadic_parameters (one return flag must be specified)
//               list_name,     // currently ignored, but set as if appeared in event wizard
//               category,      // category in expressions panel
//               exp_name,      // the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//               description);  // description in expressions panel

// example
AddExpression(0, ef_return_any, "Get value at cursor", "Cursor", "Current", "Get the current value from the list.");

AddExpression(1, ef_return_any, "Peek Next", "Cursor", "PeekNext", "Peeks the next element in the list. (Without moving the cursor.)");
AddExpression(2, ef_return_any, "Peek Previous", "Cursor", "PeekPrevious", "Peeks the previous element in the list. (Without moving the cursor.)");

AddExpression(3, ef_return_number, "Get size", "Circular list", "Size", "Get the number of elements of the list.");

AddExpression(4, ef_return_any, "Front value", "Circular list", "Front", "Get the front value on the list.");
AddExpression(5, ef_return_any, "Back value", "Circular list", "Back", "Get the back value on the list.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,  name,   initial_value,  description)        // an integer value
// new cr.Property(ept_float,    name,   initial_value,  description)        // a float value
// new cr.Property(ept_text,     name,   initial_value,  description)        // a string
// new cr.Property(ept_color,    name,   initial_value,  description)        // a color dropdown
// new cr.Property(ept_font,     name,   "Arial,-16",    description)        // a font with the given face name and size
// new cr.Property(ept_combo,    name,   "Item 1",       description, "Item 1|Item 2|Item 3")    // a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,     name,   link_text,      description, "currentonly")     // has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
    new cr.Property(ept_integer, "Width",            10,         "Initial number of elements on the list."),
    new cr.Property(ept_combo,   "Distinct Values",  "No",       "Allow unique values only (repeated values will be ignored).", "No|Yes"),
];
    
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
    return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
    return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
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
        
    // Plugin-specific variables
    // this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the current time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
    if (this.properties["Width"] < 0)
        this.properties["Width"] = 0;
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}