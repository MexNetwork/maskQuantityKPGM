/********************************************************************************************
*
* maskQuantityKPGM
* Authors: Karol Pomaski, Gonzalo Marquez
* Company: MexNetwork.com
* Example:
*   To establish a mask:                    $('#quant').maskQuantityKPGM({precision: 2});
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
									object.val(prepareCommas(object.val().substring(0, object.val().length - (currentPrecision - precision) ))['value']);
								}

							}
							else object.val(prepareCommas(object.val())['value']);




						}
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
									$(this).val(prepareCommas($(this).val().substring(0, $(this).val().length + (settings.precision - newPrecision) ))['value']);
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
