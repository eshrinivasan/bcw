 
;(function (j171, window, document, undefined) {

j171.fn.BCWidget.setDefaults({
        $mWrap:
          '<div class="finra-bc-widget-outer-wrapper"><div class="finra-bc-widget-inner-wrapper">'+
          '<div id="finra-bc-widget" class="finra-bc-widget">'+
          '<div id="aboutTooltipDiv" style="display:none">'+
          '<div class="centerElement"><span class="closePopup"></span>'+
          '<p><strong>FINRA</strong>--the Financial Industry Regulatory Authority--is an independent, non-governmental regulator for all securities firms doing business with the public in the United States. Our mission is to protect invstors by regulating brokers and brokerage firms and monitoring trading on U.S. stock markets.</p>'+
          '</div></div>'+
          '<div class="finra-bc-widget-common"><a class="showHand" href="http://brokercheck.finra.org"><h3 class="bcHeader">BrokerCheck<sup>&reg;</sup></h3></a>'+
          '<h4>Check the background of an investment professional.</h4>'+
          '<div class="autocomplete-container"><input id="finra_pc_search_box" type="text" maxlength="150" placeholder="Search by Name, Firm, or CRD#" class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"/>'+
          '<div class="ui-autocomplete-input-clear"></div></div>'+
          '<div class="resultsArea"></div>'+
          '<p class="logo"><span id="imgLogo"></span></p></div></div><div class="bcwidgetBottomCover"><span class="bcwidgetBottom"></span></div></div></div>'
});


/* To extend functionality of BCWidget
var extensionMethods = {
    evtHandlers: function(){
        console.log('printing..');
    }
};
 j171.extend(true, j171.fn.BCWidget, extensionMethods);*/

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
                 var indvlcount = this.resultMap[src].total;
                else
                 var firmscount = this.resultMap[src].total;    
            
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
           
            var srcResults = this.resultMap[src].list;
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

                

                var suggestion = 'No Results';
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
                if (numOfResults < this.resultMap[src].total) {
                  
                    var footer = '<li class="ui-autocomplete-category-footer">';
                    var moreId = this.that.data('textBoxID') + src + '_more';

                    if (advancedMode) {
                  
                        footer += '<div id="' + moreId + '" class="s4_more">View next 20 results</div>';
                    } else {
                  
                        if ((this.resultMap[src].total - numOfResults) < 20) {
                            footer += '<div id="' + moreId + '_advanced" class="s4_more">View next '+ (this.resultMap[src].total - numOfResults) +' results</div>';
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
})(jQuery, window, document);    