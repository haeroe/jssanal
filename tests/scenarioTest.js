var analyze   = require('./testUtils');

exports['ScenarioTest'] = {

    setUp: function(callback) {
        //console.log("\nScenarioTest setUp!" + callback);
        callback();
    },
    tearDown: function (callback) {
        //console.log("\nScenarioTest tearDown!" + done);
        callback();    
    },
    'simpleFunctionDefinitionScenarioTest': function(test) {
        var script  = 'function getTitleText(){return "Hello!";}';
        var results = analyze.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            console.log("\nsimpleFunctionDefinitionScenarioTest OK! \ntest source: " + script);
        }

        test.expect(6);
        test.equal(results.safeSinkCalls.length, 0, "message: expected results.safeSinkCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, "message: expected results.unsafeSinkCalls.length == 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, "message: expected results.unsafeAssignments.length == 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, "message: expected results.safeAssignments.length == 0 " + "test source:[" + script + "]");   
        test.done();
    },
    'simpleSafeCallScenarioTest': function(test) {
        var script  = "function getTitleText() { return \"Hello!\"; } " +  
                      "$(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = analyze.analyze(script);
       
        var testOk = (results.safeSinkCalls.length === 1) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            console.log("\nsimpleSafeCallScenarioTest OK! \ntest source: " + script);
        }

        test.expect(6);
        test.equal(results.safeSinkCalls.length, 1, "message: expected results.safeSinkCalls.length == 1 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, "message: expected results.unsafeSinkCalls.length == 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, "message: expected results.unsafeAssignments.length == 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, "message: expected results.safeAssignments.length == 0 " + "test source:[" + script + "]");   
        test.done();
    },
    'simpleUnSafeCallScenarioTest': function(test) {
        var script = "function getTitleText() { return \"Hello\" + user.name + \"!\"; }" + 
                     "$(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = analyze.analyze(script);
       
        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 1) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            console.log("\nsimpleUnSafeCallScenarioTest OK! \ntest source: " + script);
        }
 
        test.expect(6);
        test.equal(results.safeSinkCalls.length, 0, "message: expected results.safeSinkCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 1, "message: expected results.unsafeSinkCalls.length == 1 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, "message: expected results.unsafeAssignments.length == 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, "message: expected results.safeAssignments.length == 0 " + "test source:[" + script + "]"); 
        test.done();
    },
    'simpleEscapedScenarioTest': function(test) {
        var script = "function getTitleText(){return \"Hello\" + user.name + \"!\";} " + 
                     "$(\"div.header\").append(\"<h1>\" + htmlEscape(getTitleText()) + \"</h1>\");";
        var results = analyze.analyze(script);
  
        var testOk = (results.safeSinkCalls.length === 1) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            console.log("\nsimpleEscapedScenarioTest OK! \ntest source: " + script);
        }
      
        test.expect(6);
        test.equal(results.safeSinkCalls.length, 1, "message: expected results.safeSinkCalls.length == 1 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, "message: expected results.unsafeSinkCalls.length == 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, "message: expected results.unsafeAssignments.length == 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, "message: expected results.safeAssignments.length == 0 " + "test source:[" + script + "]");  
        test.done();
    },

    // more complex scenario tests
    'completeVulnerableTest': function(test) {
        var script = "function populateItemData() { " + 
                     "  company.getItemProviders(function(data) { " +
                     "    var div = $j(\"div#item\"); div.empty(); " +
                     "    jQuery(data).each(function(){ " +
                     "      var html = \"<div class='prov' data-id='\"+this.id+\"'><p>\"+ this.name+\"</p><img src='\"+this.iconUrl+\"'/></div>\";" +
                     "      div.append(html); }); }); " + 
                     "}" +
                     "company.getItemProviders = function(callBack) { " +
                     "  if (!company.itemProviders) { " +
                     "    ItemService.getItemProviders(function(data) { " +
                     "      company.itemProviders = data; " +
                     "      jQuery.each(company.itemProviders, function() { " +
                     "        this.name = esc(this.name); " +
                     "        this.description = esc(this.description); " +
                     //       this.iconUrl = esc(this.iconUrl); unsafe because of this
                     "      }); " +
                     "      return company.getItemProviders(callBack); " +
                     "    }); " +
                     "  } else { callBack(company.itemProviders); } " +
                     "}; ";
        var results = analyze.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 1) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            console.log("\ncompleteVulnerableTest OK! \ntest source: " + script);
        }

        test.expect(6);
        test.equal(results.safeSinkCalls.length, 0, "message: expected results.safeSinkCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 1, "message: expected results.unsafeSinkCalls.length == 1 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, "message: expected results.unsafeAssignments.length == 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, "message: expected results.safeAssignments.length == 0 " + "test source:[" + script + "]");    
        test.done();
    },

    'completeUnVulnerableTest': function(test) {
        var script = "function populateItemData() { " +
                     "  company.getItemProviders(function(data) { " +
                     '    var div = $j("div#item"); div.empty(); ' +
                     "    jQuery(data).each(function(){ " +
                     "      var html = \"<div class='prov' data-id='\"+this.id+\"'><p>\"+ this.name+\"</p><img src='\"+this.iconUrl+\"'/></div>\";" +
                     "      div.append(html); }); }); " +
                     "}" +
                     "company.getItemProviders = function(callBack) { " +
                     "  if (!company.itemProviders) { " +
                     "    ItemService.getItemProviders(function(data) { " +
                     "      company.itemProviders = data; " +
                     "      jQuery.each(company.itemProviders, function() { " +
                     "        this.name = esc(this.name); " +
                     "        this.description = esc(this.description); " +
                     "        this.iconUrl = esc(this.iconUrl); " + 
                     "      }); " +                                                                                                                  
                     "      return company.getItemProviders(callBack); " +                                                                           
                     "    }); " +                                                                                                                    
                     "  } else { callBack(company.itemProviders); } " +                                                                              
                     "}; ";                                                                                                                          
        var results = analyze.analyze(script);                                                                                                       
        
        var testOk = (results.safeSinkCalls.length === 1) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            console.log("\ncompleteUnVulnerableTest OK! \ntest source: " + script);
        }

        test.expect(6);
        test.equal(results.safeSinkCalls.length, 1, "message: expected results.safeSinkCalls.length == 1' " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, "message: expected results.unsafeSinkCalls.length == 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, "message: expected results.unsafeAssignments.length == 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, "message: expected results.safeAssignments.length == 0 " + "test source:[" + script + "]");          
        test.done();                                                                                                                                 
    },

    'complexVulnerableTest': function(test) {
        var script = 'new Ajax.Request("backend.php", { ' +
                     '  parameters: query, onComplete: function(transport) { ' +
                     '    fatal_error_check(transport); ' +
                     '    parse_headlines(transport, replace, no_effects); ' +
                     '}});' +
                     'function parse_headlines(transport, replace, no_effects) { ' +
                     '  var reply = JSON.parse(transport.responseText); ' + 
                     '  var headlines = reply[\'headlines\'][\'content\']; ' +
                     '  add_headline_entry(headlines[i], ' +
                     '                     find_feed(last_feeds, headlines[i].feed_id), ' + 
                     '                     !no_effects); ' +
                     '}' +
                     'function add_headline_entry(article, feed, no_effects) { ' +
                     '  var icon_part = ""; ' +
                     '  icon_part = "<img class=\'icon\' src=\'" + get_feed_icon(feed) + "\'/>"; ' +
                     '  var style = ""; ' +
                     '  if (article.excerpt.trim() == "") article.excerpt = __("Click to expand article."); ' +
                     '  var li_class = "unread"; ' +
                     '  var fresh_max = getInitParam("fresh_article_max_age") * 60 * 60; ' +
                     '  var d = new Date(); ' +
                     '  if (d.getTime() / 1000 - article.updated < fresh_max) li_class = "fresh"; ' + 
                     '  var checkbox_part = "<input type=\\"checkbox\\" class=\\"cb\\" onclick=\\"toggle_select_article(this)\\"/>"; ' +
                     '  var date = new Date(article.updated * 1000); ' +
                     '  var date_part = date.toString().substring(0,21); ' +
                     '  var tmp_html = "<li id=\\"A-"+article.id+"\\" "+style+" class=\\""+li_class+"\\">" + ' +
                     '                 checkbox_part + icon_part + "<a target=\\"_blank\\" href=\\""+ article.link+"\\""+ ' +
                     '                 "onclick=\\"return view("+article.id+")\\" class=\'title\'>" + article.title + "</a>" + ' +
                     '                 "<div class=\'body\'>" + "<div onclick=\\"view("+article.id+")\\" class=\'excerpt\'>" + ' +
                     '                 article.excerpt + "</div>" + "<div class=\'info\'>"; ' +
                     '  tmp_html += date_part + "</div>" + "</div></li>"; ' +
                     '  $("headlines-content").innerHTML += tmp_html; ' +
                     '} ' +  
                     'function get_feed_icon(feed) { ' +
                     '  if (feed.has_icon) return getInitParam(\'icons_url\') + "/" + feed.id + \'.ico\'; ' +
                     '  if (feed.id == -1) return \'images/mark_set.png\'; ' +
                     '  if (feed.id == -2) return \'images/pub_set.png\'; ' +
                     '  if (feed.id == -3) return \'images/fresh.png\'; ' +
                     '  if (feed.id == -4) return \'images/tag.png\'; ' +
                     '  if (feed.id < -10) return \'images/label.png\'; ' +
                     '  return \'images/blank_icon.gif\'; ' +
                     '}';

        var results = analyze.analyze(script);
        
        var testOk = (results.safeSinkCalls.length > 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length > 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length > 0) &&
                     (results.safeAssignments.length > 0);
        if(testOk) {
            console.log("\ncomplexVulnerableTest OK! \ntest source: " + script);
        }

        test.expect(6);
        test.ok(results.safeSinkCalls.length > 0, "message: expected results.safeSinkCalls.length > 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]"); // should be >0?
        test.ok(results.unsafeSinkCalls.length > 0, "message: expected results.unsafeSinkCalls.length > 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.ok(results.unsafeAssignments.length > 0, "message: expected results.unsafeAssignments.length > 0 " + "test source:[" + script + "]");
        test.ok(results.safeAssignments.length > 0, "message: expected results.safeAssignments.length > 0 " + "test source:[" + script + "]");   
        test.done();
    }
}
