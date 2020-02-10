// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.circular_list = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    /////////////////////////////////////
    // *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
    //                            vvvvvvvv
    var pluginProto = cr.plugins_.circular_list.prototype;
        
    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function()
    {
    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type)
    {
        this.type = type;
        this.runtime = type.runtime;
        
        // any other properties you need, e.g...
        // this.myValue = 0;
    };
    
    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function()
    {
        var width = this.properties[0];
        
        this.distinct = (this.properties[1] !== 0);
        this.current = 0;
        this.list = [];
        
        this.list.length = width;
        for (var index = 0; index < width; index++)
        {
            if (cr.is_undefined(this.list[index]))
                this.list[index] = 0;
        }
    };
    
    instanceProto.nextPosition = function(){
        var next = this.current + 1;
        
        if(next < this.list.length){
            return next;
        }
        
        return 0;
    };
    
    instanceProto.previousPosition = function(){
        var previous = this.current - 1;
        
        if(previous >= 0){
            return previous;
        }else if(this.list.length > 0) {
            return this.list.length - 1;
        }
        
        return 0;
    };
    
    instanceProto.onDestroy = function ()
    {
        this.current = 0;
        cr.clearArray(this.list);
    };
    
    // only called if a layout object - draw to a canvas 2D context
    instanceProto.draw = function(ctx)
    {
    };
    
    // only called if a layout object in WebGL mode - draw to the WebGL context
    // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
    // directory or just copy what other plugins do.
    instanceProto.drawGL = function (glw)
    {
    };
    
    instanceProto.saveToJSON = function ()
    {
        return {
            "d": this.distinct,
            "c": this.current,
            "l": this.list
        };
    };
    
    instanceProto.loadFromJSON = function (o)
    {
        this.distinct = o["d"];
        this.current = o["c"];
        this.list = o["l"];
    };
    
    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function (propsections)
    {
        propsections.push({
            "title": this.type.name,
            "properties": [
                {"name": "Current", "value": this.current},
                {"name": "Distinct", "value": this.distinct},
                {"name": "Data", "value": JSON.stringify(this.list)}
            ]
        });
    };

    instanceProto.onDebugValueEdited = function (header, name, value)
    {
        if (name === "Current")
            this.current = value;
        
        if (name === "Distinct")
            this.distinct = !!value;
        
        if (name === "Data")
            this.list = value.split(',');
    };
    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {};

    // the example condition
    Cnds.prototype.IsEmpty = function ()
    {
        return (this.list.length == 0);
    };

    Cnds.prototype.CompareCount = function (cmp, val)
    {
        return cr.do_cmp(this.list.length, cmp, val);
    };

    Cnds.prototype.CompareCurrent = function (cmp, val)
    {
        return cr.do_cmp(this.list[this.current], cmp, val);
    };

    Cnds.prototype.Contains = function(val){
        return contains(this.list, val);
    };

    // ... other conditions here ...
    
    pluginProto.cnds = new Cnds();
    
    //////////////////////////////////////
    // Actions
    function Acts() {};

    // the example action
    Acts.prototype.SetSize = function (width)
    {
        if(width < 0){
            width = 0;
        }
        
        if(this.list.length === width){
            return;
        }
        
        this.list.length = width;
        
        for (var index = 0; index < width; index++)
        {
            if (cr.is_undefined(this.list[index]))
                this.list[index] = 0;
        }
        
        if(this.current >= width){
            if(width > 0)
                this.current = width - 1;
            else
                this.current = 0;
        }
    };
    
    Acts.prototype.CursorNext = function ()
    {
        this.current = this.nextPosition();
    };
    
    Acts.prototype.CursorPrevious = function ()
    {
        this.current = this.previousPosition();
    };
    
    Acts.prototype.CursorAt = function (index)
    {
        if(index < 0){
            console.warning("Trying to move the cursor to a less than 0 index.");
            return;
        }
        
        if(index >= this.list.length){
            console.warning("Trying to move the cursor beyond list size.");
            return;
        }
        
        this.current = index;
    };
    
    Acts.prototype.CursorAtValue = function (value)
    {
        for (var index = 0; index < this.list.length; index++){
            if(this.list[index] === value){
                this.current = index;
                return;
            }
        }
    };
    
    Acts.prototype.SetValue = function (index, value)
    {
        index = Math.floor(index);
        
        if (isNaN(index) || index < 0 || index >= this.list.length)
            return;
        
        if (this.distinct && contains(this.list, value))
            return;

        this.list[index] = value;
    };
    
    Acts.prototype.Push = function (where, value)
    {
        if (this.distinct && contains(this.list, value))
            return;
        
        if (where === 0)	// back
        {
            this.list.push(value);
        }
        else				// front
        {
            this.list.unshift(value);
        }
    };
    
    Acts.prototype.Pop = function (where)
    {
        if (where === 0)	// back
        {
            this.list.pop();
        }
        else				// front
        {
            this.list.shift();
        }
    };
    
    Acts.prototype.Clear = function ()
    {
        this.current = 0;
        this.list = [];
    };
    
    Acts.prototype.SetDistinct = function (allowRepeated)
    {
        this.distinct = allowRepeated === 0;
        
        var previousList = this.list;
        
        this.list = [];
        
        for (var index in previousList){
            this.Push(previousList[index]);
        }
        
        if(this.current >= this.list.length){
            if(this.list.length > 0){
                this.current = this.list.length - 1;
            }else
            {
                this.current = 0;
            }
        }
    };

    Acts.prototype.RemoveCurrent = function ()
    {
        if (this.list.length > 0) {
            this.list = this.list.splice(this.current, 1);
            if (this.current >= this.list.length){
                this.current = this.list.length - 1;
                if (this.current < 0) {
                    this.current = 0;
                }
            }
        }
    };
    
    function compareValues(va, vb)
    {
        // Both numbers: compare as numbers
        if (cr.is_number(va) && cr.is_number(vb))
            return va - vb;
        // Either is a string: compare as strings
        else
        {
            var sa = "" + va;
            var sb = "" + vb;
            
            if (sa < sb)
                return -1;
            else if (sa > sb)
                return 1;
            else
                return 0;
        }
    };
    
    function contains(array, value){
        for(var index in array)
        {
            var arrayValue = array[index];
            if(compareValues(arrayValue, value) === 0)
                return true;
        }
        
        return false;
    };
    
    Acts.prototype.Sort = function ()
    {
        this.list.sort(compareValues);
    };
    
    // ... other actions here ...
    
    pluginProto.acts = new Acts();
    
    //////////////////////////////////////
    // Expressions
    function Exps() {};
    
    // the example expression
    Exps.prototype.Current = function (ret)
    {
        ret.set_any(this.list[this.current]);
    };
    
    Exps.prototype.PeekNext = function (ret)
    {
        ret.set_any(this.list[this.nextPosition()]);
    };
    
    Exps.prototype.PeekPrevious = function (ret)
    {
        ret.set_any(this.list[this.previousPosition()]);
    };

    Exps.prototype.Size = function (ret)
    {
        ret.set_int(this.list.length);
    };

    Exps.prototype.Front = function (ret)
    {
        ret.set_any(this.list[0]);
    };

    Exps.prototype.Back = function (ret)
    {
        ret.set_any(this.list[this.list.length - 1]);
    };
    
    // ... other expressions here ...
    
    pluginProto.exps = new Exps();

}());