var LightBar = (function() {
	"use strict;"

	// Private variables
	var currentframe = null;
	var currentlyrecording = null;
	var currentrecording = new Array();
	var recordinginterval = 30;
	var arduino;
	var arduinoavailable = false;
	var server = 'hugh.local';
	var port = 9998;

	// Methods
	return {
		// Run on page load
		OnLoad: function(refreshrate) {
			// Save self pointer
			var self = this;

			// For compatibility with older browsers, make sure console.log is defined
			if (!"console" in window) {
				window.console = {log: function(){} };
			}

			// Open a web socket
			if ("WebSocket" in window) {
				arduino = new WebSocket("ws://" + server + ":" + port + "/frame");

				arduino.onopen = function() {
					console.log("Connected to " + server + " on port " + port);
					arduinoavailable = true;
				};

				arduino.onerror = function(error) {
					console.log("WebSocket Error " + error);
				};

				arduino.onmessage = function(event) {
					console.log('Server: ' + event.data);
				};
			}
			else {
				alert("Your browser doesn't support web sockets. Please try Google Chrome.");
			}

			// Set recording interval
			recordinginterval = 1000 / refreshrate;

			// Initiate jQuery UI tabs
			jQuery('#tabs').tabs({
				activate: function(event, ui) {
					self.Record(false);
					if (currentframe) {
						jQuery('.preview:visible').each(function(i, pixel) {
							jQuery(pixel).css('background-color', currentframe.pixels[i]);
						});
					}
				}
			});

			// Initiate color pickers
			jQuery('.colorpicker').each(function(index, colorpicker) { return self.InitializeColorPicker(self, index, colorpicker); });

			return;
		},

		// Initiate color picker
		InitializeColorPicker: function(self, index, colorpicker) {
			// can change color flag
			var canchange = false;

			// jQuery pointers
			var $colorpicker = jQuery(colorpicker);
			var $r = $colorpicker.find('.r');
			var $g = $colorpicker.find('.g');
			var $b = $colorpicker.find('.b');
			var $rgb = $colorpicker.find('.rgb');
			var $hex = $colorpicker.find('.hex');
			var $pixels = $colorpicker.siblings('.pixels').find('.preview');

			// create canvas and context objects
			var $canvas = $colorpicker.find('canvas'); 
			var context = $canvas.get(0).getContext('2d');

			// drawing active image
			self.DisplayDefaultPalette(context);

			// Function to set the pixels according to the given canvas coordinates
			var SetPixels = function(x, y) {
				if (canchange) {
					// get coordinates of current position
					var canvasoffset = $canvas.offset();
					var canvasx = Math.floor(x - canvasoffset.left);
					var canvasy = Math.floor(y - canvasoffset.top);

					// get current pixel
					var pixel = context.getImageData(canvasx, canvasy, 1, 1).data;

					// update controls
					$r.val(pixel[0]);
					$g.val(pixel[1]);
					$b.val(pixel[2]);
					$rgb.val(pixel[0]+','+pixel[1]+','+pixel[2]);
					var hexcolor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
					var hexstring = '#' + ('0000' + hexcolor.toString(16)).substr(-6);
					$hex.val(hexstring);

					// Cascasde
					for (var i = $pixels.length - 1; i > 0; i--) {
						var $currentpixel = $pixels.eq(i);
						var $previouspixel = $pixels.eq(i-1);
						if ($previouspixel.is('[cascade=on]')) {
							$currentpixel.css('background-color', $previouspixel.css('background-color'));
						}
					}

					// Switch pixels
					$pixels.filter('[switch=on]').css('background-color', hexstring);

					// Set current frame
					currentframe = {
						'onset': (new Date()).getTime(),
						'delta': recordinginterval,
						'pixels': $pixels.map(function() {
							return jQuery(this).css('background-color');
						}).get()
					};
				}

				return;
			};

			// mouse handlers
			$canvas.unbind();
			$canvas.mousemove(function(e) {
				return SetPixels(e.pageX, e.pageY);
			});
			$canvas.click(function(e) {
				canchange = !canchange;
				self.Record(canchange);
				return SetPixels(e.pageX, e.pageY);
			});

			// Touch handlers
			var SetPixelsFromTouch = function(e) {
				if (!e) {
					e = event;
				}
				e.preventDefault();
				return SetPixels(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
			};
			$canvas[0].addEventListener('touchstart', function(e) {
				canchange = true;
				self.Record(true);
				SetPixelsFromTouch();
			}, false);
			$canvas[0].addEventListener('touchmove', SetPixelsFromTouch, true);
			$canvas[0].addEventListener('touchend', function(e) {
				canchange = false;
				self.Record(false);
			}, false);

			return;
		},

		// Turn pixel on or off
		SwitchPixel: function(checkbox) {
			var $checkbox = jQuery(checkbox);
			$checkbox.siblings('.preview').attr('switch', $checkbox.is(':checked') ? 'on' : 'off');
			return;
		},

		// Start/stop a recording
		Record: function(shouldrecord) {
			var self = this;
			if (shouldrecord && !currentlyrecording) {
				currentlyrecording = setInterval(function() { self.RecordFrame(self); }, recordinginterval);
			}
			else if (!shouldrecord && currentlyrecording) {
				clearInterval(currentlyrecording);
				currentlyrecording = null;
			}

			return;
		},

		// Records the current frame
		RecordFrame: function(self) {
			if (currentframe) {
				// Send current pixels to arduino
				self.SendToArduino(currentframe.pixels);

				// Push current frame onto recording
				currentrecording.push(currentframe);
			}
		},

		// Saves the current recording
		Save: function() {
			var self = this;
			if (currentlyrecording) {
				self.Record(false);
			}

			if (currentrecording.length) {
				jQuery('#data').val(JSON.stringify(currentrecording));
				jQuery('#saveform').submit();
			}
			else {
				alert('No recoding currently loaded.');
			}

			return;
		},

		// Erases the current recording
		Erase: function() {
			var self = this;
			if (currentlyrecording) {
				self.Record(false);
			}
			if (currentrecording.length) {
				if (confirm('Are you sure you want to erase the current recording?')) {
					currentrecording = new Array();
					currentframe = null;
					jQuery('.preview').css('background-color', '#000000');
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return true;
			}

			return;
		},

		// Opens an old recording
		Open: function(fileinput) {
			var self = this;
			var $fileinput = jQuery(fileinput);
			if (!self.Erase()) {
				//fileinput.files = fileinput.hasOwnProperty('oldfiles') ? fileinput.oldfiles : null;
				return;
			}
			fileinput.oldfiles = fileinput.files;

			jQuery('button:visible').prop('disabled', true);
			jQuery('#tabs').tabs('disable');
			var recordings = new Array();
			var readerror;
			jQuery.each(fileinput.files, function() {
				var file = this;
				var reader = new FileReader();
				reader.onload = function(event) {
					if (readerror) {
						return;
					}
					try {
						recordings.push(jQuery.parseJSON(event.target.result));
					}
					catch (error) {
						readerror = error;
						alert("There was an error parsing a file:\n" + error);
						jQuery('button:visible').prop('disabled', false);
						jQuery('#tabs').tabs('enable');
						return;
					}

					if (recordings.length == fileinput.files.length) {
						if (recordings.length == 1) {
							// One file was loaded, just use the contents
							currentrecording = recordings[0];
							currentframe = currentrecording[currentrecording.length - 1];
						}
						else {
							// Multiple files were loaded, sum them together

							// Normalize the recording onset times
							for (var i = 0; i < recordings.length; i++) {
								recordings[i][0].onset = 0;
								for (var j = 1; j < recordings[i].length; j++) {
									recordings[i][j].onset = recordings[i][j-1].onset + recordings[i][j-1].delta;
								}
							}

							// Create the merge of all recordings
							currentrecording = new Array();
							var t = 0;
							while (recordings.length) {
								// Determine the current pixel values
								var currentpixels = new Array();
								var regex = /rgb\((\d+), (\d+), (\d+)\)/;
								for (var j = 0; j < recordings[0][0].pixels.length; j++) {
									var pixels = regex.exec(recordings[0][0].pixels[j]);
									currentpixels.push(jQuery.map(pixels.splice(1, 3), function(val, index) { return parseInt(val); }));
								}
								for (var i = 1; i < recordings.length; i++) {
									for (var j = 0; j < recordings[i][0].pixels.length; j++) {
										var pixels = regex.exec(recordings[i][0].pixels[j]);
										for (var k = 0; k < 3; k++) {
											currentpixels[j][k] += parseInt(pixels[k + 1]);
										}
									}
								}

								// Determine how much to increment time
								var minindex = 0;
								for (var i = 1; i < recordings.length; i++) {
									if (recordings[minindex][0].onset + recordings[minindex][0].delta > recordings[i][0].onset + recordings[i][0].delta) {
										minindex = i;
									}
								}
								var newt = recordings[minindex][0].onset + recordings[minindex][0].delta;
								var delta = newt - t;

								// Add the frame
								currentframe = {
									'onset': t,
									'pixels': jQuery.map(currentpixels, function(value, index) {
										return 'rgb( ' + (value[0] % 256)+ ', ' + (value[1] % 256) + ', ' + (value[2] % 256) + ')';
									}),
									'delta': delta
								};
								currentrecording.push(currentframe);
								t = newt;

								// Remove parts of the time series that are on or before the new time
								var toremove = new Array();
								for (var i = 0; i < recordings.length; i++) {
									if (t >= recordings[i][0].onset + recordings[i][0].delta) {
										recordings[i].shift();
										if (recordings[i].length == 0) {
											toremove.push(i);
										}
									}
								}
								for (var i = 0; i < toremove.length; i++) {
									recordings.splice(toremove[i] - i, 1);
								}
							}
						}

						jQuery('button:visible').prop('disabled', false);
						jQuery('#tabs').tabs('enable');
					}
				};
				reader.readAsText(file);
			});

			return;
		},

		// Displays the current recording
		Play: function() {
			var self = this;
			jQuery('button:visible').prop('disabled', true);
			jQuery('#tabs').tabs('disable');
			if (currentlyrecording) {
				self.Record(false);
			}
			var delta = 0;
			jQuery.each(currentrecording, function() { delta += this.delta; });
			var $pixels = jQuery('.preview:visible');
			$pixels.css('background-color', 'black');
			this.ShowFrame({
				'pixels': $pixels,
				'i': 0,
				't': 0,
				'delta': delta
			});

			return;
		},

		// Displays the given frame
		ShowFrame: function(args) {
			var self = this;

			if (args.i < 0 || args.i >= currentrecording.length) {
				jQuery('button:visible').prop('disabled', false);
				jQuery('#tabs').tabs('enable');
				return;
			}

			self.SendToArduino(currentrecording[args.i].pixels);
			args.pixels.each(function(j, pixel) {
				jQuery(pixel).css('background-color', currentrecording[args.i].pixels[j]);
			});

			window.setTimeout(function() {
				self.ShowFrame({
					'pixels': args.pixels,
					'i': args.i + 1,
					't': args.t + currentrecording[args.i].delta,
					'delta': args.delta,
				});
			}, currentrecording[args.i].delta);

			return;
		},

		// Sends the given pixels to the arduino for display
		SendToArduino: function(pixels) {
			if (arduinoavailable) {
				arduino.send(JSON.stringify(pixels));
			}
			else {
				console.log('Arduino not available...');
			}
		},

		// Sends the current recording for looping on the arduino
		Upload: function() {
			// TODO
			console.log('This code should upload a recording to the arduino for looping.');
		},

		// Validates a number input
		ValidateNumber: function(input, min, max) {
			var textvalue = input.value;
			if (/^\-?\d+$/.test(textvalue)) {
				var value = parseInt(textvalue);
				if (value < min) {
					alert(input.title + ' must be at least ' + min);
					return false;
				}
				else if (value > max) {
					alert(input.title + ' must be no more than ' + max);
					return false;
				}
				else {
					return true;
				}
			}
			else {
				alert(input.title + ' is not a number');
				return false;
			}

			return;
		},

		// Sets the refresh rate
		SetRefreshRate: function(rate) {
			if (/^\d+$/.test(rate)) {
				recordinginterval = 1000 / parseInt(rate);
			}
			return;
		},

		// Show/hide custom palette input
		ShowHideCustomPalette: function(inputvalue) {
			var self = this;
			var $palette = jQuery('#palette');
			if (inputvalue === 'custom') {
				$palette.show();
				$palette.change();
			}
			else {
				$palette.hide();
				jQuery('canvas').each(function() {
					self.DisplayDefaultPalette(this.getContext('2d'), this.width, this.height);
				});
			}

			return;
		},

		// Sets the displayed palette to the default
		DisplayDefaultPalette: function(context, w, h) {
			context.clearRect(0, 0, w, h);
			var image = new Image();
			image.onload = function() {
				context.drawImage(image, 0, 0, image.width, image.height);
			}
			image.src = 'images/colorwheel1.png';
		},

		// Sets the displayed palette to a custom image
		DisplayCustomPalette: function(file) {
			if (!file) {
				return;
			}

			if (file.type.match('image.*')) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var src = e.target.result;
					jQuery('canvas').each(function() {
						var w = this.width;
						var h = this.height;
						var context = this.getContext('2d');
						context.clearRect(0, 0, w, h);
						var image = new Image();
						image.onload = function() {
							var wratio = w / image.width;
							var hratio = h / image.height;
							if (wratio < hratio) {
								image.width *= wratio;
								image.height *= wratio;
							}
							else {
								image.width *= hratio;
								image.height *= hratio;
							}
							context.drawImage(image, 0, 0, image.width, image.height);
						}
						image.src = src;
					});
				};
				reader.readAsDataURL(file);
			}
			else {
				alert(file.name + ' is not an image file');
			}

			return;
		}
	};
}());
