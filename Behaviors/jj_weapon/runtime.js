// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.jj_Weapon = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.jj_Weapon.prototype;
		
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
		
		// Key states
		this.shootkey = false;
		this.reloadkey = false;
		
		// Simulated key states
		this.simshoot = false;
		this.simreload = false;
		
		// Bullets
		this.bullets_count = 0;
        this.max_bullets_count = 0;
		this.clip_bullets_count = 0;
		this.clip_size = 0;
        this.enabled = true;
        this.reload = false;
        this.ready = true;
        
        // Time durations
        this.interval = 0;
        this.reload_time = 0;

        // Weapon features
        this.auto_reload = true;
        this.user_control = 'None';
        this.shoot_keycode = 32;
        this.reload_keycode = 0;
        this.bullet_instance = null;

        // trigger events
        this.was_shoot = false;
        this.was_reload_start = false;
        this.was_reload_finish = false;
		
        // last times
        this.last_shoot_time = 0;
        this.start_reload_time = 0;

        // runtime upgrade...
        var runtimeProto = this.runtime.__proto__;

/* //turn off, because "Bullet classname" property was unset...

        runtimeProto.getTypeByName = function (type_name) {
            for (var i = 0; i < this.types_by_index.length; i++) {
                if (this.types_by_index[i].name === type_name) return this.types_by_index[i];
            }

            return null;
        };

        runtimeProto.getType = function (t)	{
            if (cr.is_number(t)) {
                if (t < 0 || t >= this.types_by_index.length) return null;
                return this.types_by_index[t];
            } else {
                return this.getTypeByName(t.toString());
            }
        };
*/

        runtimeProto.spawnInstance = function (type, layer, coord, angle) {
//            if (typeof type == 'string') type = this.getType(type);
            var inst = this.createInstance(type, this.getLayer(layer), coord.x, coord.y);
            inst.angle = angle;
            inst.set_bbox_changed();
            return inst;
        }
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.clip_size = this.properties[0];
        this.clip_bullets_count = this.properties[1];
		this.bullets_count = this.properties[2];
        this.max_bullets_count = this.properties[3];
		this.interval = this.properties[4];
		this.reload_time = this.properties[5];
		this.auto_reload = (this.properties[6] === 1);    // 0=no, 1=yes
		this.user_control = (this.properties[7] === 0 ? 'None' : (this.properties[5] === 1 ? 'Single' : 'Burst')); // 0=auto, 1=mouse, 2=user
		this.enabled = (this.properties[8] === 1);	// 0=no, 1=yes
		this.shoot_keycode = cr.keyCode(this.properties[9]);
		this.reload_keycode = cr.keyCode(this.properties[10]);
        this.bullet_point_index = parseInt(this.properties[11], 10);

		// Only bind keyboard events via jQuery if default controls are in use
		jQuery(document).keydown(
			(function (self) {
				return function(info) {
					self.onKeyDown(info);
				};
			})(this)
		);
		
		jQuery(document).keyup(
			(function (self) {
				return function(info) {
					self.onKeyUp(info);
				};
			})(this)
		);
	};

	behinstProto.saveToJSON = function ()
	{
		var o = {
		// Key states
		"shk": this.shootkey,
		"rlk": this.reloadkey,
		
		// Simulated key states
		"ssh": this.simshoot,
		"srl": this.simreload,
		
		// Bullets
		"bc": this.bullets_count,
        "mbc": this.max_bullets_count,
		"cbc": this.clip_bullets_count,
		"cs": this.clip_size,
        "e": this.enabled,
        "rl": this.reload,
        "rd": this.ready,
        
        // Time durations
        "in": this.interval,
        "rt": this.reload_time,

        // Weapon features
        "arl": this.auto_reload,
        "uc": this.user_control,
        "skc": this.shoot_keycode,
        "rlkc": this.reload_keycode
		};

		if(this.bullet_instance)
		{
			o["bins"] = this.bullet_instance.sid;
		}

		return o;
	};

	behinstProto.loadFromJSON = function (o)
	{
		// Key states
		this.shootkey = o["shk"];
		this.reloadkey = o["rlk"];
		
		// Simulated key states
		this.simshoot = o["ssh"];
		this.simreload = o["srl"];
		
		// Bullets
		this.bullets_count = o["bc"];
        this.max_bullets_count = o["mbc"];
		this.clip_bullets_count = o["cbc"];
		this.clip_size = o["cs"];
        this.enabled = o["e"];
        this.reload = o["rl"];
        this.ready = o["rd"];
        
        // Time durations
        this.interval = o["in"];
        this.reload_time = o["rt"];

        // Weapon features
        this.auto_reload = o["arl"];
        this.user_control = o["uc"];
        this.shoot_keycode = o["skc"];
        this.reload_keycode = o["rlkc"];

		if(o.hasOwnProperty("bins"))
		{
			this.bullet_instance = this.runtime.getObjectTypeBySid(o["bins"]);
		}		
	};

	behinstProto.onKeyDown = function (info) {	
		switch (info.which) {
    		case this.shoot_keycode:	// shoot
    			info.preventDefault();
    			this.shootkey = true;
    			break;
    		case this.reload_keycode:	// reload
    			info.preventDefault();
    			this.reloadkey = true;
    			break;
		}
	};

	behinstProto.onKeyUp = function (info)
	{
		switch (info.which) {
    		case this.shoot_keycode:	// shoot
    			info.preventDefault();
    			this.shootkey = false;
    			break;
    		case this.reload_keycode:	// reload
    			info.preventDefault();
    			this.reloadkey = false;
    			break;
		}
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		var shoot = this.shootkey && this.user_control != 'None' || this.simshoot;
		var reload = this.reloadkey && this.user_control != 'None' || this.simreload;
		this.simshoot = false;
		this.simreload = false;
        this.reloadkey = false;
        if (this.user_control == 'Single') {
            this.shootkey = false;
        }

        if (!this.reload && (this.auto_reload && this.clip_bullets_count == 0 || reload) && this.bullets_count != 0 && (this.clip_size == -1 || this.clip_bullets_count < this.clip_size) && this.clip_bullets_count != -1) {
            // reload start
            this.start_reload_time = Date.now();
            this.reload = true;
            this.was_reload_start = true;
            this.runtime.trigger(this.behavior.cnds.isReloadStart, this.inst);
        }

        if (this.reload && Date.now() - this.start_reload_time >= this.reload_time && this.clip_size != 0 && this.clip_bullets_count != -1 && this.bullets_count != 0) {
            // reload end
            this.reload = false;
            var count;
            if (this.clip_size == -1) { // if clip is infinity we push all our bullets in clip
                count = this.bullets_count;
            } else {    // if clip is not infinity...
                count = this.clip_size - this.clip_bullets_count; // calc how we can put bullets in clip
                if (this.bullets_count != -1) {                     // if we have not infinity bullets then...
                    count = Math.min(count, this.bullets_count);   // take not more than we have
                }
            }
//            this.behavior.acts.addClipBullets.call(this, count);
            if (count == -1) { // we can put in clip infinity count of bullets
                this.clip_bullets_count = -1;
            } else { // else we take from one and give to a clip our bullets
                this.bullets_count = this.bullets_count == -1 ? -1 : this.bullets_count - count;
                this.clip_bullets_count += count;
            }
            this.was_reload_finish = true;
            this.runtime.trigger(this.behavior.cnds.isReloadFinish, this.inst);
        }
        
        if (!this.ready && !this.reload && this.enabled && (Date.now() - this.last_shoot_time >= this.interval)) {
            this.ready = true;
        }
        
        if (shoot && this.ready && !this.reload && this.clip_bullets_count != 0 && this.enabled) {
            var plugin = this.type.objtype.instances[0];
            assert2(plugin.getImagePoint, "Weapon behavior can only be added to the Sprite or another plugin that has a method \"getImagePoint\"");
            var image_point = {
                x: plugin.getImagePoint.call(this.inst, this.bullet_point_index, true),
                y: plugin.getImagePoint.call(this.inst, this.bullet_point_index, false)
            }
            assert2(this.bullet_instance, "You don't set a Bullet instance to Weapon. Use \"Weapon -> set bullet instance\" action! ");

            var inst = this.runtime.spawnInstance(this.bullet_instance, this.inst.layer.index, image_point, this.inst.angle);
			this.runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);

            this.ready = false;
            this.last_shoot_time = Date.now();
            if (this.clip_bullets_count != -1) {
                this.clip_bullets_count -= 1;
            }

            this.was_shoot = true;
            this.runtime.trigger(this.behavior.cnds.wasShoot, this.inst);
        }
	};

	//////////////////////////////////////
	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	cnds.isReady = function () {
		return this.ready;
	};
    
    cnds.bulletsInClip = function (cmp, count) {
        return cr.do_cmp(this.clip_bullets_count, cmp, count);
    }
	
	cnds.isReloadStart = function () {
        var was_reload_start = this.was_reload_start;
        this.was_reload_start = false;
        return was_reload_start;
	};

	cnds.isReloadFinish = function () {
        var was_reload_finish = this.was_reload_finish;
        this.was_reload_finish = false;
        return was_reload_finish;
	};

	cnds.wasShoot = function () {
        var was_shoot = this.was_shoot;
        this.was_shoot = false;
        return was_shoot;
	};
    
	cnds.isDisabled = function () {
		return !this.enabled;
	};
    
	cnds.isEnabled = function () {
		return this.enabled;
	};
    
	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	acts.makeShoot = function () {
		this.simshoot = true;
	};

	acts.addClipBullets = function (count) {
        if (this.clip_bullets_count == -1) return;

		this.clip_bullets_count += parseInt(count, 10);
        if (this.clip_bullets_count > this.clip_size) {
            this.bullets_count += this.clip_size - this.clip_bullets_count;
            this.clip_bullets_count = this.clip_size;
            this.bullets_count = Math.min(this.bullets_count, this.max_bullets_count);
        }
        if (this.clip_bullets_count < 0) {
            this.clip_bullets_count = 0;
        }
	};
	
	acts.setClipBullets = function (count) {
        count = parseInt(count, 10);
        if (count == -1) {
            this.clip_bullets_count = this.clip_size;
        }
        if (count >= 0) {
            this.clip_bullets_count = Math.min(count, this.clip_size);
        }
	};
	
	acts.setBullets = function (count) {
        count = parseInt(count, 10);
        if (count == -1) {
            this.bullets_count = this.max_bullets_count;
        }
        if (count >= 0) {
            this.bullets_count = Math.min(parseInt(count, 10), this.max_bullets_count);
        }
	};

	acts.setMaxTotalBullets = function (count) {
		this.max_bullets_count = parseInt(count, 10);
	};

	acts.setClipSize = function (count) {
        count = parseInt(count, 10);
        if (count >= -1) {
            this.clip_size = count;
            if (this.clip_size != -1 && (this.clip_bullets_count == -1 || this.clip_bullets_count > this.clip_size)) {
                if (this.clip_bullets_count != -1) {
                    count = this.clip_size - this.clip_bullets_count;
                } else {
                    count = -1;
                }
                this.clip_bullets_count = this.clip_size;
                acts.setBullets.call(this, count == -1 ? -1 : this.bullets_count + count);
            }
        }
	};
    
	acts.setInterval = function (ms) {
        if (ms < 0) ms = 0;
        this.interval = ms;
	};
    
	acts.setReloadTime = function (ms) {
        if (ms < 0) ms = 0;
        this.reload_time = ms;
	};
    
	acts.makeReady = function () {
        this.enableWeapon();
        this.ready = true;
	};
    
	acts.disableWeapon = function (ms) {
        if (ms < 0 && ms != -1) return;
        this.enabled = false;
        if (ms == -1) return;
        var obj = this;
        setTimeout(function () {
            obj.enabled = true;
        }, ms);
	};
    
	acts.enableWeapon = function () {
        this.enabled = true;
	};
    
    acts.setShootKey = function (key) {
        this.shoot_keycode = key;
    }

    acts.setReloadKey = function (key) {
        this.reload_keycode = key;
    }

    acts.setBullet = function (bullet) {
        this.bullet_instance = bullet;
    }

	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	exps.getClipBulletsCount = function (ret)
	{
		ret.set_float(this.clip_bullets_count);
	};
	
	exps.getBulletsCount = function (ret)
	{
		ret.set_float(this.bullets_count);
	};
	
	exps.getClipSize = function (ret)
	{
		ret.set_float(this.clip_size);
	};
	
	exps.getInterval = function (ret)
	{
		ret.set_float(this.interval);
	};
	
	exps.getReloadTime = function (ret)
	{
		ret.set_float(this.reload_time);
	};
	
	exps.getReady = function (ret)
	{
		ret.set_int(this.ready);
	};
	
	exps.getDisabled = function (ret)
	{
		ret.set_int(!this.enabled);
	};
}());