<?php
   include 'php/settings.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Lightbar Control Panel</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8" />

    <link href="css/bootstrap.min.css" rel="stylesheet" media="screen" />
    <link href="css/ui-lightness/jquery-ui-1.10.3.custom.css" rel="stylesheet" media="screen" />
    <link href="css/lightbar.css" rel="stylesheet" media="screen" />

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
        <script src="js/html5shiv.js"></script>
        <script src="js/respond.min.js"></script>
    <![endif]-->
  </head>
  <body onload="LightBar.OnLoad(<?php echo $settings["refreshrate"]; ?>);">
    <div id="tabs">
      <ul>
	<li><a href="#allpixels">All Pixels</a></li>
<?php
   if ($settings["typeofpixels"] == "digital") {
?>
	<li><a href="#somepixels">Some Pixels</a></li>
	<li><a href="#cascade">Cascade</a></li>
<?php
   }
?>
	<li><a href="#recordings">Recordings</a></li>
	<li><a href="#settings">Settings</a></li>
      </ul>
      <div id="allpixels">
	<div class="pixels">
<?php
   for ($i = 0; $i < $settings["npixels"]; $i++) {
?>
	  <div class="pixel">
	    <div class="preview" switch="on"></div>
	  </div>
<?php
   }
?>
	  <div class="clearboth"></div>
	</div>

	<div class="colorpicker">
	  <canvas width="300" height="300"></canvas>

	  <div class="controls">
	    <div><label>R</label> <input readonly="readonly" class="r" value="0" /></div>
	    <div><label>G</label> <input readonly="readonly" class="g" value="0" /></div>
	    <div><label>B</label> <input readonly="readonly" class="b" value="0" /></div>
	    <div><label>RGB</label> <input readonly="readonly" class="rgb" value="0,0,0" /></div>
	    <div><label>HEX</label> <input readonly="readonly" class="hex" value="#000000" /></div>
	  </div>

	  <div class="clearboth"></div>
	</div>
      </div>

<?php
   if ($settings["typeofpixels"] == "digital") {
?>      <div id="somepixels">
	<div class="pixels">
<?php
   for ($i = 0; $i < $settings["npixels"]; $i++) {
?>
	  <div class="pixel">
	    <div class="preview" switch="off"></div><br />
	    <input type="checkbox" onclick="LightBar.SwitchPixel(this);" />
	  </div>
<?php
   }
?>
	  <div class="clearboth"></div>
	</div>

	<div class="colorpicker">
	  <canvas width="300" height="300"></canvas>

	  <div class="controls">
	    <div><label>R</label> <input readonly="readonly" class="r" value="0" /></div>
	    <div><label>G</label> <input readonly="readonly" class="g" value="0" /></div>
	    <div><label>B</label> <input readonly="readonly" class="b" value="0" /></div>
	    <div><label>RGB</label> <input readonly="readonly" class="rgb" value="0,0,0" /></div>
	    <div><label>HEX</label> <input readonly="readonly" class="hex" value="#000000" /></div>
	  </div>

	  <div class="clearboth"></div>
	</div>
      </div>

      <div id="cascade">
	<div class="pixels">
	  <div class="pixel">
	    <div class="preview" switch="on" cascade="on"></div>
	  </div>
<?php
   for ($i = 1; $i < $settings["npixels"]; $i++) {
?>
	  <div class="pixel">
	    <div class="preview" switch="off" cascade="on"></div>
	  </div>
<?php
   }
?>
	  <div class="clearboth"></div>
	</div>

	<div class="colorpicker">
	  <canvas width="300" height="300"></canvas>

	  <div class="controls">
	    <div><label>R</label> <input readonly="readonly" class="r" value="0" /></div>
	    <div><label>G</label> <input readonly="readonly" class="g" value="0" /></div>
	    <div><label>B</label> <input readonly="readonly" class="b" value="0" /></div>
	    <div><label>RGB</label> <input readonly="readonly" class="rgb" value="0,0,0" /></div>
	    <div><label>HEX</label> <input readonly="readonly" class="hex" value="#000000" /></div>
	  </div>

	  <div class="clearboth"></div>
	</div>
      </div>
<?php
   }
?>

      <div id="recordings">
	<div class="pixels">
<?php
   for ($i = 0; $i < $settings["npixels"]; $i++) {
?>
	  <div class="pixel">
	    <div class="preview" switch="on"></div>
	  </div>
<?php
   }
?>
	  <div class="clearboth"></div>
	</div>
	Current recording: <br />
	<button type="button" onclick="LightBar.Play();">Play</button>
	<button type="button" onclick="LightBar.Save();">Save</button>
	<button type="button" onclick="LightBar.Erase();">Discard</button>
	<button type="button" onclick="LightBar.Upload();">Upload</button>
	<br /><br />
	Load files: <input type="file" id="file" name="file" onchange="LightBar.Open(this);" multiple />
	<form id="saveform" action="save.php" method="post" class="hidden">
	  <input name="data" id="data" type="hidden" />
	</form>
      </div>

      <div id="settings">
	<div class="inputtable">
	  <label>Number of pixels</label>
	  <input name="npixels" size="2" value="<?php echo $settings["npixels"]; ?>" disabled /><br />
	  <label>Type of pixels</label>
	  <select name="typeofpixels" disabled>
	    <option value="analog"<?php if ($settings["typeofpixels"] == "analog") { echo ' selected'; } ?>>Analog</option>
	    <option value="digital"<?php if ($settings["typeofpixels"] == "digital") { echo ' selected'; } ?>>Digital</option>
	  </select><br />
	  <label>Refresh rate</label>
	  <input title="Refresh rate" name="refreshrate" size="2" type="number" value="<?php echo $settings["refreshrate"]; ?>" onchange="if (LightBar.ValidateNumber(this, 1, <?php echo $settings["refreshrate"]; ?>)) LightBar.SetRefreshRate(this.value);" /> hz</br />
	  <label>Palette</label>
	  <select onchange="LightBar.ShowHideCustomPalette(jQuery(this).val());">
	    <option selected value="default">Default</option>
	    <option value="custom">Custom</option>
	  </select>
	  <input type="file" name="palette" id="palette" style="display: none;" onchange="LightBar.DisplayCustomPalette(this.files[0])" />
	  <label>Brightness</label>
	  <input type="range" name="brightness" min="1" max="100" value="100" onchange="LightBar.AdjustBrightness(this.value)"></input>
	  <input id="brightnessdisplay" value="100" size="3" disabled></input>
      </div>
    </div>

    <!-- javascript libraries -->
    <script src="js/jquery-1.10.2.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery-ui-1.10.3.custom.min.js"></script>
    <script src="js/lightbar.js"></script>
  </body>
</html>
