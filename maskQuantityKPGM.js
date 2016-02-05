/********************************************************************************************
*
* maskQuantityKPGM
* Authors: Karol Pomaski, Gonzalo Marquez
* Company: MexNetwork.com
* Example:
*   To set a mask:                    $('#quant').maskQuantityKPGM({precision: 2});
*   To unmask field and get the value:      $('#quant').unmaskQuantityKPGM();
*********************************************************************************************/


(function ( $ ) {

 	jQuery.fn.extend({

	    maskQuantityKPGM: function(options) {

					this.oldText = "";


					var defaults = {
						precision: 2,
					};


					var settings = $.extend({}, defaults, options);

					var p = {
						initCleanup: function(object, precision) {

							var currentPrecision = (object.val() == '' || object.val().split(".").length == 1) ? 0:object.val().split(".")[1].length;


							if(currentPrecision > precision) {

								if(precision == 0) {
									 // Remove with dot
									 object.val(prepareCommas(object.val().substring(0, object.val().length - (currentPrecision - precision + 1) ))['value']);

								}
								else {
									// Remove only last decimals
									object.val(prepareCommas(object.val().substring(0, object.val().length - (currentPrecision - precision ) ))['value']);
								}

							}
							else object.val(prepareCommas(object.val())['value']);




						},
						cleanupNewValue: function(object, value, precision) {

							var currentPrecision = (value == '' || value.split(".").length == 1) ? 0:value.split(".")[1].length;
							console.log("Current precision: "+currentPrecision);
							console.log("Precision from settings" + precision);
							console.log("Value pasted " + value);

							if(currentPrecision > precision) {

								if(precision == 0) {
									// Remove with dot
									console.log("tutaj");
									console.log("sub1 "+value.substring(0, value.length - (currentPrecision - precision + 1) ));
									console.log('final '+prepareCommas(value.substring(0, value.length - (currentPrecision - precision + 1) ))['value']);
									object.val(prepareCommas(value.substring(0, value.length - (currentPrecision - precision + 1) ))['value']);

								}
								else {
									// Remove only last decimals
									console.log("tutaj2");
									console.log("sub2 "+value.substring(0, value.length - (currentPrecision - precision ) ));
									object.val(prepareCommas(value.substring(0, value.length - (currentPrecision - precision ) ))['value']);
								}

							}
							else object.val(prepareCommas(value)['value']);




						},
					}



					return this.each(function() {

						  // check if already with value -- apply all the settings
							var currentPrecision = 0;

							// Clean the field as an initial cleanup
							p.initCleanup($(this), settings.precision);


						  $(this).off('input').on('input', function(e){

								var start = this.selectionStart,
				        end = this.selectionEnd;

								var positionMove = 0;

								// Check new precision, in case the value has more precision - than remove last decimal
								var newPrecision = ($(this).val() == '' || $(this).val().split(".").length == 1) ? 0:$(this).val().split(".")[1].length;

								if(newPrecision > settings.precision)
								{
									if(settings.precision == 0) {

										$(this).val(prepareCommas($(this).val().substring(0, $(this).val().length - (newPrecision - settings.precision + 1) ))['value']);
									}
									else $(this).val(prepareCommas($(this).val().substring(0, $(this).val().length - (newPrecision - settings.precision) ))['value']);
								}
								else{

									if(this.oldText != $(this).val()) {
											this.oldText = prepareCommas($(this).val())['value'];
											positionMove = prepareCommas($(this).val())['position'];

											$(this).val(prepareCommas($(this).val())['value']);
									}

								}

								this.setSelectionRange(start+positionMove, end+positionMove);

							});

							$(this).bind("paste", function(e){

								var pastedData = e.originalEvent.clipboardData.getData('text');


								//p.cleanupNewValue($(this), pastedData, settings.precision);

							} );

							$(this).off('keypress').on('keypress', function(e){

								var theEvent = e || window.event;
							  var key = theEvent.keyCode || theEvent.which;

							  key = String.fromCharCode(key);
							  if (key.length == 0) return;
							  var regex = /^[0-9.,\b]+$/;

								if(key == '.' && ($(this).val().indexOf('.') > -1 || settings.precision == 0 )) {
										// Only one dot
										theEvent.returnValue = false;
							      if (theEvent.preventDefault) theEvent.preventDefault();

								}

							  if (!regex.test(key)) {
							      theEvent.returnValue = false;
							      if (theEvent.preventDefault) theEvent.preventDefault();
							  }

								currentPrecision = ($(this).val() == '' || $(this).val().split(".").length == 1) ? 0:$(this).val().split(".")[1].length;

								if($(this).val() == '0' && key != '.') $(this).val('');

								this.oldText = $(this).val();





							});



				});




			},
			unmaskQuantityKPGM: function() {

					return parseFloat($(this).val().replace(/,/g, ''));

			}

	});

		// Tools used for maskQuantityKPGM

		validate = function(s) {
			var rgx = /^[0-9]*\.?[0-9]*$/;
			return s.match(rgx);
		}

		commaSeparateNumber = function(val){

				if(val.split(".").length > 1) {

					// There are dots
					val = val.split(".");
					while (/(\d+)(\d{3})/.test(val[0].toString())){
						val[0] = val[0].toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
					}



					return val.join('.');
				}
				else {

					while (/(\d+)(\d{3})/.test(val.toString())){
						val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
					}
					return val;

				}

				return val;
		}

		prepareCommas = function(value) {

				var oldSize = value.length;
				value = value.replace(/,/g , "");

				var newSize = commaSeparateNumber(value).length;


				return {'value': commaSeparateNumber(value), 'position': (newSize-oldSize)};
		}

		removeCommas = function(value) {

			value = value.replace(/,/g , "");
			return value;

		}

}( jQuery ));
