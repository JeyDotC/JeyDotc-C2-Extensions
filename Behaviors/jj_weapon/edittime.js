function GetBehaviorSettings()
{
	return {
		"name":			"jj_Weapon",
		"id":			"jj_Weapon",
//      "version":      "1.0",
		"description":	"Creates bullets by rules",
		"author":		"JohnJ",
		"help url":		"",
		"category":		"Attributes",
		"flags":		0
	};
};

/* description:
    The object with this behavior have a clip for bullets and bullets in stock.
    You must set the bullet name from your project by setting it from Events sheet by the "Set bullet instance" action.
    *** Properties:
        * Clip size = -1 (infinity)
        * Bullets in clip = -1 (infinity)
        * Bullets in stock = -1 (infinity)
        * Stock size = -1 (infinity)
        * Shoot interval = 100 (ms)
        * Reload time = 1000 (ms)
        * Auto-reload = "Yes" ("No")
        * User control = "Burst" ("Single", "None")
        * Enabled = "Yes" ("No")
        * Shoot key = "" (for example: "32" or "spacebar")
        * Reload key = "" (for example: "r" or "R")
        * Weapon image-point = "" (image-point index of sprite)
 */

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, 0, "Is ready", "", "{my} is ready to shoot", "True when the object is make pause and ready to shoot now.", "isReady");

AddCmpParam("Comparison", "Choose bullets count to compare.");
AddNumberParam("Bullets count", "The bullets in clip.");
AddCondition(1, 0, "Bullets in clip", "", "{my} clip buttons count {0} {1}", "True when the object clip have some bullets.", "bulletsInClip");

AddCondition(2, cf_trigger, "Reload start", "", "{my} start reloading", "True when weapon is reload start.", "isReloadStart");

AddCondition(3, cf_trigger, "Reload finish", "", "{my} finish reloading", "True when weapon is reload finish.", "isReloadFinish");

AddCondition(4, cf_trigger, "Shoot", "", "{my} shoot", "True when the object is make shoot.", "wasShoot");

AddCondition(5, 0, "Disabled", "", "{my} disable", "True when weapon is disabled.", "isDisabled");

AddCondition(6, 0, "Enabled", "", "{my} enable", "True when weapon is enabled.", "isEnabled");

AddCondition(7, cf_trigger, "Reload cancel", "", "{my} cancel reload", "True when weapon reload was canceled.", "isReloadCanceled");

//////////////////////////////////////////////////////////////
// Actions
AddAction(0, 0, "Make a shoot", "", "{my} shoot now.", "Make a one shoot.", "makeShoot");

AddNumberParam("Count", "Change current count of bullets in the clip.", "1");
AddAction(1, 0, "Add bullets to clip", "", "{0} bullets add to clip for {my}", "Add bullets to a clip for object. You can use negative values (e.g.: - 5)", "addClipBullets");

AddNumberParam("Count", "Set count of bullets in the clip.", "35");
AddAction(2, 0, "Set bullets in the clip", "", "The clip of {my} have {0} bullets now.", "Set bullets count in the clip of object. From 0 to -1 (=infinity)", "setClipBullets");

AddNumberParam("Count", "Set count of bullets in the stock.", "350");
AddAction(3, 0, "Set weapon bullets count", "", "The {my} have {0} bullets now.", "Set bullets count for the current weapon. From 0 to -1 (=infinity)", "setBullets");

AddNumberParam("size", "Set size of stock.", "350");
AddAction(13, 0, "Set weapon size of stock", "", "The {my} size of stock is {0} now.", "Set size of stock for the current weapon. From 0 to -1 (=infinity)", "setMaxTotalBullets");

AddNumberParam("Count", "Set maximum of bullets count in a clip.", "35");
AddAction(4, 0, "Set size of the clip", "", "The clip size of {my} have {0} places for bullets now.", "Set maximum of bullets count in a clip. From 0 to -1 (=infinity)", "setClipSize");

AddNumberParam("Interval", "Set interval between shots for current weapon (milliseconds).", "1000");
AddAction(5, 0, "Set interval", "", "Set {my} shots interval to <i>{0}</i> milliseconds", "Set interval between shoots for current weapon (ms).", "setInterval");

AddNumberParam("ReloadTime", "Set interval for reload current weapon (milliseconds).", "1000");
AddAction(6, 0, "Set reload time", "", "Set {my} reload interval to <i>{0}</i> milliseconds", "Set interval between shoots for current weapon (ms).", "setReloadTime");

AddAction(7, 0, "Set ready to shoot", "", "Set {my} ready for a shoot.", "Set the weapon to ready for a shoot.", "makeReady");

AddNumberParam("During", "Disable weapon during in milliseconds. -1 means \"not limited by time\".", "-1");
AddAction(8, 0, "Disable weapon during...", "", "Disable {my} on <i>{0}</i> milliseconds", "Set the disabled status for weapon during some time. (-1 = not limited in time)", "disableWeapon");

AddAction(9, 0, "Enable weapon", "", "Enable {my}.", "Set the weapon enabled.", "enableWeapon");

AddKeybParam("Shoot key", "Choose the key for shoot from weapon");
AddAction(10, 0, "Set shoot key", "", "Shoot key for {my} is {0} now.", "Set the shoot key for weapon.", "setShootKey");

AddKeybParam("Reload key", "Choose the key for weapon reload");
AddAction(11, 0, "Set reload key", "", "Reload key for {my} is {0} now.", "Set the reload key for weapon.", "setReloadKey");

AddObjectParam("Bullet", "Choose the bullet object for weapon");
AddAction(12, 0, "Set bullet instance", "", "Bullet of {my} now is {0}.", "Set the weapon bullet type.", "setBullet");

AddAction(13, 0, "Reload", "", "{my} reload now.", "Start reload.", "simulateReload");

AddAction(14, 0, "Cancel reload", "", "{my} cancel reload.", "Cancel the current reload.", "cancelReload");

AddStringParam("Instance type name", "Name of the bullet instance type.")
AddAction(15, 0, "Set bullet instance by name", "", "Bullet of {my} now is {0}.", "Set the weapon bullet type by name.", "setBulletByName");

//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Get bullets count in the clip", "", "getClipBulletsCount", "The count bullets in the clip now.");
AddExpression(1, ef_return_number, "Get bullets count for weapon", "", "getBulletsCount", "The count bullets for the current weapon.");
AddExpression(2, ef_return_number, "Get clip size", "", "getClipSize", "The bullets places count in a clip.");
AddExpression(3, ef_return_number, "Get shots interval", "", "getInterval", "The interval between each shoot (ms).");
AddExpression(4, ef_return_number, "Get reload time", "", "getReloadTime", "When clip is empty, weapon must be reloaded during some time.");
AddExpression(5, ef_return_number, "Get ready status", "", "getReady", "After each shoot weapon can not make next shooting some time.");
AddExpression(6, ef_return_number, "Get disabled status", "", "getDisabled", "In reload time and other cases, weapon can be disabled.");
AddExpression(7, ef_return_number, "Get last shoot bullet", "", "getLastShootBullet", "Gets the last shoot bullet UID, this only works on shoot.");
AddExpression(8, ef_return_number, "Get is reloading", "", "getIsReloading", "Gets if the weapon is reloading.");
AddExpression(9, ef_return_number, "Get last shoot time", "", "getLastShootTime", "Gets the last time the weapon was shot.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
    new cr.Property(ept_float, "Clip size", -1, "Count of bullets in each clip (-1 = infinity)."),
    new cr.Property(ept_float, "Bullets in clip", -1, "Bullets in clip at start (-1 = infinity)"),
    new cr.Property(ept_float, "Bullets in stock", -1, "Count of bullets for current weapon (-1 = infinity)."),
    new cr.Property(ept_float, "Stock size", -1, "Volume of current weapon for bullets. Max bullets count. (-1 = infinity)."),
	new cr.Property(ept_float, "Shoot interval", 100, "Interval in milliseconds between shoots."),
	new cr.Property(ept_float, "Reload time", 1000, "Reload time in milliseconds."),
	new cr.Property(ept_combo, "Auto-reload", "Yes", "When clip is empty, weapon start reload automatically.", "No|Yes"),
	new cr.Property(ept_combo, "User control", "Burst", "Type of weapon firing: None = weapon not controlling by player; Single = for each shoot user must make click (down and up key); Burst = down shoot-key for constantly shoot and up for enought;", "None|Single|Burst"),
	new cr.Property(ept_combo, "Enabled", "Yes", "If disabled, weapon can not make shoots.", "No|Yes"),
	new cr.Property(ept_text, "Shoot key", "", "Name or code of key for shoot."),
	new cr.Property(ept_text, "Reload key", "", "Name or code of key for reload."),
/*    new cr.Property(ept_text, "Bullet classname", "", "Classname for bullet instance for this weapon."), // it's work only during testing game, because all of classnames are changed on Export project (as minifined and not)... */
    new cr.Property(ept_float, "Weapon image-point", "0", "Set point for the weapon from which bullets will fly.")
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
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Set initial value for "default controls" if empty (added r51)
	if (property_name === "Auto-reload" && !this.properties["Auto-reload"])
		this.properties["Auto-reload"] = "Yes";
	if (property_name === "User control" && !this.properties["User control"])
		this.properties["User control"] = "Burst";
	if (property_name === "Enabled" && !this.properties["Enabled"])
		this.properties["Enabled"] = "Yes";
}