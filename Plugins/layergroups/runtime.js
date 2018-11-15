﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.LayerGroups = function (runtime) {
    this.runtime = runtime;
};

(function () {
    /////////////////////////////////////
    // *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
    //                            vvvvvvvv
    var pluginProto = cr.plugins_.LayerGroups.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function (plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;
    var runtimeCollisionCandidates;

    // called on startup for each object type
    typeProto.onCreate = function () {
        var self = this;
        runtimeCollisionCandidates = this.runtime.getCollisionCandidates;
        this.runtime.getCollisionCandidates = function (layer, rtype, bbox, candidates) {
            var result = runtimeCollisionCandidates.call(this, layer, rtype, bbox, candidates);

            if (candidates.length === 0) {
                return result;
            }

            var inst = self.instances[0];
            if (inst && layer && layer.name) {
                var groupName = inst.groupsByLayer[layer.name];
                var group = inst.groups[groupName];
                if (group) {
                    var nonBelonging = candidates.filter(c => !group.has(c.layer.name));
                    for (var index in nonBelonging) {
                        var candidate = nonBelonging[index];
                        var candidateIndex = candidates.indexOf(candidate);
                        if (candidateIndex > -1) {
                            candidates.splice(candidateIndex, 1);
                        }
                    }
                }
            }
            return result;
        };
    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function (type) {
        this.type = type;
        this.runtime = type.runtime;

        // any other properties you need, e.g...
        // this.myValue = 0;
        this.groups = {};
        this.groupsByLayer = {};
    };

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function () {
        // note the object is sealed after this call; ensure any properties you'll ever need are set on the object
        // e.g...
        // this.myValue = 0;
    };

    // called whenever an instance is destroyed
    // note the runtime may keep the object after this call for recycling; be sure
    // to release/recycle/reset any references to other objects in this function.
    instanceProto.onDestroy = function () {
    };

    // called when saving the full state of the game
    instanceProto.saveToJSON = function () {
        // return a Javascript object containing information about your object's state
        // note you MUST use double-quote syntax (e.g. "property": value) to prevent
        // Closure Compiler renaming and breaking the save format
        for (var key in this.groups) {
            storedGroups[key] = Array.from(this.groups[key]);
        }

        return {
            "g": storedGroups,
            "gl": this.groupsByLayer
        };
    };

    // called when loading the full state of the game
    instanceProto.loadFromJSON = function (o) {
        // load from the state previously saved by saveToJSON
        // 'o' provides the same object that you saved, e.g.
        // this.myValue = o["myValue"];
        // note you MUST use double-quote syntax (e.g. o["property"]) to prevent
        // Closure Compiler renaming and breaking the save format
        if (!o) {
            return;
        }

        this.groups = {};
        var storedGroups = o["g"];
        if (storedGroups) {
            for (var key in storedGroups) {
                this.groups[key] = new Set(storedGroups[key]);
            }
        }

        this.groupsByLayer = o["gl"] || {};
    };

    // only called if a layout object - draw to a canvas 2D context
    instanceProto.draw = function (ctx) {
    };

    // only called if a layout object in WebGL mode - draw to the WebGL context
    // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
    // directory or just copy what other plugins do.
    instanceProto.drawGL = function (glw) {
    };

    // The comments around these functions ensure they are removed when exporting, since the
    // debugger code is no longer relevant after publishing.
    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function (propsections) {
        // Append to propsections any debugger sections you want to appear.
        // Each section is an object with two members: "title" and "properties".
        // "properties" is an array of individual debugger properties to display
        // with their name and value, and some other optional settings.
        propsections.push({
            "title": "Layer Groups",
            "properties":
                // Each property entry can use the following values:
                // "name" (required): name of the property (must be unique within this section)
                // "value" (required): a boolean, number or string for the value
                // "html" (optional, default false): set to true to interpret the name and value
                //                                   as HTML strings rather than simple plain text
                // "readonly" (optional, default false): set to true to disable editing the property

                // Example:
                // {"name": "My property", "value": this.myValue}
                $.map(this.groups, (group, name) => {
                    return { "name": name, "value": Array.from(group).join(';'), "readonly": true };
                })
        });
    };

    instanceProto.onDebugValueEdited = function (header, name, value) {
        // Called when a non-readonly property has been edited in the debugger. Usually you only
        // will need 'name' (the property name) and 'value', but you can also use 'header' (the
        // header title for the section) to distinguish properties with the same name.
        if (name === "My property")
            this.myProperty = value;
    };
    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() { };

    // the example condition
    /*Cnds.prototype.MyCondition = function (myparam)
    {
        // return true if number is positive
        return myparam >= 0;
    };*/

    // ... other conditions here ...

    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() { };

    // the example action
    Acts.prototype.AddLayerToGroup = function (layer, group) {
        var layerName = layer.name;

        if (!this.groups[group]) {
            this.groups[group] = new Set();
        }

        this.groups[group].add(layerName);

        this.groupsByLayer[layerName] = group;
    };

    instanceProto.PerformOperationOnLayersOfGroup = function (groupName, action) {
        var group = this.groups[groupName];

        if (!group) {
            console.warn("Group '" + groupName + "' does not exist");
            return;
        }

        var layers = Array.from(group);

        for (var layerIndex in layers) {
            var layerName = layers[layerIndex];

            var layer = this.runtime.getLayerByName(layerName);
            if (layer) {
                action(layer);
            }
        }
    };

    var propertyHandles = [
        (layer, value) => layer.angle = value,
        (layer, value) => layer.opacity = value / 100,
        (layer, value) => layer.parallaxX = value / 100,
        (layer, value) => layer.parallaxY = value / 100,
        (layer, value) => layer.scale = value / 100
    ];

    // this.runtime.getLayerByName("F1_Background")
    Acts.prototype.SetPropertyForGroup = function (groupName, prop, value) {
        this.PerformOperationOnLayersOfGroup(groupName, layer => propertyHandles[prop](layer, value));
    };

    var visibilityHandles = [
        layer => layer.visible = true,
        layer => layer.visible = false,
        layer => layer.visible = !layer.visible
    ];

    Acts.prototype.SetVisibilityForGroup = function (groupName, visibility) {
        this.PerformOperationOnLayersOfGroup(groupName, visibilityHandles[visibility]);
    };
    // ... other actions here ...

    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() { }

    // the example expression
    /*Exps.prototype.MyExpression = function (ret)    // 'ret' must always be the first parameter - always return the expression's result through it!
    {
        ret.set_int(1337);              // return our value
        // ret.set_float(0.5);          // for returning floats
        // ret.set_string("Hello");     // for ef_return_string
        // ret.set_any("woo");          // for ef_return_any, accepts either a number or string
    };*/
    Exps.prototype.GroupOfLayer = function (ret, layerNameOrNumber) {
        var layer = this.runtime.getLayerByName(layerNameOrNumber) || this.runtime.getLayerByNumber(layerNameOrNumber);
        if (!layer) {
            console.log("Layer '" + layerNameOrNumber + "' does not exist.");
            ret.set_string('');
        } else {
            ret.set_string(this.groupsByLayer[layer.name]);
        }
    };

    // ... other expressions here ...

    pluginProto.exps = new Exps();

}());