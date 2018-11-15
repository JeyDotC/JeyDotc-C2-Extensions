function GetPluginSettings()
{
    return {
        "name":         "Layer Groups",             // as appears in 'insert object' dialog, can be changed as long as "id" stays the same
        "id":           "LayerGroups",              // this is used to identify this plugin and is saved to the project; never change it
        "version":      "1.0",                  // (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
        "description":  "Allows to create groups layers with these benefits: 1. Collisions for layers in a group will be completely isolated from the ones of other groups. 2. You will be able to perform operations on groups of layers, allowing to change properties like opacity or visibility of all layers in a group at once.",
        "author":       "Jeysson Guevara (JeyDotC)",
        "help url":     "<your website or a manual entry on Scirra.com>",
        "category":     "General",              // Prefer to re-use existing categories, but you can set anything here
        "type":         "object",               // either "world" (appears in layout and is drawn), else "object"
        "rotatable":    true,                   // only used when "type" is "world".  Enables an angle property on the object.
        "flags":        0                       // uncomment lines to enable flags...
                        | pf_singleglobal       // exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
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
AddLayerParam("Layer", "Layer to add.");
AddStringParam("Group", "Group name to add the layer into.");
AddAction(0, af_none, "Add layer to group", "Grouping", "Add layer <i>{0}</i> to group <i>{1}</i>.", "Add a layer to the a group", "AddLayerToGroup");

/*
ABSOLUTELY ALL LAYER PROPERTIES!
 active_effect_types: []
background_color: (3) [255, 255, 255]
blend_mode: 0
clear_earlyz_index: 0
compositeOp: "source-over"
created_globals: []
cur_render_cells: Rect {left: 0, top: 0, right: -1, bottom: -1}
destBlend: 771
disableAngle: false
effect_fallback: 0
effect_params: []
effect_types: []
forceOwnTexture: false
index: 0
initial_instances: [Array(6)]
instances: [p…o.Instance]
last_render_cells: Rect {left: 0, top: 0, right: -1, bottom: -1}
last_render_list: []
layout: Layout {runtime: Runtime, event_sheet: EventSheet, scrollX: 427.02050663449944, scrollY: 240.00000000000003, scale: 1, …}
name: "F1_Background"
number: 0
rcTex: Rect {left: 0, top: 0, right: 1, bottom: 1}
rcTex2: Rect {left: 0, top: 0, right: 1, bottom: 1}
render_grid: null
render_list_stale: true
render_offscreen: true
runtime: Runtime {isCrosswalk: false, isCordova: false, isPhoneGap: false, isDirectCanvas: false, isAppMobi: false, …}
shaders_preserve_opaqueness: true
sid: 8722530541249526
srcBlend: 1
startup_initial_instances: [Array(6)]
tmpquad: Quad {tlx: 283.13126258074647, tly: 399.7289096823208, trx: -488.6589439388995, try_: 34.04334876160223, brx: -283.13126258074647, …}
tmprect: Rect {left: -61.63843730440004, top: -159.7289096823208, right: 915.679450573399, bottom: 639.7289096823208}
transparent: false
useRenderCells: false
viewBottom: 639.7289096823208
viewLeft: -61.63843730440004
viewRight: 915.679450573399
viewTop: -159.7289096823208
zindices_stale: false
zindices_stale_from: -1
zoomRate: 1
 */
// angle: 35
// opacity: 0.5
// parallaxX: 1
// parallaxY: 1
// scale: 1
// visible: true
AddStringParam("Group", "The group of layers you want to modify.");
AddComboParamOption("Angle");
AddComboParamOption("Opacity");
AddComboParamOption("Parallax X");
AddComboParamOption("Parallax Y");
AddComboParamOption("Scale");
AddComboParam("Property", "The property you want to change", "Angle");
AddNumberParam("Value", "The new value for the property");
AddAction(1, af_none, "Modify group property", "Layer modification", "Set <b>{1}</b> to <i>{2}</i> for all layers in group <i>{0}</i>.", "Alter the selected property for all layers under a group.", "SetPropertyForGroup");

AddStringParam("Group", "The group of layers you want to modify.");
AddComboParamOption("Visible");
AddComboParamOption("Invisible");
AddComboParamOption("Toggle");
AddComboParam("Visibility", "The new visibility of the layers under the group");
AddAction(2, af_none, "Set group visible", "Layer modification", "Set all layers in group <b>{0}</b> <i>{1}</i>.", "Change visibility of all layer under a group.", "SetVisibilityForGroup");

////////////////////////////////////////
// Expressions

// AddExpression(id,            // any positive integer to uniquely identify this expression
//               flags,         // (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//                              // ef_return_any, ef_variadic_parameters (one return flag must be specified)
//               list_name,     // currently ignored, but set as if appeared in event wizard
//               category,      // category in expressions panel
//               exp_name,      // the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//               description);  // description in expressions panel
AddLayerParam("Layer", "The layer for which you want to get the group.");
AddExpression(0, ef_return_string, "Get group of layer", "Group", "GroupOfLayer", "The group this layer belongs to");


////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,     name,   initial_value,  description)        // an integer value
// new cr.Property(ept_float,       name,   initial_value,  description)        // a float value
// new cr.Property(ept_text,        name,   initial_value,  description)        // a string
// new cr.Property(ept_color,       name,   initial_value,  description)        // a color dropdown
// new cr.Property(ept_font,        name,   "Arial,-16",    description)        // a font with the given face name and size
// new cr.Property(ept_combo,       name,   "Item 1",       description, "Item 1|Item 2|Item 3")    // a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,        name,   link_text,      description, "firstonly")       // has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [];
    
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

// Called when inserted via Insert Object Dialog for the first time
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