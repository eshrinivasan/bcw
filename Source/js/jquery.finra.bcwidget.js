/*
Stable version
--------------
Version 1.0 - Released on finra.org homepage(11/09/2013)
Version 2.0 - External Widget Update(11/2014)
*/

;(function (j171, window, document, undefined) {
    var pluginName = 'BCWidget',
        Widget,
        defaults = {
            $mWrap: '<div class="finra-bc-widget-outer-wrapper"><div class="finra-bc-widget-inner-wrapper"><div id="finra-bc-widget" class="finra-bc-widget"><div id="aboutTooltipDiv" style="display:none"><div class="centerElement"><span class="closePopup"></span><p><strong>FINRA</strong>--the Financial Industry Regulatory Authority--is an independent, non-governmental regulator for all securities firms doing business with the public in the United States. Our mission is to protect investors by regulating brokers and brokerage firms and monitoring trading on U.S. stock markets.</p></div></div><div class="finra-bc-widget-common"><h3 class="bcHeader">BrokerCheck<sup>&reg;</sup></h3><h4>Check the background of an investment professional.</h4><div class="autocomplete-container"><input id="finra_pc_search_box" type="text" maxlength="150" placeholder="Search by Name, Firm, or CRD#" class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"/><div class="ui-autocomplete-input-clear"></div></div><div class="resultsArea"></div><p class="logo"><span id="imgLogo"></span></p></div></div><div class="bcwidgetBottomCover"><span class="bcwidgetBottom"></span></div></div></div>',			
            elementID: "finra_pc_search_box",
            serviceURL: "//doppler.finra.org/doppler-lookup/api/v1/lookup",
            brokerCheckURL: "http://brokercheck.finra.org",
            IAURL:"http://www.adviserinfo.sec.gov/",
            resultsTemplate:'<div class="showResults"></div>',
            shortenCaption: false,
            showLogo: true,
            tos:false,
            tosHTML: '<div id="tosAgree"><label><input type="checkbox" checked="yes"/>I accept the <a id="tosAnchor" href="#">terms and conditions</a>.</label></div>',
            isSelected: false,
            slideSpeed: 300,
            iFrameEmbed: false,
            timeOutDelay: 2000,
            redirectOutOfDomain: false,
            displayCount: true,
            dropdownOrientation: 'none',
            $resultsArea: j171('.resultsArea'),
            src: {
                'BC_INDIVIDUALS_WG': {
                        'selectionValue': '{ac_firstname} {ac_middlename} {ac_lastname} '
                    },
                'BC_FIRMS_WG':{
                        'selectionValue': '{ac_firm}'
                }
            },
            callback: function () {
                    console('callback accessed');
            }
        };

    function Plugin(element, options) {
        Widget = this;
        this.element = element;
        this.options = j171.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(this.options);       
    };

    Plugin.prototype = {
        init: function (opts) {
            var $domEl = j171(this.element);
            var currentEl, currentShowAllButtonID;
            opts.currentEl = opts.elementID;
            opts.currentShowAllButtonID = opts.showAllButtonID;
            this.setUpTemplates(opts);            
        },
        process: function(element){
            return j171(element).addClass('solid');
        },
        configureOptions: function(opts, el){
            var $domEl = el;
            if(opts.showLogo)
               $domEl.find('.resultsArea').next('.logo').show();                    
            else
               $domEl.find('.resultsArea').next('.logo').hide();

            if(opts.tos){
                $domEl.find('#tosAgree').remove();
                $domEl.find('#finra-bc-widget').append(opts.tosHTML); 
            }
            else{
                $domEl.find('#tosAgree').remove();
            }
            if(opts.shortenCaption)
                $domEl.find('h4').html('Check the background of an investment professional.');
        },   
        setUpTemplates: function(opts){
                var self = this;
                var $domEl = j171(this.element);
                $domEl.html(opts.$mWrap);
                this.configureOptions(opts, $domEl);
                opts.$domEl = $domEl;
                this.fireAutoComplete(opts);
                this.evtHandlers(opts);
                this.onLoadServiceStatus(opts);            
        },
        onLoadServiceStatus: function(opts){
                j171.ajax({
                    url : opts.serviceURL,
                    dataType : 'jsonp',
                    jsonp : 'json.wrf',
                    traditional : true, 
                    data : 'sources=BC_INDIVIDUALS_WG&query=smith', 
                    timeout: 1500,                        
                    success : function(data) {
                        console('Service health check is successful');
                    },
                    error : function(jqXHR, textStatus, errorThrown) { 
                        _BC.serviceDownMsg();
                    }
                });
        },
        evtHandlers: function(opts){
                var self = this;
                var $inputTargetField = j171("#"+opts.currentEl);
                var $tosAgreeCheckbox = j171("#tosAgree").find("input[type=checkbox]");
                var $tosAnchor = j171('#tosAnchor');
                var $clearIcon = j171(opts.$mWrap).find('.ui-autocomplete-input-clear');
                var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');

                $tosAnchor.on(clickEventType, function(){                   
                        overlayTOS();
                        return false;
                });
                
                 j171(document).on('keyup', function (e) {
                    _BC.unsubscribe('/bc/results');

                    var $this = [j171(".tosWrapper"), j171(".tosWrapper-overlay"),  j171("#aboutTooltipDiv"), j171(".tooltip")] ;//, j171(".tooltipContent")
                    if (e.keyCode == 27) { // "Esc" Key
                        j171.each($this, function(index){
                            if($this[index].is(':visible')){
                                 $this[index].hide();
                            }
                        });
                        return false;
                    }
                });
               
                j171(document).on('mouseup', function (e) {   
                    var $this = [j171("#aboutTooltipDiv")] ;//, j171(".tooltip")
                      j171.each($this, function(index){       
                            if (!$this[index].is(e.target) && $this[index].has(e.target).length === 0) {
                                 $this[index].hide();
                            }
                        });

                });
                

                $tosAgreeCheckbox.on(clickEventType, function () {
                    var inputs = j171(this).closest('div.finra-bc-widget').find('div.autocomplete-container').children('input');
                    if (j171(this).attr('checked')) {
                        j171(this).closest('div.finra-bc-widget').find('div.resultsArea').html('');
                        inputs.removeAttr('disabled');
                        if(!j171.support.placeholder)
                            inputs.val('Search by Name, Firm, or CRD#');    
                        inputs.attr('placeholder', 'Search by Name, Firm, or CRD#');
                    } else {                        
                        inputs.attr('disabled', true);
                        inputs.val('');                       
                        if(!j171.support.placeholder)
                            inputs.val('Please accept the terms and conditions');    
                        inputs.attr('placeholder', 'Please accept the terms and conditions');
                        j171('.ui-autocomplete-input-clear').hide();                     
                    }                    
                });
            

               $inputTargetField.on('keyup paste', function(e) {
                   var that = this;
                   var tmp = escapeHTML(j171(that).val());
                   j171(that).data('keyTerm', tmp);  //for google analytics
                     _BC.unsubscribe('/bc/results');  

				   var code = (e.keyCode ? e.keyCode : e.which);   
				   if(code !== j171.ui.keyCode.ENTER ){
                        _BC.enterHit = false;

					   setTimeout(function() {                                
                         $inputTargetField.autocomplete_by_category('search', tmp);
                     }, 0);
				   }else{    //Close dropdown on hitting enter key 						
					    if(!opts.redirectOutOfDomain){//external
							self.ajaxRedirect(opts, escapeHTMLFix(j171(that).val()));  							   
							$inputTargetField.autocomplete_by_category('close');
						}else{ //internal - dont do anything 																	
							return;
						}

                        _BC.enterHit = true;

                        _BC.subscribe('/bc/results', function(){
                            $inputTargetField.autocomplete_by_category('close');
                        });                    

				   }
					
				   /*logic to show clear icon*/  
				   j171(that).on('focus', function() {                        
							if(j171(that).val().length){
							   j171('.ui-autocomplete-input-clear').css('display','block');
							}  
					});
                });
              
                
                j171('body').on(clickEventType, '#imgLogo', function(event) {
                    _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Widget-Definitions', 'BCWidget-Widget-Definitions'],
                        ['FINRA_BC_GA._trackEvent', 'BCWidget-Definition-FINRALogo', 'BCWidget-Definition-FINRALogo']);
                    $inputTargetField.blur(); //hides text cursor when pop up displays                    
                    j171('.tooltip').each(function() {j171(this).css('display', 'none');});                             
                        event.stopPropagation();
                        event.preventDefault();
                        if(event.handled !== true) {
                            j171("#aboutTooltipDiv").show();
                            event.handled = true;
                        } else {
                            return false;
                        }
                });
    			 


                j171('body').on(clickEventType, '.closePopup', function() {   //logo click                    
                    j171("#aboutTooltipDiv").hide("fade", 200);
                });    


                //clears the input text
                j171('body').on(clickEventType, '.ui-autocomplete-input-clear', function(e){
                    $inputTargetField.val('').focus();                    
                    self.backtoInitialState(opts);                            
                });
        },
        backtoInitialState: function(opts){
            //var $arrowElement = j171('.leftArrow');
            var $el = j171(this.element);
            j171("#"+opts.currentEl).attr('placeholder','Search by Name, Firm, or CRD#');
            j171("#"+opts.currentEl).attr('disabled', false);
             j171('.ui-autocomplete-input-clear').hide();
            $el.find(".resultsArea").removeClass('overlay').empty();                
            this.configureOptions(opts, $el);
            //this.evtHandlers(opts);               
            this.setCheckboxOn(opts);
        },
        setCheckboxOn: function(opts){
            var $tosAgreeCheckbox = j171("#tosAgree").find("input[type=checkbox]");
            var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');
            var $tosAnchor = j171('#tosAnchor');

            $tosAnchor.on(clickEventType, function(){                   
                        overlayTOS();
                        return false;
            });

            $tosAgreeCheckbox.on(clickEventType, function () {
                    var inputs = j171(this).closest('div.finra-bc-widget').find('div.autocomplete-container').children('input');
                    if (j171(this).attr('checked')) {
                        j171(this).closest('div.finra-bc-widget').find('div.resultsArea').html('');
                        inputs.removeAttr('disabled');
                        if(!j171.support.placeholder)
                            inputs.val('Search by Name, Firm, or CRD#');    
                        inputs.attr('placeholder', 'Search by Name, Firm, or CRD#');
                    } else {                        
                        inputs.attr('disabled', true);
                        inputs.val('');                       
                        if(!j171.support.placeholder)
                            inputs.val('Please accept the terms and conditions');    
                        inputs.attr('placeholder', 'Please accept the terms and conditions');
                        j171('.ui-autocomplete-input-clear').hide();
                    }                    
                });
        },
        //generic function to call s4 autocomplete
        fireAutoComplete: function (opts) {
            console(opts.currentEl);
            var self = this;    
         
             
                j171("#"+opts.currentEl).s4_autocomplete({


                    select: function (src, id, fields) {                    
                        opts.fields = fields;
                        if(opts.redirectOutOfDomain){//Internal
                              if(src == "BC_INDIVIDUALS_WG") {
                                    opts.individual = true;
                                    opts.typedValue = j171("#"+opts.currentEl).data('keyTerm');
                                    var fullname = opts.fields.ac_firstname +' '+ opts.fields.ac_middlename +' '+ opts.fields.ac_lastname;
                                    var bc_ia_status = (opts.fields.ac_bc_active_fl == 'Y') ? (opts.fields.ac_ia_active_fl == 'Y') ? 'Both' : 'Broker' : (opts.fields.ac_ia_active_fl == 'Y') ? 'Investment Adviser' : (opts.fields.ac_bc_active_fl == '') ? 'Neither(IA)' : 'Neither(BC)';
                                    _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Individual', fullname, opts.typedValue]);
                                    _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Individual-'+bc_ia_status, fullname]);

                              }else if(src == "BC_FIRMS_WG"){
                                   opts.individual = false;
                                   opts.typedValue = j171("#"+opts.currentEl).data('keyTerm');
                                   var firmName = (opts.fields.ac_firm.length > 1) ? opts.fields.ac_firm : opts.fields.ac_ia_name;
                                   var bc_ia_status = (opts.fields.ac_bc_active_fl == 'Y') ? (opts.fields.ac_ia_active_fl == 'Y') ? 'Both' : 'Brokerage Firm' : (opts.fields.ac_ia_active_fl == 'Y') ? 'Investment Adviser' : (opts.fields.ac_bc_active_fl == '') ? 'Neither(IA)' : 'Neither(BC)';
                                   _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Firm', firmName, opts.typedValue]);
                                   _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Firm-'+bc_ia_status, firmName]);
                              }
                               self.forwardtoOtherDomain(opts); 
                        }else{//External
                            if(src == "BC_INDIVIDUALS_WG") {
                                opts.individual = true;
                                opts.typedValue = j171("#"+opts.currentEl).data('keyTerm');
                                var fullname = opts.fields.ac_firstname +' '+ opts.fields.ac_middlename +' '+ opts.fields.ac_lastname;
                                var bc_ia_status = (opts.fields.ac_bc_active_fl == 'Y') ? (opts.fields.ac_ia_active_fl == 'Y') ? 'Both' : 'Broker' : (opts.fields.ac_ia_active_fl == 'Y') ? 'Investment Adviser' : (opts.fields.ac_bc_active_fl == '') ? 'Neither(IA)' : 'Neither(BC)';
                                _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Individual-'+ window.location.hostname, fullname, opts.typedValue]);
                                _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Individual-'+ window.location.hostname+'-' +bc_ia_status, fullname]);

                                self.oneResultMatch(opts);
                            }else if(src == "BC_FIRMS_WG"){
                                opts.individual = false;
                                opts.typedValue = j171("#"+opts.currentEl).data('keyTerm');
                                var firmName = (opts.fields.ac_firm.length > 1) ? opts.fields.ac_firm : opts.fields.ac_ia_name;
                                var bc_ia_status = (opts.fields.ac_bc_active_fl == 'Y') ? (opts.fields.ac_ia_active_fl == 'Y') ? 'Both' : 'Brokerage Firm' : (opts.fields.ac_ia_active_fl == 'Y') ? 'Investment Adviser' : (opts.fields.ac_bc_active_fl == '') ? 'Neither(IA)' : 'Neither(BC)';                                                            
                                _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Firm-' + window.location.hostname, firmName, opts.typedValue]);
                                _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Firm-' + window.location.hostname+'-'+bc_ia_status, firmName]);                               
                                self.oneResultMatch(opts);
                            }else{
                                self.noResultsMatch(opts);
                            }
                         }   
                    },
                    disableAdvancedMode: true,
                    serviceURL: opts.serviceURL,
                    showNoResultsWarning: true,
                    displayCount: opts.displayCount,
                    sources: opts.src,
                    dropdownOrientation: opts.dropdownOrientation,
                    appendTo: j171('#finra-bc-widget')    
                });
        },
        getForwardUrl: function(urlType, sourceId){
              switch(urlType) {                
                case 'individualBC':
                    return this.options.brokerCheckURL+"/Support/BC_Summary_Link.aspx?Source=Widget&IndividualID="+sourceId;
                case 'individualIA':
                    return this.options.IAURL+"/IAPD/Support/IAPD_Summary_Link.aspx?Source=Widget&IndividualID="+sourceId;
                case 'firmsBC':
                    return this.options.brokerCheckURL+"/Support/BC_Summary_Link.aspx?Source=Widget&FirmID="+sourceId;
                case 'firmsIA':
                    return this.options.IAURL+"/IAPD/Support/IAPD_Summary_Link.aspx?Source=Widget&FirmID="+sourceId;                
            }

        },
        forwardtoOtherDomain: function(opts){
            if(opts.individual){
				if(opts.fields.ac_bc_active_fl === "Y" || opts.fields.ac_bc_active_fl === "N"){
                    var externalURL = this.getForwardUrl('individualBC', opts.fields.ac_source_id);
				}else if(opts.fields.ac_ia_active_fl === "Y" || opts.fields.ac_ia_active_fl === "N"){
					var externalURL = this.getForwardUrl('individualIA', opts.fields.ac_source_id);
				}else{
					 console('out of scope error scenario');
				}
            }else{			
				if(opts.fields.ac_bc_active_fl === "Y" || opts.fields.ac_bc_active_fl === "N"){
					var externalURL = this.getForwardUrl('firmsBC', opts.fields.ac_source_id);
				}else if(opts.fields.ac_ia_active_fl === "Y" || opts.fields.ac_ia_active_fl === "N"){
					var externalURL = this.getForwardUrl('firmsIA', opts.fields.ac_source_id);
				}else{
					  console('out of scope error scenario');
				}
            }

            if(opts.iFrameEmbed)
                window.open(externalURL, '', '');
            else
                window.open(externalURL, 'self', '');    
        },
        //generic function to call ajax to populate results on hitting "Enter" key
        ajaxRedirect: function (opts, enteredTerm) {            
            console(enteredTerm);
            enteredTerm = enteredTerm.toUpperCase();
            var self = this;
            var dataObj = [];
            dataObj.push({
                name: "sources",
                "value": "BC_INDIVIDUALS_WG,BC_FIRMS_WG"
            });
             
            dataObj.push({
                name: "query",
                value: enteredTerm
            });

            var result = null;
            
            j171.ajax({
                url: opts.serviceURL,
                type: 'get',
                dataType: 'jsonp',
                jsonp: 'json.wrf',
                timeout: opts.timeout,
                data: dataObj,
                cache: false,
                success: function (data) {         
                   if(data.results.BC_INDIVIDUALS_WG.totalResults == 0 && data.results.BC_FIRMS_WG.totalResults == 0){
                        self.noResultsMatch(opts);
                   }else{
                        opts.individualsTotal = data.results.BC_INDIVIDUALS_WG.totalResults;
                        opts.firmsTotal = data.results.BC_FIRMS_WG.totalResults;

                        if(opts.individualsTotal > 1 || opts.firmsTotal > 1 || opts.individualsTotal == 1 && opts.firmsTotal == 1){
                                self.multipleResultsMatch(opts);							
                        }else{                           
                                j171.each(data.results, function(key,value){ 
                                    if(key == 'BC_INDIVIDUALS_WG'){
                                        j171.each(value.results, function(k, v){
                                            console(v.fields);
                                            opts.fields = v.fields;
                                            opts.individual = true;
                                            opts.typedValue = j171("#"+opts.currentEl).data('keyTerm');
                                            var fullname = opts.fields.ac_firstname +' '+ opts.fields.ac_middlename +' '+ opts.fields.ac_lastname;
                                            var bc_ia_status = (opts.fields.ac_bc_active_fl == 'Y') ? (opts.fields.ac_ia_active_fl == 'Y') ? 'Both' : 'Broker' : (opts.fields.ac_ia_active_fl == 'Y') ? 'Investment Adviser' :  (opts.fields.ac_bc_active_fl == '') ? 'Neither(IA)' : 'Neither(BC)';
                                            _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Individual-' + window.location.hostname, fullname, opts.typedValue]);
                                            _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Individual-' + window.location.hostname+'-'+bc_ia_status, fullname]);                                            
                                            self.oneResultMatch(opts);                                       
                                        });    
                                    } else if(key == 'BC_FIRMS_WG'){
                                        j171.each(value.results, function(k, v){
                                            console(v.fields);
                                            opts.fields = v.fields;
                                            opts.individual = false;
                                            opts.typedValue = j171("#"+opts.currentEl).data('keyTerm');
                                            var firmName = (opts.fields.ac_firm.length > 1) ? opts.fields.ac_firm : opts.fields.ac_ia_name;
                                            var bc_ia_status = (opts.fields.ac_bc_active_fl == 'Y') ? (opts.fields.ac_ia_active_fl == 'Y') ? 'Both' : 'Brokerage Firm' : (opts.fields.ac_ia_active_fl == 'Y') ? 'Investment Adviser' : (opts.fields.ac_bc_active_fl == '') ? 'Neither(IA)' : 'Neither(BC)';
                                            _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Firm-' + window.location.hostname, firmName, opts.typedValue]);
                                            _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Firm-' + window.location.hostname+'-'+bc_ia_status, firmName]);
                                            self.oneResultMatch(opts);
                                        });
                                    }                      
                                });
                             
                        }    
                   }
                }
            });
        },
        noResultsMatch: function(opts){
            //<p>Sorry, we are unable to find any results that match your search criteria</p><div class="bcCallToAction"><a href="http://brokercheck.finra.org" target="_blank">Visit BrokerCheck on FINRA.org</a></div>
            var $resultsTemplate = '<div class="addPadding"><h5>No matches found</h5>Please refine your search or visit <a href="http://brokercheck.finra.org" target="_blank">BrokerCheck</a>.<p class="logo"><span id="imgLogo"></span></p></div>';
                j171(this.element).find(".resultsArea").next('.logo').hide();
                j171(this.element).find(".resultsArea").addClass('overlay').show("blind", { easing:"swing"}, opts.slideSpeed).html($resultsTemplate);
                j171(this.element).find(".resultsArea").append('<div class="bcwidgetBottom"></div>');
				//this.attachActions(opts);	
        },
        oneResultMatch: function(opts){
            var $resultsTemplate = {};
            var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');
            if(opts.individual){
				var firstname, fullname, actionMsg, formatName;
               // var broker_and_IA, not_broker_not_IA, broker,  IA = '';
                var individualRole = '';
                var currEmpMarkup = ''; var altNameMarkup = '';
                var broker_disclosure_status, ia_disclosure_status, currentEmployerMsg, currentEmployerList, altNamesExist, 
                altNamesMsg, finra_registered_status = '';
                var altNamesMsg = (opts.fields.ac_othernames.length > 1) ? 'More than 1 alternate name exists' : opts.fields.ac_othernames;

				fullname = opts.fields.ac_firstname +' '+ opts.fields.ac_middlename +' '+ opts.fields.ac_lastname;
				firstname = opts.fields.ac_firstname;				
				formatName = (fullname.slice(-1) === 'S')? fullname + '\'' : fullname + '\'s';
				actionMsg = '<p class="callToActionInstructions">Click the button below to see <span>'+formatName+'</span> employment history, qualifications and other details.';
				
                broker_disclosure_status = (opts.fields.ac_bc_dsclr_fl == "Y")? "  <span class=\"keyTerms\">There are <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Disclosures\', \'BCWidget-Definitions-Disclosures\']);\" title=\"<span class=closeIcon></span><div>All individuals registered to sell securities or provide investment advice are required to disclose customer complaints and arbitrations, regulatory actions, employment terminations, bankruptcy filings, and criminal or civil judicial proceedings.</div>\" class=\"tooltipContent\" data-html=\"true\">disclosures</a></span> for this individual.": "There are <span class=\"keyTerms\">no <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Disclosures\', \'BCWidget-Definitions-Disclosures\']);\" title=\"<span class=closeIcon></span><div>All individuals registered to sell securities or provide investment advice are required to disclose customer complaints and arbitrations, regulatory actions, employment terminations, bankruptcy filings, and criminal or civil judicial proceedings.</div>\" class=\"tooltipContent\" data-html=\"true\">disclosures</a></span> for this individual.";
                ia_disclosure_status = (opts.fields.ac_ia_dsclr_fl == "Y") ? "  <span class=\"keyTerms\">There are <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Disclosures\', \'BCWidget-Definitions-Disclosures\']);\" title=\"<span class=closeIcon></span><div>All individuals registered to sell securities or provide investment advice are required to disclose customer complaints and arbitrations, regulatory actions, employment terminations, bankruptcy filings, and criminal or civil judicial proceedings.</div>\" class=\"tooltipContent\" data-html=\"true\">disclosures</a></span> for this individual.": "There are <span class=\"keyTerms\">no <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Disclosures\', \'BCWidget-Definitions-Disclosures\']);\" title=\"<span class=closeIcon></span><div>All individuals registered to sell securities or provide investment advice are required to disclose customer complaints and arbitrations, regulatory actions, employment terminations, bankruptcy filings, and criminal or civil judicial proceedings.</div>\" class=\"tooltipContent\" data-html=\"true\">disclosures</a></span> for this individual.";
				
				if (opts.fields.ac_current_employ == '' || opts.fields.ac_current_employ === null) {
					currentEmployerMsg = 'No current employer on record.';
					currentEmployerlist = '';
				} else if (opts.fields.ac_current_employ.length > 1){
					currentEmployerMsg = 'Multiple Employers';
					currentEmployerlist = 'Multiple Employers: '+opts.fields.ac_current_employ;
				} else {
					currentEmployerMsg = opts.fields.ac_current_employ;
					currentEmployerlist = '';
				}
                				
				altNamesExist = (opts.fields.ac_othernames != "" && opts.fields.ac_othernames.length == 1) ? 'Alternate Name: ' + opts.fields.ac_othernames.convert() : '';
                altNamesMsg = (opts.fields.ac_othernames.length > 1) ? 'Alternate Names: '+ opts.fields.ac_othernames : '';
           
                $resultsTemplate =  j171('<div class="addPadding"><div class="positionRelative"><span class="name">'+ fullname +'</span>-<span class="crd"><a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-CRD\', \'BCWidget-Definitions-CRD\']);\"'+
                    'title="<span class=closeIcon></span>FINRA operates Web CRD, the central licensing and registration system for the U.S. securities industry and its regulators. It contains the registration records for approximately 4,300 registered broker-dealers and the qualification, employment and disclosure histories for about 640,000 active registered individuals." class="tooltipContent" data-html="true">CRD</a> #'+opts.fields.ac_source_id +'</span>'+
                    '<div class="currEmployer">'+ currentEmployerMsg +'</div>'+
                    '<div id="altNames">'+altNamesExist+'<span>'+altNamesMsg+'</span></div>'+
					'<div id="prevEmployer">'+currentEmployerlist+'</div>'+   
                    '<div class="summarize"></div>'+                         
                    '<p class="logo"><span id="imgLogo"></span></p></div></div>');     


                    if(opts.fields.ac_bc_active_fl === "Y" || opts.fields.ac_bc_active_fl === "N"){//if bc active 'null', go to else if                 
                        if(opts.fields.ac_bc_active_fl === "Y" && opts.fields.ac_ia_active_fl === "Y"){// broker and ia                            
                            individualRole += '<div class="activeArea"><span>'+ fullname + '</span><span> is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Broker\', \'BCWidget-Definitions-Broker\']);\" title=\"<span class=closeIcon></span>A broker, or registered representative, is a person who buys and sells securities&#8212such as stocks, bonds or mutual funds&#8212for a customer or for a securities firm.\" class=\"tooltipContent\" data-html=\"true\">broker</a> and a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviser\', \'BCWidget-Definitions-InvestmentAdviser\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser</a>. </span>';
                            individualRole += '<div id="disclosureStatus">'+broker_disclosure_status+'</div></div>'+ actionMsg;                            
                        }else if(opts.fields.ac_bc_active_fl === "Y" && opts.fields.ac_ia_active_fl !== "Y"){ //ia can be '' or 'N'  //broker                          
                            individualRole += '<div class="activeArea"><span>' + fullname + '</span><span> is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Broker\', \'BCWidget-Definitions-Broker\']);\" title=\"<span class=closeIcon></span>A broker, or registered representative, is a person who buys and sells securities&#8212such as stocks, bonds or mutual funds&#8212for a customer or for a securities firm.\" class=\"tooltipContent\" data-html=\"true\">broker</a>.</span>';
                            individualRole += '<div id="disclosureStatus">'+broker_disclosure_status+'</div></div>'+ actionMsg;
                        }else if(opts.fields.ac_bc_active_fl === "N" && opts.fields.ac_ia_active_fl === "Y"){  //ia                          
                            individualRole += '<div class="activeArea"><span>'+ fullname + '</span><span> is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviser\', \'BCWidget-Definitions-InvestmentAdviser\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser</a>.</span>';    
                            individualRole += '<div id="disclosureStatus">'+ia_disclosure_status+'</div></div>'+ actionMsg;
                        }else if(opts.fields.ac_bc_active_fl === "N" && opts.fields.ac_ia_active_fl !== "Y"){//ia can be '' or 'N' //not broker and not ia                                                       
                            individualRole += '<div class="activeArea"><span>'+ fullname + '</span><span> is neither a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Broker\', \'BCWidget-Definitions-Broker\']);\" title=\"<span class=closeIcon></span>A broker, or registered representative, is a person who buys and sells securities&#8212such as stocks, bonds or mutual funds&#8212for a customer or for a securities firm.\" class=\"tooltipContent\" data-html=\"true\">broker</a> nor an <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviser\', \'BCWidget-Definitions-InvestmentAdviser\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser</a>.</span>';
                            individualRole += '<div id="disclosureStatus">'+broker_disclosure_status+'</div></div>'+ actionMsg;
                        }                       
                        individualRole += '<div class="bcCallToAction"><a href="'+this.getForwardUrl('individualBC', opts.fields.ac_source_id)+'" target="_blank">Get Full Report</a></div>';

                     }else if(opts.fields.ac_ia_active_fl === "Y" || opts.fields.ac_ia_active_fl === "N"){
                        if(opts.fields.ac_ia_active_fl === "Y" && opts.fields.ac_bc_active_fl !== "Y"){ //bc can be '' or 'N' //ia                                                       
                            individualRole += '<div class="activeArea"><span>'+ fullname + '</span><span> is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviser\', \'BCWidget-Definitions-InvestmentAdviser\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser</a>.</span>';    
                            individualRole += '<div id="disclosureStatus">'+ia_disclosure_status+'</div></div>'+ actionMsg;
                        }else if(opts.fields.ac_ia_active_fl === "N" && opts.fields.ac_bc_active_fl !== "Y"){ //bc can be '' or 'N'//not broker and not ia                            
                            individualRole += '<div class="activeArea"><span>'+ fullname + '</span><span> is neither a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-Broker\', \'BCWidget-Definitions-Broker\']);\" title=\"<span class=closeIcon></span>A broker, or registered representative, is a person who buys and sells securities&#8212such as stocks, bonds or mutual funds&#8212for a customer or for a securities firm.\" class=\"tooltipContent\" data-html=\"true\">broker</a> nor <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviser\', \'BCWidget-Definitions-InvestmentAdviser\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser</a>.</span>';
                            individualRole += '<div id="disclosureStatus">'+broker_disclosure_status+'</div></div>'+ actionMsg;
                        }                        
                        individualRole += '<div class="bcCallToAction"><a href="'+this.getForwardUrl('individualIA', opts.fields.ac_source_id)+'" target="_blank">Get Full Report</a></div>'
                    }else{                        
                        console('not broker and not ia');
                    }

                    $resultsTemplate.find('.summarize').append(individualRole);                   


                $resultsTemplate.find('.bcCallToAction').on(clickEventType, function(){
                    _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Individual-'+ window.location.hostname, 'Full Report Link', j171("#" + opts.currentEl).val()]);
                });                                

            }else{
               var firmType, firmActionMsg, finraActive, altNamesExist, firmName,formatName, altNamesMsg = '';              
               //var firm_broker_IA, not_firm_broker_not_IA, firm_broker, firm_IA = '';
               var firmRole = '';
              // var firmIAType = (opts.fields.ac_ia_active_fl == "Y" || opts.fields.ac_ia_active_fl == "N")? "investment adviser firm": "";                
               //var firmBrokerType = (opts.fields.ac_bc_active_fl == "Y" || opts.fields.ac_bc_active_fl == "N")? "brokerage firm": "";                
               //finraActive = (opts.fields.ac_bc_active_fl == "N")? '(Finra-Inactive)' : '';
              // IAActive = (opts.fields.ac_ia_active_fl == "N")? '(IA-Inactive)' : '';
               altNamesExist = (opts.fields.ac_alt_names != "" && opts.fields.ac_alt_names.length == 1) ? 'Alternate Name: '+ opts.fields.ac_alt_names : '';
			   altNamesMsg = (opts.fields.ac_alt_names.length > 1) ? 'Alternate Names: ' + opts.fields.ac_alt_names : '';
			   firmName = (opts.fields.ac_firm.length > 1) ? opts.fields.ac_firm : opts.fields.ac_ia_name;
				
				formatName = (firmName.slice(-1) === 's')? firmName + '\'' : firmName + '\'s';
			  // firmActionMsg = '<p class="callToActionInstructions">Click the button below to see this company\'s registration and disclosure information.</p>';

               var $resultsTemplate = j171('<div class="addPadding"><div class="positionRelative"><span class="name">'+ firmName +'</span>-<span class="crd"><a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-CRD\', \'BCWidget-Definitions-CRD\']);\" title=\"<span class=closeIcon></span>FINRA operates Web CRD, the central licensing and registration system for the U.S. securities industry and its regulators. It contains the registration records for approximately 4,300 registered broker-dealers and the qualification, employment and disclosure histories for about 640,000 active registered individuals.\" class=\"tooltipContent\" data-html=\"true\">CRD</a> #'+opts.fields.ac_source_id +'</span>'+
                                        '<div id="altNames">'+altNamesExist+altNamesMsg+'</div>'+
                                        '<div class="summarize"></div>'+
                                        '<p class="logo"><span id="imgLogo"></span></p></div></div>');   

               if(opts.fields.ac_bc_active_fl === "Y" || opts.fields.ac_bc_active_fl === "N"){  //if bc active 'null', go to else if                 
                    if(opts.fields.ac_bc_active_fl === "Y" && opts.fields.ac_ia_active_fl === "Y"){ // brokerage and ia firm                        
                        firmRole += '<div class="activeArea"><span>'+ firmName + ' is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-BrokerageFirm\', \'BCWidget-Definitions-BrokerageFirm\']);\" title=\"<span class=closeIcon></span><b>Brokerage firms</b> are FINRA-registered firms that buy and sell securities and employ brokers.\" data-html=\"true\" class=\"tooltipContent\">brokerage firm</a> and a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviserFirm\', \'BCWidget-Definitions-InvestmentAdviserFirm\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser firm</a>.</span></div>';
                    }else if(opts.fields.ac_bc_active_fl === "Y" && opts.fields.ac_ia_active_fl !== "Y"){//brokerage firm                         
                        firmRole += '<div class="activeArea"><span>'+ firmName + ' is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-BrokerageFirm\', \'BCWidget-Definitions-BrokerageFirm\']);\" title=\"<span class=closeIcon></span><b>Brokerage firms</b> are FINRA-registered firms that buy and sell securities and employ brokers." data-html=\"true\" class=\"tooltipContent\">brokerage firm</a>.</span></div>';
                    }else if(opts.fields.ac_bc_active_fl === "N" && opts.fields.ac_ia_active_fl === "Y"){ //ia firm                        
                        firmRole += '<div class="activeArea"><span>'+ firmName + ' is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviserFirm\', \'BCWidget-Definitions-InvestmentAdviserFirm\']);\"                           title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser firm</a>.</span></div>';
                    }else if(opts.fields.ac_bc_active_fl === "N" && opts.fields.ac_ia_active_fl !== "Y"){//neither brokerage firm nor ia firm                        
                        firmRole += '<div class="activeArea"><span>'+ firmName + ' is neither a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-BrokerageFirm\', \'BCWidget-Definitions-BrokerageFirm\']);\" title=\"<span class=closeIcon></span><b>Brokerage firms</b> are FINRA-registered firms that buy and sell securities and employ brokers.\" data-html=\"true\" class=\"tooltipContent\">brokerage firm</a> nor <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviserFirm\', \'BCWidget-Definitions-InvestmentAdviserFirm\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser firm</a>.</span></div>';
                    }
                    
                    firmRole += '<div class="bcCallToAction"><a href="'+this.getForwardUrl('firmsBC', opts.fields.ac_source_id)+'" target="_blank">Get Full Report</a></div>';   

                }else if(opts.fields.ac_ia_active_fl === "Y" || opts.fields.ac_ia_active_fl === "N"){
                    if(opts.fields.ac_ia_active_fl === "Y" && opts.fields.ac_bc_active_fl !== "Y"){//ia firm                                              
                        firmRole += '<div class="activeArea"><span>'+ firmName + ' is a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviserFirm\', \'BCWidget-Definitions-InvestmentAdviserFirm\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser firm</a>.</span></div>';
                    }else if(opts.fields.ac_ia_active_fl === "N" && opts.fields.ac_bc_active_fl !== "Y"){//neither brokerage firm nor ia firm                        
                        firmRole += '<div class="activeArea"><span>'+ firmName + ' is neither a registered <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-BrokerageFirm\', \'BCWidget-Definitions-BrokerageFirm\']);\" title=\"<span class=closeIcon></span><b>Brokerage firms</b> are FINRA-registered firms that buy and sell securities and employ brokers.\" data-html=\"true\" class=\"tooltipContent\">brokerage firm</a> nor <a onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Widget-Definitions\', \'BCWidget-Widget-Definitions\'], [\'FINRA_BC_GA._trackEvent\', \'BCWidget-Definition-InvestmentAdviserFirm\', \'BCWidget-Definitions-InvestmentAdviserFirm\']);\" title=\"<span class=closeIcon></span>An <b>investment adviser</b> is an individual or company that is paid for providing advice about investments to their clients.\" data-html=\"true\" class=\"tooltipContent\">investment adviser firm</a>.</span></div>';   
                    }                  
                    
                    firmRole += '<div class="bcCallToAction"><a href="'+this.getForwardUrl('firmsIA', opts.fields.ac_source_id)+'" target="_blank">Get Full Report</a></div>';
                }else{                        
                    console('not brokerage firm and not ia firm');
                }
                $resultsTemplate.find('.summarize').append(firmRole);
            }
            j171(this.element).find(".resultsArea").next('.logo').hide();
			j171(this.element).find(".resultsArea").addClass('overlay').show("blind", { easing:"swing"}, opts.slideSpeed).html($resultsTemplate);  
            j171(this.element).find(".resultsArea").append('<div class="bcwidgetBottom"></div>');
            window.isVisible = false;

            var hideAllPopovers = function() {
               j171('.tooltip').each(function() {
                    j171(this).css('display', 'none');
                });  
            };

            j171(this.element).find(".tooltipContent").tooltip({placement:function (tooltip, trigger) {
                window.setTimeout(function () {
                    j171(tooltip)
                        .addClass('bottom')
                        .css({left: 0})
                        .find('.tooltip-arrow').css({});

                   j171(tooltip).addClass('in');
                }, 0);
            }, trigger:'manual', html:'true', fixclass:'positionTooltip'}).on(clickEventType, function(e){
                if(isVisible) {
                    hideAllPopovers();
                }
                j171(this).tooltip('show');
                isVisible = true;
                stopPropagation(e);

            }); 

            function stopPropagation(e) {
                if(e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }    
            }

            j171(document).on(clickEventType, '.closeIcon', function() {    //tool tip for links               
                    //j171(this).parent().parent().hide("fade", 200);
                    hideAllPopovers();
                    window.isVisible = false;
                });


            j171(document).on(clickEventType, function(e) { hideAllPopovers(); isVisible = false;});
            
            $resultsTemplate.find('.bcCallToAction').on(clickEventType, function(){
                _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Firm-'+ window.location.hostname, 'Full Report Link', j171('#' + opts.currentEl).val()]);
            });            
        },        
        multipleResultsMatch: function(opts){
           var $resultsTemplate = '<div class="addPadding"><h5>Multiple results found</h5><p><b>'+ opts.individualsTotal +' individuals</b> and <b>'+ opts.firmsTotal +' firms</b> match your search criteria.</p><p>Please refine your results above, or try an advanced search on <a href="http://brokercheck.finra.org" target="_blank">BrokerCheck at FINRA.org</a>.</p><p class="logo"><span id="imgLogo"></span></p></div>';
                j171(this.element).find(".resultsArea").next('.logo').hide();
                j171(this.element).find(".resultsArea").show("blind", { easing:"swing"}, opts.slideSpeed).html($resultsTemplate);               
			   
                _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget', 'Mutiple Matches-'+ window.location.hostname, opts.typedValue]);                
        },
        attachActions: function(opts){
            var self = this;            
            var $arrowElement = j171('.leftArrow');
            $arrowElement.show(); 
            $arrowElement.hover(function(){
               j171("#"+opts.elementID).autocomplete_by_category('widget').css("display", "block"); 
            }) 
        }
    };
     
    Array.prototype.convert = function () {
        return this.toString().replace(/[|,]/g, ";"); 
	};

   j171.fn[pluginName] = function (options) {
        if (typeof options === "string") {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var plugin = j171.data(this, 'plugin_' + pluginName);
                plugin[options].apply(plugin, args);
            });
        } else if(Plugin.prototype[options]){
                 j171.data(this, 'plugin_' + pluginName)[options]();
        } else {            
          this.each(function () {
                if (!j171.data(this, 'plugin_' + pluginName)) {
                 return j171.data(this, 'plugin_' + pluginName,
                        new Plugin(this, options));
                }
           });
        }
    }; //End of plugin constructor
  

    var logEnabled = true;
    //private function
    function console(s){
         if ('console' in self && 'log' in console) console.log(s);
    }

    function isNumber(n) {
        if(typeof n != "undefined")
            return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function stripScript(a){
          return a.replace(/<.*?script.*?>.*?<\/.*?script.*?>/igm, '');
    }

   

    function overlayTOS(){
        var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');

        j171('<div class="tosWrapper-overlay"></div>')
         .css('filter', 'alpha(opacity=40)').css("opacity","0.4").fadeIn().appendTo('body');

        j171('<div class="tosWrapper round"><h3>FINRA BrokerCheck - Terms & Conditions</h3><div class="tosClose"><input type="button" value="Close"></input></div><div class="clearBoth"><div class="tostext">'+
            '<ul><li>1. FINRA collects, compiles, organizes, indexes, digitally converts and maintains regulatory information from registered persons, member firms, government agencies and other sources and maintains information in the proprietary Central Registration Depository ("CRD®") database and system. FINRA releases such information through FINRA BrokerCheck, which provides information from the CRD system to the investing public. Your access to FINRA BrokerCheck information provided through FINRA\'s CRD database and system does not transfer any rights in CRD, FINRA BrokerCheck or related technologies to you.</li>'+
                '<li>2. Your use of FINRA BrokerCheck information is conditioned upon your acceptance, without modification, of all terms and conditions of this Agreement. Any information accessed, requested or provided through FINRA BrokerCheck must be accessed, requested and used in accordance with the terms and conditions specified in this Agreement. FINRA reserves any rights not expressly granted under these terms and conditions. Additionally, FINRA reserves the right, at its sole discretion, to modify the terms and conditions for use of FINRA BrokerCheck information at any time by changing this Agreement, and any changes are effective immediately. Such changes will be posted on the FINRA BrokerCheck web-site.</li>'+
                '<li>3. CRD and FINRA BrokerCheck are proprietary databases and employ proprietary software, but FINRA makes no exclusive proprietary claim to the information in the FINRA BrokerCheck system that is not created by FINRA. You are neither restricted nor prohibited by FINRA from obtaining a copy of any original filing or information from a non-FINRA source.</li>'+
                '<li>4. The information provided through FINRA BrokerCheck shall be used ONLY for your own personal or professional use, and in accordance with all other terms and conditions of this Agreement: <div class="subsection"> a. to assist you, your clients or your organization in determining whether to conduct or continue to conduct securities or commodities business with FINRA member firms or their associated persons; <br/> b. to assist you, your clients or your organization in judicial proceedings or arbitration proceedings relating to securities or commodities transactions; or <br/> c. for non-commercial purposes consistent with the promotion of just and equitable principles of trade and the protection of investors and the public interest.</div></li>'+
                '<li>5. The information provided to you through FINRA BrokerCheck is provided to you ONLY for your own personal or professional use. All other uses are prohibited. You agree that you will not duplicate, download, publish, publicly display, modify or otherwise distribute the information retrieved from FINRA BrokerCheck for any purpose other than as expressly permitted by this Agreement. In no event may you offer to others any information retrieved from FINRA BrokerCheck for commercial purposes, or as part of a subscription service or similar arrangement. You agree that you will not use the information retrieved from FINRA BrokerCheck to develop or create a database of information to be sold, licensed or made otherwise commercially available. You agree that you will not use any process to monitor or copy FINRA BrokerCheck information in bulk, or to make voluminous, excessive or repetitive requests for information. You further agree that you will not use any device, software or routine to bypass any software or hardware that prohibits volume requests for information, you will not interfere with or attempt to interfere with the proper working of FINRA BrokerCheck, and you will not take any action that imposes an unreasonable or disproportionately large load on FINRA BrokerCheck or FINRA.</li>'+
                '<li>6. All requests for permission to access or use FINRA BrokerCheck for uses other than those described in paragraphs 4 or 5 of this Agreement must be made in writing to FINRA clearly stating the purpose and manner in which FINRA BrokerCheck is proposed to be used. Requests may be submitted to FINRA, FINRA BrokerCheck, 9509 Key West Avenue, Rockville, Maryland, 20850. FINRA, in its sole discretion, may approve or reject any request that is inconsistent with the terms and conditions of use of FINRA BrokerCheck.</li>'+
                '<li>7. Provision of information by FINRA pursuant to FINRA BrokerCheck does not constitute a waiver of any of FINRA\'s rights, privileges, or immunities with respect to the furnishing of disciplinary or registration information.</li>'+
                '<li>8. FINRA does not charge for this service, which is offered pursuant to FINRA\'s responsibilities as a self-regulatory organization, and, in particular, pursuant to Section 15A(i) of the Securities Exchange Act of 1934. In the provision of this service, FINRA makes no warranties of any kind, and disclaims liability to any person for any actions taken or omitted in good faith with respect to this FINRA BrokerCheck. FINRA is not responsible for and cannot verify information from sources other than FINRA, and does not warrant or guarantee the accuracy or completeness of the information requested. Neither FINRA nor any affiliate or supplier shall be liable for any cause of action in contract, tort, or otherwise, for more than the incremental telecommunications cost incurred to connect to the service. Notwithstanding the above, neither FINRA nor any affiliate or supplier shall be liable for any loss of income, trading loss, or consequential, incidental, or indirect damages, regardless of whether FINRA has been informed of the possibility of such damages.</li>'+
                '<li>9. Member firms, registered persons, government agencies, and other sources file disclosure information with FINRA. Consistent with its responsibilities as a self-regulatory organization, FINRA performs a regulatory review of the disclosure information filed before it makes the information available through FINRA BrokerCheck. Most disclosure information is available through FINRA BrokerCheck within two business days of being filed. In certain limited circumstances, disclosure information may not be available through FINRA BrokerCheck within the usual timeframe, but will be made available as soon as practicable.</li>'+
                '<li>10. Consistent with rules, policies and procedures approved by the SEC, FINRA will disclose information on individuals, through FINRA BrokerCheck, for ten years after the termination of the individual\'s FINRA registration and, in certain cases, indefinitely. Additionally, FINRA will disclose indefinitely information on brokerage firms through FINRA BrokerCheck. Disclosure information reported to FINRA after an individual or brokerage firm has terminated may not have been reviewed by the brokerage firm or individual; in addition, brokerage firms and individuals who are no longer registered are not required to independently report such information.</li>'+
                '<li>11. FINRA BrokerCheck includes only information provided to CRD. In substantially all cases, the information provided through FINRA BrokerCheck represents the verbatim record as it was reported to FINRA. However, in certain limited circumstances, FINRA combined information about a single event that was reported by different sources (e.g., a record reporting information on an event that was submitted by a brokerage firm may contain information reported on the same event that was submitted by a regulator). This condition occurred when the data in the Legacy CRD system was converted (i.e., reformatted and transferred) to Web CRD, the Internet-based Central Registration Depository. This condition affects a small percentage of records reported to FINRA prior to August 1999. These converted records contain information that was reported to FINRA in accordance with appropriate reporting protocols applicable to the source filers (e.g., brokerage firms and regulators); however, because of the combination of information from different reporting sources, a record disclosed through FINRA BrokerCheck may not reflect the actual filing submitted to FINRA.</li>'+
                '<li>12. The "Individual Broker comments," "Brokerage Firm comments" and "Regulator comments" appear verbatim as they were filed in CRD via Forms U4, U5, and U6. These comments were not written by FINRA and have not been edited by FINRA in any way. FINRA reserves the right to redact customer names, confidential customer information, or offensive or potentially defamatory language from a FINRA BrokerCheck Report consistent with policies and procedures approved by the SEC.</li>'+
                '</ul></div></div>')
           .fadeIn().appendTo('body');

            j171('.tosClose').find('input[type=button]').on(clickEventType, function(){
                    j171('.tosWrapper-overlay').fadeOut().remove();
                    j171('.tosWrapper').fadeOut().remove();
            })

    }


    j171.fn[pluginName].setDefaults = function (newOpts) {
        j171.extend(true, defaults, newOpts);
    };

    var $Extend = j171.sub();

    $Extend.fn.process = function(){
          return $Extend(Widget.process(this));
    }

})(jQuery, window, document);



window._BC = {};

;(function(j171) {
    var utilityGlobal = {
       'tryCount':0, 
       'retryLimit':3, 
       'retryDuration':1000,
       'textOverButton': 'Go to BrokerCheck',
       'clientIPRequestURL':'http://api.hostip.info/get_json.php',
       'IPServiceFailure':'0.0.0.0',
        serviceDownMsg : function(){
            j171('.resultsArea').empty();
            j171('.resultsArea').next('.logo').hide(); 
            j171('.autocomplete-container').empty();           
            j171('.autocomplete-container').html('<div class="serviceDownClass"><div class="bcCallToAction"><a href=\"http://brokercheck.finra.org\" onclick=\"_gaq.push([\'FINRA_BC_GA._trackEvent\', \'BCWidget-Error-Click\', \'BCWidget-Error-Click-\'+window.location.hostname]);\">'+this.textOverButton+'</a></div></div>');
            j171('.autocomplete-container').css({'background': 'none', 'paddingBottom':'10px'});
            j171('#tosAgree').hide();
            _gaq.push(['FINRA_BC_GA._trackEvent', 'BCWidget-Error-'+window.location.hostname, 'BCWidget-Error']);
        }
    }

    j171.extend(true, window._BC, utilityGlobal); 
})(jQuery);  


j171(function() {
  j171.ajaxSetup({
        cache : false,             
        error : function(jqXHR, textStatus, errorThrown) {
         if (textStatus !== null) { 
                    if (textStatus == 'timeout') {                           
                        var that = this;
                         _BC.tryCount++;                       
                        if (_BC.tryCount <= _BC.retryLimit) {                            
                            j171.ajax(that);                            
                            if ('console' in self && 'log' in console){
                                console.log('tried to connect '+ _BC.tryCount +' times');                            
                            }
                            if(_BC.tryCount == 3)
                            _BC.serviceDownMsg();                          
                            return;
                        }
                        return;
                    }                   
                    if (jqXHR.status === 0) {
                             _BC.serviceDownMsg();    
                    } else if (jqXHR.status === 404) {
                            _BC.serviceDownMsg();                
                    } else if (jqXHR.status === 500) {
                             _BC.serviceDownMsg(); 
                    } else {
                            _BC.serviceDownMsg(); 
                    }
            }
        }
    });
});



;(function($) {
    var pubsub = {
        cache:{},
        publish: function(topic, args){
            this.cache[topic] && j171.each(this.cache[topic], function(){
                this.apply($, args || []);
            });
        },
        subscribe: function(topic, callback){
            if(!this.cache[topic]){
                this.cache[topic] = [];
            }
            this.cache[topic].push(callback);
            return [topic, callback];
        },
        unsubscribe: function(handle){
            var t = handle[0];
            this.cache[t] && j171.each(this.cache[t], function(idx){
                if(this == handle[1]){
                    this.cache[t].splice(idx, 1);
                }
            });
        }
    };
    j171.extend(true, window._BC, pubsub);
})(jQuery);


j171(function () {
    if(!j171.support.placeholder) { 
        var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');
        var active = document.activeElement;
        var $tosAgreeCheckbox = j171("#tosAgree").find("input[type=checkbox]");

        j171(':text').focus(function () {
            if (j171(this).attr('placeholder') != '' && j171(this).val() == j171(this).attr('placeholder')) {
                j171(this).val('').removeClass('hasPlaceholder');
            }
        }).blur(function () {
            if (j171(this).attr('placeholder') != '' && (j171(this).val() == '' || j171(this).val() == j171(this).attr('placeholder'))) {
                j171(this).val(j171(this).attr('placeholder')).addClass('hasPlaceholder');
            }
        });
        j171('body').on(clickEventType, $tosAgreeCheckbox, function () {            
                var inputs = j171(this).closest('div.finra-bc-widget').find('div.autocomplete-container').children('input');
                if (j171(this).attr('checked')) {
                    j171(this).closest('div.finra-bc-widget').find('div.resultsArea').html('');                    
                    inputs.removeAttr('disabled');
                    inputs.val('Search by Name, Firm, or CRD#');
                } else {                     
                    inputs.attr('disabled', true);
                    inputs.val('Please accept the terms and conditions');                 
                }
            });
        j171(':text').blur();
        j171(active).focus();        
    }  
});


//Namespaced with jQuery 1.7.1 on Oct 10th for finra.org integration from now onwards //$ == j171//

//;(function(j171) {//Added "BC_CREDENTIALS" as source. Rest of the plugin remains same.
    ///////////////////////////////////////////////////////////////////////////
    // S4 service props
    ///////////////////////////////////////////////////////////////////////////
    
    var S4_service = {
        url : 'http://www.google.com',
        maxResultsPerCall : 20,
        sources : {
        //Broker Check
            'BC_INDIVIDUALS_WG': {
                label: 'Individuals',
                columns: [{
                    'title': 'Name', 
                    'value': '{ac_firstname} {ac_middlename} {ac_lastname}', 
                    'styles': 's4_colXL'
                },
                {
                    'title': 'CRD', 
                    'value': '{ac_source_id}', 
                    'styles': 's4_colXL'
                },
                {
                    'title': 'Employer', 
                    'value': '{ac_current_employ}', 
                    'styles': 's4_colXL'
                }],
                defaultValue: function(fields, hltFields, luckyObject){
                    var val = '<span style="font-weight:bold">'+ 
                    S4_templates.__getValue(hltFields, fields, 'ac_firstname') + ' ' + S4_templates.__getValue(hltFields, fields, 'ac_middlename') + ' ' + S4_templates.__getValue(hltFields, fields, 'ac_lastname') + '</span> (CRD# '+S4_templates.__getValue(hltFields, fields, 'ac_source_id')+')';

                    
                    
               var curEmployer =  (S4_templates.__getValue(hltFields, fields, 'ac_current_employ') !== '')? S4_templates.__getValue(hltFields, fields, 'ac_current_employ') : '';                       
               var altNms = (hltFields.hasOwnProperty('ac_othernames'))? 'Alternate Name: ' + hltFields['ac_othernames'].convert()  : '';
               var prevEmployer = (hltFields.hasOwnProperty('ac_prev_employ'))? 'Match made to previous employer' : '';
             
               var displayTemplate = '<div class="s4_item-field" style="padding:2px">' + val +'<div style="color:#555;">'+curEmployer+'</div><div class="additive">' + altNms + '</div><div class="additive">'+prevEmployer+'</div></div>';

                    return S4_templates._default(displayTemplate, null, luckyObject);
                }
            },
            'BC_FIRMS_WG':{
                label: 'Firms',
                columns: [{
                    'title': 'Name', 
                    'value': '{ac_firm} ', 
                    'styles': 's4_colXL'
                },
                {
                    'title': 'CRD', 
                    'value': '{ac_source_id}', 
                    'styles': 's4_colXL'
                }],
                defaultValue: function(fields, hltFields, luckyObject){
                    var firmVal = ((hltFields.hasOwnProperty('ac_firm')) ? hltFields['ac_firm'] : fields['ac_firm']);
                    var iaFirmVal = ((hltFields.hasOwnProperty('ac_ia_name')) ? hltFields['ac_ia_name'] : fields['ac_ia_name']);
                    var srcIDs = (hltFields.hasOwnProperty('ac_source_id'))? '(CRD# ' + hltFields['ac_source_id']  + ')' : '';
                    var altNms = (hltFields.hasOwnProperty('ac_alt_names'))? 'Alternate Name: ' + hltFields['ac_alt_names']  : '';
                    var newFirmVal = (firmVal != '') ? firmVal : iaFirmVal;
                    
                    if (firmVal =='') {
                        altNms = '';
                    }   

                    var displayTemplate = '<div class="s4_item-field  style="padding:2px"><span style="font-weight:bold">' + newFirmVal +'</span> ' + srcIDs + '<div class="additive">'+altNms+'</div></div>';

                    return S4_templates._default(displayTemplate, null, luckyObject);
                }
            }
        }
        
    };
    
    String.prototype.convert = function () {
        return this.replace(/[|,]/g, ";"); 
    };

    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    String.prototype.startsWith = function(suffix) {
        return this.indexOf(suffix) == 0;
    };
    
    function removeEmptyArrayElements(arr) { 
        if (!isArray(arr)) {
          return j171.trim(arr);
        } else {
          return j171.map(j171(arr).filter(function(){return this !== undefined && this != null && this != "";}), removeEmptyArrayElements); 
       }
    }
    
    function isArray(obj) {
    // http://stackoverflow.com/a/1058753/1252748
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    var S4_templates = {
        advanced : function(src, header) {
            var tmpl = '<div class="s4_suggestion ' + ((header) ? 's4_hdr' : '') + '">';

            for (var i = 0; i < S4_service.sources[src].columns.length; i++) {
                tmpl += '<div class="s4_item-field ' + S4_service.sources[src].columns[i].styles + '">' + ((header) ? S4_service.sources[src].columns[i].title : S4_service.sources[src].columns[i].value) + '</div>';
            }

            tmpl += '</div>';
            return tmpl;
        },

        _default : function(value, id, lucky) {
            if (lucky != null && lucky != '') {
                var stripid = id.replace(/<(?:.|\n)*?>/gm, '') + lucky.id;
                var base = '<div class="s4_suggestion" onmouseover="j171(\'#' + stripid + '_lucky\').toggleClass(\'s4_lucky s4_lucky_hide\');" onmouseout="j171(\'#' + stripid + '_lucky\').toggleClass(\'s4_lucky s4_lucky_hide\');">';
                base += '<table border=0 style="width:100%;height:16px;"><tr>';
                base += '<td><div class="s4_item-field">' + value + '</div></td>';
                if (id != null && id != '') {
                    base += '<td style="width: 11%;"><div class="s4_item-field s4_colS" style="text-align:right;">' + id + '</div></td>';
                }
                base += '<td style="width: 22%;">';
                base += '<div class="s4_item-field s4_lucky_hide" id="' + stripid + '_lucky" style="text-align:right;float:right;width:100%" >' + lucky.linktext + '</div>';
                base += '</td>';
                base += '</div>';
                return base;
            } else {
                return '<div class="s4_suggestion">' + ((id == null) ? ('<div class="s4_item-field" style="width: 95%;">' + value + '</div>' ) : ('<div class="s4_item-field s4_colS" style="text-align: right; float: right;">' + id + '</div>' + '<div class="s4_item-field" style="width: 75%;">' + value + '</div>' )) + '</div>';
            }
        },
        // if key is present in mainSrc return. Else return value from altSrc.
        __getValue : function(mainSrc, altSrc, key) {
            return ((mainSrc.hasOwnProperty(key)) ? mainSrc[key] : (altSrc.hasOwnProperty(key) ? altSrc[key] : ''));
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    // plugin defaults
    ///////////////////////////////////////////////////////////////////////////
    var defaults = {
        'serviceURL' : S4_service.url,
        'pageSize' : 10,
        'highlight' : true,
        'seperator' : ';',
        'multipleInputs' : false,
        'lockFilters' : false,
        'selection' : '',
        'disableAdvancedMode' : false,
        'dropdownOrientation' : 'none',
        'displayCount': true,//show or hide individual/firm count
        'select' : function() {
        },
        'open' : function() {
        },
        'close' : function() {
        },
        'change' : function() {
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    // trim has only been added in JS v 1.8.1 which of course IE 7 does not support.
    ///////////////////////////////////////////////////////////////////////////
    String.prototype.trim = function() {
        return this.replace(/^\s\s*/, '').replace(/\s\s*j171/, '');
    };
    

    ///////////////////////////////////////////////////////////////////////////
    // convert string to title case
    ///////////////////////////////////////////////////////////////////////////
    function toTitleCase(str) {
        return str.toLowerCase().replace(/(?:^|\s|\>)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    // Extend the default autocomplete to display items by category
    // src: http://jqueryui.com/demos/autocomplete/categories.html
    ///////////////////////////////////////////////////////////////////////////
    j171.widget("custom.autocomplete_by_category", j171.ui.autocomplete, {
        _renderMenu : function(ul, items) {
            var that = this;
            ul.setSkin({
				theme:"fnrw finraskin"
			});

            j171.each(items, function(index, item) {
                if ((item.type === "header") || (item.type === "footer") || (item.type === "help")) {
                    ul.append(item.label);
                } else {
                    that._renderItem(ul, item);
                }
            });


        },
        _renderItem : function(ul, item) {
            //  console.log(this.element);
            // only change here was to replace .text() with .html()            
            j171("<li></li>").data("item.autocomplete", item).append(j171("<a></a>").html(item.label)).appendTo(ul);
            j171(ul).appendTo('#finra-bc-widget');
            return j171(ul);            
        }, 
        _response   : function(contents){
              j171.ui.autocomplete.prototype._response.apply(this, arguments);
              j171(this.element).trigger("autocompletesearchcomplete", [contents]);
        }
    });
	
	(function ( $ ) {
		$.fn.setSkin = function(options){
				
			var defaults = {theme: "fnrw"};	
			var settings = $.extend({}, defaults, options );			
			
			this.each(function() {
					var elem = $( this );
					elem.addClass(settings.theme);
			});

			return this;
		}
	}( j171 ));
    
   
    ///////////////////////////////////////////////////////////////////////////
    // plugin methods
    ///////////////////////////////////////////////////////////////////////////
    var methods = {
        init : function(options) {
            var props = j171.extend({}, defaults, options);

            // define, init and store runtime properties
            props = j171.extend(props, {
                useCachedResults : false,
                inAdvancedMode : false,
                searchTerm : '',
                input : [], // tokenized search terms - if we allow multiples
                scrollHeight : 0,
                availableSourceKeys : [],
                sourceKeys : [],
                textBoxID : j171(this).attr('id'),
                keyDownHandlerAdded : false,
                subsetMode : false,
                firmsSelected: false
            });

            // convenience property that stores all the sources' keys.
            j171.each(props.sources, function(key, value) {
                props.availableSourceKeys.push(key);
                props.sourceKeys.push(key);
            });

            // save data
            this.data(props);

            __initFilters(this);
            __setup(this);
        },

        switchSource : function(sources) {
            for (var i = 0; i < sources.length; i++) {
                if (j171.inArray(sources[i], this.data('availableSourceKeys')) === -1) {
                    j171.error('Invalid source specified - ' + sources[i]);
                    return;
                }
            }
            this.data('sourceKeys', sources);
            this.data('subsetMode', true);
        },

        remove : function() {                           
            this.autocomplete_by_category('destroy');
            this.removeData('autocomplete');
        },

        getPopup : function() {
            return this.autocomplete_by_category('widget');
        },

        getRawResults : function() {
            return this.data('results').resultMap;
        },
        getAutoComplete: function() {            
            return this;
        },

        getServiceDetails : function() {
            return S4_service;
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    // plugin entry point
    ///////////////////////////////////////////////////////////////////////////
    j171.fn.s4_autocomplete = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ( typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            j171.error('Method ' + method + ' does not exist.');
        }
    };

    // filters for a source are defined in the 'filters' hash
    // runtime filters are stored in the 'selectedFilters' hash - which has to be
    // initialized.
    function __initFilters(that) {
        var srcKeys = that.data('sourceKeys'), sources = that.data('sources');

        if (srcKeys !== null && srcKeys !== undefined) {
            for (var i = 0; i < srcKeys.length; i++) {
                if (sources[srcKeys[i]].hasOwnProperty('filters')) {
                    sources[srcKeys[i]].selectedFilters = j171.extend({}, sources[srcKeys[i]].filters);
                } else {
                    sources[srcKeys[i]].selectedFilters = {};
                }
            }
        }

        that.data('sources', sources);
    };

    function debounce(fn, delay) {
      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    ///////////////////////////////////////////////////////////////////////////
    function __setup(that) {
        var autocompleteCallee = debounce(function(request, response){
                var inputs, searchTerm;
                // tokenize search terms if we allow multiples
                if (that.data('multipleInputs')) {
                    inputs = request.term.split(that.data('seperator'));
                    that.data('input', inputs);
                    // save
                    searchTerm = inputs[inputs.length - 1].trim();
                    // we'll only search on the last token
                } else {
                    searchTerm = request.term.trim();
                }
				
                that.data('searchTerm', searchTerm);
                //save
                if (searchTerm.length > 0) {
                    if (!that.data('useCachedResults')) {
                        var results = new TypeAheadResults(that);
                        var filters = __getFilters(that);						
                        var dataObj = [];
					
						dataObj.push({ name : "sources" ,"value" : that.data('sourceKeys').join(',')});
						dataObj.push({name : "results", "value" : that.data('pageSize')});
						dataObj.push({name : "hl" , "value" : that.data('highlight')});
						dataObj.push({ name : "query", "value" : searchTerm});
						dataObj = j171.merge(dataObj,filters);                     

                            j171.ajax({
                                url : that.data('serviceURL'),
                                dataType : 'jsonp',
                                jsonp : 'json.wrf',
                                timeout : 2000,
                                traditional : true, // needed since we can have multiple filters with same param name
                                data : dataObj,                         
                                success : function(data) {
                                    if (data.errorCode === 0) {
                                        // save results
                                        j171.each(data.results, function(src, resultMap) {
                                            results.add(src, resultMap.totalResults, resultMap.results);
                                        });

                                        that.data('results', results);
										localStorage.setItem( 'results',  JSON.stringify(results) );
                                        response(results.getDisplayList());
                                        setTabs(that);
                                    }
									
									localStorage.setItem( 'IndividualsTotal', results.resultMap.BC_INDIVIDUALS_WG.total);
									localStorage.setItem( 'FirmsTotal', results.resultMap.BC_FIRMS_WG.total);
                                    var optsTotal = results.resultMap.BC_FIRMS_WG.total + results.resultMap.BC_INDIVIDUALS_WG.total;
                                    if(_BC.enterHit == true)
                                        _BC.publish('/bc/results', [optsTotal]);
                                    else
                                        _BC.unsubscribe('/bc/results');
                                }
                        });
                    } else {						
					
						//that.data('sourceKeys', 'BC_INDIVIDUALS_WG');
                        // the more link was clicked. so just use the updated result set						
						response(that.data('results').getDisplayList());
                        setTabs(that);
                    }
                }
        }, 250);

        that.autocomplete_by_category({
            autoFocus : false,
            delay : 0,
            minLength : 2,
            position : {
                'collision': that.data('dropdownOrientation')
            },
            source : function(request, response) {
                autocompleteCallee(request, response);				
            },

            // once the popup opens attach click handlers to any "more" links
            open : function(event, ui) {
                that.data('selection', '');
                // new list of suggestions
                popup = that.autocomplete_by_category('widget')[0];
                var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');
                var sourceKeys = that.data('sourceKeys');
                var textBoxID = that.data('textBoxID');
                var luckyList = that.data('luckyList');

                j171(popup).css({"width": j171("#"+textBoxID).width() + 6});//Add border-radius to width

                j171(popup).find('.Firms').nextAll().css("display", "none");
                
                j171('.scrollTop').on('click touchend', function(evt){//Firms tab clicked
                        evt.stopPropagation();
                        that.data('firmsSelected', true);
                        j171('.scrollDown').removeClass('s4_category');
                        j171('.scrollTop').addClass('s4_category');//,{"height": "0"}, {"line-height": "0"}, {"font-size": "0"}
                        j171('.ui-autocomplete').find('.Individuals').css({"float":"none"});
                        j171(popup).find('.Individuals').nextUntil(".Firms").css({"display":"none"});
                        j171(popup).find('.Firms').nextAll().css("display", "block");
                });
                
                j171('.scrollDown').on('click touchend', function(evt){//Individuals tab clicked
                        evt.stopPropagation();                      
                        that.data('firmsSelected', false);
                        j171('.scrollTop').removeClass('s4_category');
                        j171('.scrollDown').addClass('s4_category');
                        j171('.ui-autocomplete').find('.Firms').css({"float":"none"});
                        j171(popup).find('.Individuals').nextUntil(".Firms").css({"display": "block"});
                        j171(popup).find('.Firms').nextAll().css("display", "none");
                });

                for (var j = 0; j < sourceKeys.length; j++) {
                    var src = sourceKeys[j];

                    // if a "more" link exists for this src
                    if (j171("#" + textBoxID + src + "_more").length) {                        
                        __addMoreLinkClickHandler(that, textBoxID + src + "_more", src);
                    }

                    // if a "advanced" link exists
                    if (j171("#" + textBoxID + src + "_more_advanced").length) {
                        __addAdvancedLinkClickHandler(that, textBoxID + src + "_more_advanced", src);
                    }

                    //TODO if "lucky" link exists

                    // if filters exist for this src and a select box exists add a selection handler.
                    // only available in advancedMode
                    if (that.data('inAdvancedMode') && S4_service.sources[src].hasOwnProperty('filters')) {
                        j171.each(S4_service.sources[src]['filters'], function(filterKey, value) {
                            if (j171("#" + textBoxID + src + filterKey + "_filter").length) {
                                __addFilterSelectionHandler(that, textBoxID + src + filterKey + '_filter', src, filterKey);
                            }
                        });
                    }
                }

                for (var j = 0; j < luckyList.length; j++) {
                    var lucky = luckyList[j];
                    j171('#' + lucky.id + lucky.identifier + '_lucky').on(clickEventType, {
                        'lucky' : lucky
                    }, function(e) {
                        var lucky = e.data.lucky;
                        lucky.callback(lucky.src, lucky.id, lucky.fields);
                        e.stopPropagation();
                        that.autocomplete_by_category('close');
                    });
                }

                // add any required key down handlers
                __addKeyDownHandler(that);

                // try to scroll to top of the new page.
                if (that.data('useCachedResults')) {
                    if (that.data('scrollHeight') > 0) {
                        j171(popup).scrollTop(that.data('scrollHeight'));
                    }
                    that.data('scrollHeight', popup.scrollHeight);
                }

                // reset
                that.data('useCachedResults', false);

                // after any action make sure that the focus is in the textbox
                // so user can continue typing
                that.autocomplete_by_category('ui').focus();

                // call any 'open' handlers
                that.data('open')(that.data('inAdvancedMode'));
            },
            select : function(event, ui) {
                that.data('selection', ui.item.id);
                that.data('select')(ui.item.src, ui.item.id, ui.item.fields);
            },
            change : function(event, ui) {                 
                if (!ui.item) {
                    try{
                        that.data('change')(that.data('searchTerm'));
                    }catch(err){
                        if ('console' in self && 'log' in console)
                        console.log('search input field disabled');
                    }   
                } else {
                    that.data('change')(that.data('searchTerm'), ui.item.src, ui.item.id, ui.item.fields);
                }
            },
            // cleanup
            close : function(event, ui) {
                // call any close handler
                that.data('close')();

                // reset state
                if (!that.data('subsetMode')) {
                    that.data('sourceKeys', that.data('availableSourceKeys'));
                }
                that.data('inAdvancedMode', false);
                that.data('useCachedResults', false);
                that.data('inAdvancedMode', false);
                that.data('input', []);
                that.data('scrollHeight', 0);
                that.data('results', new TypeAheadResults(that));
                that.data('searchTerm', '');
                that.data('firmsSelected', false);

                __initFilters(that);

                j171('ul.ui-autocomplete').removeClass('ui-autocomplete-advanced');
            }
        }).focus(function(){           
            if(j171(this).val().length && j171(this).val() !== j171(this).attr('placeholder')){
				j171(this).data('searchTerm', j171(this).val());				
				j171(this).autocomplete_by_category('widget').css("display", "block");
                return false;
            }
        });

    }

    // get filter list for the sources
    function __getFilters(that) {
        var jsonResult='{', srcKeys = that.data('sourceKeys'), sources = that.data('sources');
        var list = [];

        for (var i = 0; i < srcKeys.length; i++) {
            if (sources[srcKeys[i]].hasOwnProperty('selectedFilters')) {
                var source = srcKeys[i];
                j171.each(sources[srcKeys[i]].selectedFilters, function(filter, value) {
                    if ((value !== 'All') && (value !== 'Any') && (value !== 'N/A')) {// "All" is just a UI label. It really means there is no filter.
                        var filterVal = {name : 'filter.' + source , value : filter  + ':' +  value };
                        list.push(filterVal);                        
                    }
                });
            }
        }
        return list;
    };

    // handler will make an ajax request to get one more page of matches for that src
    function __addMoreLinkClickHandler(that, linkid, moreSrc) {
        var flag = false;
        var clickEventType  = 'touchstart click';

         j171("#" + linkid).on(clickEventType, function(e) {
            if (!flag) {
                flag = true;
                setTimeout(function(){ flag = false; }, 100);
                __getMoreResults(that, moreSrc);
            }
            return false;
        });
    };

    // handler will make an ajax request to get one more page of matches for that src
    /***We are using this and not the one above****/

    function __addAdvancedLinkClickHandler(that, linkid, moreSrc) {
        var flag = false;
        var clickEventType  = 'touchstart click';

         j171("#" + linkid).on(clickEventType, function(e) {           
            //we only want to focus on one src.
            var typedValue = j171(that).data('keyTerm');       
            
            if (that.data('disableAdvancedMode')) {
                 if (!flag) {
                    flag = true;
                    setTimeout(function(){ flag = false; }, 100);
                    __getMoreResults(that, moreSrc);
                }
            } else {
                __switchToAdvancedMode(that, moreSrc);
            }
            return false;
        });
		
    };

    // we are interested in 2 keydown events for now.
    // the RIGHT key will switch to advanced mode.
    // the LEFT will switch back to normal mode.
    // only if advancedMode is enabled in setup
	

    function __addKeyDownHandler(that) {		
		if (!that.data('disableAdvancedMode')) {
            if (!that.data('keyDownHandlerAdded')) {									
				that.autocomplete_by_category('ui').on('keydown', function(event) {
                    // if the popup is open
                    if (that.autocomplete_by_category('widget').css("display") !== "none") {
                        var keyCode = j171.ui.keyCode;
                        switch( event.keyCode ) {
                            case keyCode.RIGHT:
                                if (!that.data('inAdvancedMode')) {
                                    __switchToAdvancedMode(that);
                                    //To prevent default of cursor movement
                                    return false;
                                }else{
                                    return true;
                                }
                            case keyCode.LEFT:
                                if (that.data('inAdvancedMode')) {
                                    __switchToNormalMode(that);
                                    //To prevent default of cursor movement
                                    return false;
                                }else{
                                    return true;
                                }
                            case keyCode.ENTER: //added new logic to close on enter key press                                                        
                                that.autocomplete_by_category('close');
                                //return true;
                        }
                    }
        });				
		
                that.data('keyDownHandlerAdded', true);
            }
        }   
};

    // if the src has any filters displayed then add a handler to catch the value change
    // upon value change store in props
    function __addFilterSelectionHandler(that, selectId, src, filterKey) {
        j171("#" + selectId).change(function(e) {
            if (!that.data('sources')[src].hasOwnProperty('selectedFilters')) {
                that.data('sources')[src]['selectedFilters'] = {};
            }
            that.data('sources')[src]['selectedFilters'][filterKey] = j171(this).val();

            that.autocomplete_by_category('search');
        });
    };

    function __switchToAdvancedMode(that, moreSrc) {
        if (!that.data('inAdvancedMode')) {
            j171('ul.ui-autocomplete').addClass('ui-autocomplete-advanced');
            that.data('inAdvancedMode', true);
            that.data('useCachedResults', true);

            if (moreSrc != undefined) {
                __getMoreResults(that, moreSrc);
            } else {
                that.autocomplete_by_category('search');
            }
        }
    };

    function __switchToNormalMode(that, moreSrc) {
        if (that.data('inAdvancedMode')) {
            j171('ul.ui-autocomplete').removeClass('ui-autocomplete-advanced');
            that.data('inAdvancedMode', false);
            that.data('useCachedResults', true);
            that.autocomplete_by_category('search');
        }
    };

    function __getMoreResults(that, moreSrc) {
        var filters = __getFilters(that);
                            
        var dataObj = [];
        dataObj.push({ name : "sources" ,"value" : moreSrc});
        dataObj.push({ name : "results", "value" : S4_service.maxResultsPerCall});
        dataObj.push({ name : "hl" , "value" : that.data('highlight')});
        dataObj.push({ name : "query", "value" : that.data('searchTerm')});
		try{
			dataObj.push({ name : "start", "value" : that.data('results').resultMap[moreSrc].list.length});		
		}catch(e){
			dataObj.push({ name : "start", "value" : JSON.parse(localStorage.getItem('results')).resultMap[moreSrc].list.length});
		}        
		
        dataObj = j171.merge(dataObj,filters);
		
        j171.ajax({
            url : that.data('serviceURL'),
            dataType : 'jsonp',
            jsonp : 'json.wrf',
            timeout : 2000,
            traditional : true,
            data : dataObj,
            // get and save more results.
            // then programmatically invoke the auto-complete search on the input box
            success : function(data) {
                if (data.errorCode === 0) {
                    that.data('useCachedResults', true);
                    that.data('results').add(moreSrc, data.results[moreSrc].totalResults, data.results[moreSrc].results);
                    that.autocomplete_by_category('search');
                    setTabs(that);                    
                }
            }
        });
    };


    function setTabs(that){
            var inputEle = that;
            var popup = inputEle.autocomplete_by_category('widget')[0];           
                     
            if(inputEle.data('firmsSelected')){             
                j171('.ui-autocomplete').find('.Individuals').css({"float":"none"});
                j171(popup).find('.Individuals').nextUntil(".Firms").css("display", "none");
                j171(popup).find('.Firms').nextAll().css("display", "block");
            }else{              
                j171('.ui-autocomplete').find('.Firms').css({"float":"none"});
                j171(popup).find('.Individuals').nextUntil(".Firms").css("display", "block");
                j171(popup).find('.Firms').nextAll().css("display", "none");
            }			
    }
    // util method to substitute params in a string
    // first attempts to get fields from src. if not available uses altSrc
    //
    // support conditional tokens: if token is of the form {key:str} then
    // a check is made to see if key exists in either src or altsrc. If yes,
    // then 'str' is substituted for the token. if no, token is blanked.
    //
    // if value is an array it's joined into a multiline string with <br />
    function __substituteTokens(str, src, altSrc) {
        var fields = str.match(/\{(.*?)\}/g);
        // get tokens: format - {fieldname}
        var numOfFields = fields.length;

        for (var i = 0; i < numOfFields; i++) {
            var token = fields[i].slice(1, fields[i].length - 1);
            // trim the {} to get token

            // if this is a conditional token
            if (/:/.test(token)) {
                var split = token.split(':');
                var fieldToken = split[0];
                if(fieldToken.startsWith('!')) {
                    fieldToken = fieldToken.substr(1);
                    if ((src != undefined && src.hasOwnProperty(fieldToken)) || (altSrc != undefined && altSrc.hasOwnProperty(fieldToken))) {
                        str = str.replace(fields[i], '');
                    } else {
                        str = str.replace(fields[i], split[1]);
                    }
                }
                else {
                    if ((src != undefined && src.hasOwnProperty(fieldToken)) || (altSrc != undefined && altSrc.hasOwnProperty(fieldToken))) {
                        str = str.replace(fields[i], split[1]);
                    } else {
                        str = str.replace(fields[i], '');
                    }
                }
            } else {
                var value = '&nbsp;';

                if (src != undefined && src.hasOwnProperty(token)) {
                    value = src[token];
                    if ( value instanceof Array) {
                        value = removeEmptyArrayElements(value);
                        value = ((value.length == 0)?  '&nbsp;' : value.join('<br />'));
                    }
                } else if (altSrc != undefined && altSrc.hasOwnProperty(token)) {
                    value = altSrc[token];
                    if ( value instanceof Array) {
                        value = removeEmptyArrayElements(value);
                        value = ((value.length == 0)?  '&nbsp;' : value.join('<br />'));
                    }
                }

                str = str.replace(fields[i], value);
            }
        }

        return str;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // store results. also format for display
    //////////////////////////////////////////////////////////////////////////////////
    function TypeAheadResults(that) {
        this.that = that;
        this.resultMap = {};
    };

    TypeAheadResults.prototype.add = function(src, totalResults, newResults) {
        if (!this.resultMap.hasOwnProperty(src)) {
            this.resultMap[src] = {};
            this.resultMap[src].list = [];
        }

        this.resultMap[src].total = totalResults;
        this.resultMap[src].list = this.resultMap[src].list.concat(newResults);        
    };

    //
    // for each list item generate the UI snippet
    //
    TypeAheadResults.prototype.getDisplayList = function() {
        var textField = this.that;
        var input = this.that.data('input');
        var advancedMode = this.that.data('inAdvancedMode');
        var sourceKeys = this.that.data('sourceKeys');
        var sources = this.that.data('sources');
        var displayCount = this.that.data('displayCount');

        var list = [];     
        var numOfSources = sourceKeys.length;      
        var prefix = "";
        var luckyList = [];

        for (var i = 0; i < numOfSources; i++) {
            var src = sourceKeys[i];
            if(src === "BC_INDIVIDUALS_WG")
				var indvlcount = this.resultMap[src] != undefined ? this.resultMap[src].total : parseInt(localStorage.getItem('IndividualsTotal'));				
            else
				var firmscount = this.resultMap[src] != undefined ? this.resultMap[src].total : parseInt(localStorage.getItem('FirmsTotal')); 		
        }            

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function displayCounter(param, count){
            if(displayCount){
                return param + ' (' + count + ')';
            }else{
                return param;
            }
        }

        indvlcount = numberWithCommas(indvlcount);
        firmscount = numberWithCommas(firmscount);        

        if (advancedMode || (numOfSources > 1)) {
                var header = '<div class="ui-autocomplete-category">';
                if(this.that.data('firmsSelected'))
                    header += '<span class="scrollDown marginLR">'+displayCounter('Individuals', indvlcount)+'</span><span class="marginLR s4_category scrollTop">'+displayCounter('Firms', firmscount)+'</span>';  
                else
                    header += '<span class="s4_category scrollDown marginLR">'+displayCounter('Individuals', indvlcount)+'</span><span class="marginLR scrollTop">'+displayCounter('Firms', firmscount)+'</span>';  
                header += '</div>';
                
            list.push({
                label : header,
                type : "header"
            });
        }   
        // if we allowed multiple inputs then the search was done only on the last token.
        // in which case we need to preserve the n - 1 tokens and prefix it to the
        // suggested/selected match for the last one
        if (this.that.data('multipleInputs') && (input.length > 1)) {
            prefix = (input.slice(0, input.length - 1).join(this.that.data('seperator')) + this.that.data('seperator') + " ");
        }

         j171('body').on('click', '.trySearch', function(event){
                event.preventDefault();
                if(!j171.support.placeholder)
                    j171(textField).val('Search by Name, Firm, or CRD#');    
                j171(textField).attr('placeholder','Search by Name, Firm, or CRD#');               
                j171(textField).autocomplete_by_category('close'); 
                j171('.ui-autocomplete-input-clear').hide();
                j171(textField).focus();               
        });
     
        for (var i = 0; i < numOfSources; i++) {
            var src = sourceKeys[i];           
            var srcResults = this.resultMap[src] != undefined ? this.resultMap[src].list :  JSON.parse(localStorage.getItem('results')).resultMap[src].list;
            var numOfResults = srcResults.length;        
            
            // No Results logic
            if (numOfResults == 0) {
                // category header: only display if there is more than one source or in advanced mode
                if (numOfSources) {
                    var header = '<li class="ui-autocomplete-category '+S4_service.sources[src].label+'">&nbsp;';
                    header += '</li>';

                    list.push({
                        label : header,
                        type : "header"
                    });
                }

                var suggestion = 'No Results ';               
                var sanitizedInput = " for "+ escapeHTML(j171(this.that).val());

                list.push({
                        type : 'help',
                        label : '<li class="noresults">' + suggestion + sanitizedInput + '.</li><p class="noResultsLink"><a class="trySearch" href="#">Try your search again</a></p>'
                });     


                if (sources[src].lucky != null) {
                        luckyList.push({
                            src : src,
                            id : __substituteTokens('{ac_source_id}', srcResults[j].fields),
                            callback : sources[src].lucky.callback,
                            identifier : sources[src].lucky.id,
                            fields : srcResults[j].fields
                        });
                }       

                this.that.data('luckyList', luckyList);
            }//end No Results logic
                

            // only display if there are results
            if (numOfResults > 0) {
                // category header: only display if there is more than one source or in advanced mode
                if (advancedMode || (numOfSources > 1)) {
                    var header = '<li class="ui-autocomplete-category '+S4_service.sources[src].label+'">';

                    header += '</li>';
                    list.push({
                        label : header,
                        type : "header"
                    });
                }
                
                // generate display for each result in the src
                for (var j = 0; j < numOfResults; j++) {
                    var selectionValue = __substituteTokens(sources[src].selectionValue, srcResults[j].fields);
                    var suggestion = '';

                    if (advancedMode) {
                        suggestion = __substituteTokens(S4_templates['advanced'](src), srcResults[j].highlightedFields, srcResults[j].fields);
                    } else {                       
                        suggestion = S4_service['sources'][src].defaultValue(srcResults[j].fields, srcResults[j].highlightedFields, sources[src].lucky);
                    }


                    list.push({
                        label : suggestion.replace(/<em>/g, "<strong>").replace(/<\/em>/g, "</strong>"),
                        id : selectionValue,
                        value : prefix + selectionValue,
                        src : src,
                        fields : srcResults[j].fields
                    });

                    if (sources[src].lucky != null) {
                        luckyList.push({
                            src : src,
                            id : __substituteTokens('{ac_source_id}', srcResults[j].fields),
                            callback : sources[src].lucky.callback,
                            identifier : sources[src].lucky.id,
                            fields : srcResults[j].fields
                        });
                    }
                }//end of inner 'for' loop
                
                this.that.data('luckyList', luckyList);

                // category footer: show a more link if there are more results available
				
				var totalResultMap = this.resultMap[src] != undefined ? this.resultMap[src].total : JSON.parse(localStorage.getItem('results')).resultMap[src].total;
                if (numOfResults < totalResultMap) {                  
                    var footer = '<li class="ui-autocomplete-category-footer">';
                    var moreId = this.that.data('textBoxID') + src + '_more';

                    if (advancedMode) {                  
                        footer += '<div id="' + moreId + '" class="s4_more">View next 20 results</div>';
                    } else {                  
                        if ((totalResultMap - numOfResults) < 20) {
                            footer += '<div id="' + moreId + '_advanced" class="s4_more">View next '+ (totalResultMap - numOfResults) +' results</div>';
                        } else {
                            footer += '<div id="' + moreId + '_advanced" class="s4_more">View next 20 results</div>';   
                        }
                    }

                    footer += '</li>';

                    list.push({
                        id : moreId,
                        label : footer,
                        type : "footer"
                    });
                }            
            }
        }//end of outer 'for' loop
        //_BC.publish('/bc/results', [newArr]); 

        if (!this.that.data('disableAdvancedMode')) {
            if (list.length > 0) {
                var helpText = (advancedMode) ? 'Press <span style="font-size: 150%;">&larr;</span> for less details' : 'Press <span style="font-size: 150%">&rarr;</span> for more details';

                list.push({
                    type : 'help',
                    label : '<li class="ui-autocomplete-help">' + helpText + '</li>'
                });
            }
        }
        return list;
    };

    // for the input src get the filters
    TypeAheadResults.prototype._getFilterControlPanel = function(src) {
        var filterPanel = '';
        var that = this.that;

        // if this src has filters
        if (S4_service.sources[src].hasOwnProperty('filters')) {
            j171.each(S4_service.sources[src]['filters'], function(key, value) {
                var filter = '';

                if (that.data('lockFilters')) {
                    filter = '<div class="s4_filter">' + value['label'] + ': ';

                    if (that.data('sources')[src].hasOwnProperty('selectedFilters') && that.data('sources')[src].selectedFilters.hasOwnProperty(key) && (that.data('sources')[src].selectedFilters[key] === value['values'][i][0])) {
                        filter += value['values'][i][0];
                    } else {
                        filter += 'Any';
                    }

                    filter += '</div>';
                } else {
                    filter = '<div class="s4_filter">' + value['label'] + ': <select id="' + that.data('textBoxID') + src + key + '_filter">';

                    for (var i = 0; i < value['values'].length; i++) {
                        // if filters were defined during initialization, or chosen later, set the selection(s)
                        if (that.data('sources')[src].hasOwnProperty('selectedFilters') && that.data('sources')[src].selectedFilters.hasOwnProperty(key) && (that.data('sources')[src].selectedFilters[key] === value['values'][i][0])) {
                            filter += '<option value="' + value['values'][i][0] + '" selected="selected">' + value['values'][i][1] + '</option>';
                        } else {
                            filter += '<option value="' + value['values'][i][0] + '">' + value['values'][i][1] + '</option>';
                        }
                    }
                    filter += '</select></div>';
                }
                filterPanel += filter;
            });
        }
        return filterPanel;
    };
//})(jQuery);


 function escapeHTML(str){
    if(typeof(toStaticHTML) !== "undefined"){
        var szInput = escapeHTMLFix(str);
        var szStaticHTML = toStaticHTML(szInput);
        str.innerText = szStaticHTML;
    }else{
        var containsHTML = str;
        var temp = document.createElement("div");
        temp.innerHTML = containsHTML;
        var sanitizedInput = temp.textContent || temp.innerText;    
        sanitizedInput = (sanitizedInput != "")? sanitizedInput : "undefined";
        return sanitizedInput
    }    
}
 
function escapeHTMLFix (str) {
	var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function loadtracking() {//external no ga
	window._gaq.push(['FINRA_BC_GA._setAccount', 'UA-8282061-7']);
    window._gaq.push(["_setCustomVar", 1, "HostSite", window.location.hostname, 1]);

	(function() {		
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		
	})();
}

window._gaq = window._gaq || [];
j171(window).load (function(){	//both finra and external with ga
	if (window._gat && typeof _gat != 'undefined') {// when ga.js is loaded already 
		window._gaq.push(['FINRA_BC_GA._setAccount', 'UA-8282061-7']);
        window._gaq.push(["_setCustomVar", 1, "HostSite", window.location.hostname, 1]);
	}
	else{ // when ga.js is not loaded already			
		loadtracking();		
	}	
});

/*
Copyright (c) 2011 Wojo Design
Dual licensed under the MIT or GPL licenses.
*/
(function() {
    var window = this;
    // check to see if we have localStorage or not
    if (!window.localStorage) {

        // globalStorage
        // non-standard: Firefox 2+
        // https://developer.mozilla.org/en/dom/storage#globalStorage
        if (window.globalStorage) {
            // try/catch for file protocol in Firefox
            try {
                window.localStorage = window.globalStorage;
            } catch (e) {}
            return;
        }

        // userData
        // non-standard: IE 5+
        // http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx
        var div = document.createElement("div"),
            attrKey = "localStorage";
        div.style.display = "none";
        document.getElementsByTagName("head")[0].appendChild(div);
        if (div.addBehavior) {
            div.addBehavior("#default#userdata");
            //div.style.behavior = "url('#default#userData')";

            var localStorage = window["localStorage"] = {
                "length": 0,
                "setItem": function(key, value) {
                    div.load(attrKey);
                    key = cleanKey(key);

                    if (!div.getAttribute(key)) {
                        this.length++;
                    }
                    div.setAttribute(key, value);

                    div.save(attrKey);
                },
                "getItem": function(key) {
                    div.load(attrKey);
                    key = cleanKey(key);
                    return div.getAttribute(key);

                },
                "removeItem": function(key) {
                    div.load(attrKey);
                    key = cleanKey(key);
                    div.removeAttribute(key);

                    div.save(attrKey);
                    this.length--;
                    if (this.length < 0) {
                        this.length = 0;
                    }
                },

                "clear": function() {
                    div.load(attrKey);
                    var i = 0;
                    while (attr = div.XMLDocument.documentElement.attributes[i++]) {
                        div.removeAttribute(attr.name);
                    }
                    div.save(attrKey);
                    this.length = 0;
                },

                "key": function(key) {
                    div.load(attrKey);
                    return div.XMLDocument.documentElement.attributes[key];
                }

            },

            // convert invalid characters to dashes
            // http://www.w3.org/TR/REC-xml/#NT-Name
            // simplified to assume the starting character is valid
            cleanKey = function(key) {
                return key.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-");
            };


            div.load(attrKey);
            localStorage["length"] = div.XMLDocument.documentElement.attributes.length;
        }
    }
})();