var tUtil = require('./testUtils');

var doVersatile    = true;
var groupTestTitle = 'SCENARIO_TEST';

exports['SCENARIO_TEST'] = {

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
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'simpleFunctionDefinitionScenarioTest', 
                              undefined, script, doVersatile);
        }

        test.expect(6);
        test.equal(results.safeSinkCalls.length, 0, 
                   "message: expected results.safeSinkCalls.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, 
                   "message: expected results.unresolvedCalls.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, 
                   "message: expected results.unsafeSinkCalls.length === 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, 
                   "message: expected results.recursiveExpressions.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, 
                   "message: expected results.unsafeAssignments.length === 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, 
                   "message: expected results.safeAssignments.length === 0 " + "test source:[" + script + "]");   
        test.done();
    },
    'simpleSafeCallScenarioTest': function(test) {
        var script  = "function getTitleText() { return \"Hello!\"; } \n" +  
                      "$(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = tUtil.analyze(script);
       
        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'simpleSafeCallScenarioTest', 
                              undefined, script, doVersatile);
        }

        test.expect(6);
        test.notEqual(results.safeSinkCalls.length, 0, 
                   "message: expected results.safeSinkCalls.length !== 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, 
                   "message: expected results.unresolvedCalls.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, 
                   "message: expected results.unsafeSinkCalls.length === 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, 
                   "message: expected results.recursiveExpressions.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, 
                   "message: expected results.unsafeAssignments.length === 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, 
                   "message: expected results.safeAssignments.length === 0 " + "test source:[" + script + "]");   
        test.done();
    },
    'simpleUnSafeCallScenarioTest': function(test) {
        var script = "function getTitleText() { return \"Hello\" + user.name + \"!\"; } \n" + 
                     "$(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = tUtil.analyze(script);
       
        var testOk = (results.safeSinkCalls.length === 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'simpleUnSafeCallScenarioTest', 
                              undefined, script, doVersatile);
        }
 
        test.expect(6);
        test.equal(results.safeSinkCalls.length, 0, 
                   "message: expected results.safeSinkCalls.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, 
                   "message: expected results.unresolvedCalls.length === 0 " + "test source:[" + script + "]");
        test.notEqual(results.unsafeSinkCalls.length, 0, 
                   "message: expected results.unsafeSinkCalls.length !== 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, 
                   "message: expected results.recursiveExpressions.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, 
                   "message: expected results.unsafeAssignments.length === 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, 
                   "message: expected results.safeAssignments.length === 0 " + "test source:[" + script + "]"); 
        test.done();
    },
    'simpleEscapedScenarioTest': function(test) {
        var script = "function getTitleText(){return \"Hello\" + user.name + \"!\";} \n" + 
                     "$(\"div.header\").append(\"<h1>\" + htmlEscape(getTitleText()) + \"</h1>\");";
        var results = tUtil.analyze(script);
  
        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length === 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'simpleEscapedScenarioTest', 
                              undefined, script, doVersatile);
        }
      
        test.expect(6);
        test.notEqual(results.safeSinkCalls.length, 0, 
                   "message: expected results.safeSinkCalls.length !== 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, 
                   "message: expected results.unresolvedCalls.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, 
                   "message: expected results.unsafeSinkCalls.length === 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, 
                   "message: expected results.recursiveExpressions.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, 
                   "message: expected results.unsafeAssignments.length === 0 " + "test source:[" + script + "]");
        test.equal(results.safeAssignments.length, 0, 
                   "message: expected results.safeAssignments.length === 0 " + "test source:[" + script + "]");  
        test.done();
    },
    // more complex scenario tests
    'completeVulnerableTest': function(test) {
        var script = "function populateItemData() { \n" + 
                     "  company.getItemProviders(function(data) { \n" +
                     "    var div = $j(\"div#item\"); div.empty(); \n" +
                     "    jQuery(data).each(function(){ \n" +
                     "      var html = \"<div class='prov' data-id='\"+this.id+\"'><p>\"+ this.name+\"</p><img src='\"+this.iconUrl+\"'/></div>\"; \n" +
                     "      div.append(html); }); }); \n" + 
                     "} \n" +
                     "company.getItemProviders = function(callBack) { \n" +
                     "  if (!company.itemProviders) { \n" +
                     "    ItemService.getItemProviders(function(data) { \n" +
                     "      company.itemProviders = data; \n" +
                     "      jQuery.each(company.itemProviders, function() { \n" +
                     "        this.name = esc(this.name); \n" +
                     "        this.description = esc(this.description); \n" +
                     //       this.iconUrl = esc(this.iconUrl); unsafe because of this
                     "      }); \n" +
                     "      return company.getItemProviders(callBack); \n" +
                     "    }); \n" +
                     "  } else { callBack(company.itemProviders); } \n" +
                     "}; \n";
        var results = tUtil.analyze(script);

        var testOk = (results.safeSinkCalls.length === 0) &&
                     //(results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length !== 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'completeVulnerableTest', 
                              undefined, script, doVersatile);
        }

        test.expect(6);
        test.equal(results.safeSinkCalls.length, 0, 
                   "message: expected results.safeSinkCalls.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, 
                   "message: expected results.unresolvedCalls.length === 0 " + "test source:[" + script + "]");
        test.notEqual(results.unsafeSinkCalls.length, 0, 
                   "message: expected results.unsafeSinkCalls.length !== 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, 
                   "message: expected results.recursiveExpressions.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, 
                   "message: expected results.unsafeAssignments.length === 0 " + "test source:[" + script + "]");
        test.notEqual(results.safeAssignments.length, 0, 
                   "message: expected results.safeAssignments.length !== 0 " + "test source:[" + script + "]");    
        test.done();
    },
    'completeUnVulnerableTest': function(test) {
        var script = "function populateItemData() { \n" +
                     "  company.getItemProviders(function(data) { \n" +
                     '    var div = $j("div#item"); div.empty(); \n' +
                     "    jQuery(data).each(function(){ \n" +
                     "      var html = \"<div class='prov' data-id='\"+this.id+\"'><p>\"+ this.name+\"</p><img src='\"+this.iconUrl+\"'/></div>\"; \n" +
                     "      div.append(html); }); }); \n" +
                     "}\n" +
                     "company.getItemProviders = function(callBack) { \n" +
                     "  if (!company.itemProviders) { \n" +
                     "    ItemService.getItemProviders(function(data) { \n" +
                     "      company.itemProviders = data; \n" +
                     "      jQuery.each(company.itemProviders, function() { \n" +
                     "        this.name = esc(this.name); \n" +
                     "        this.description = esc(this.description); \n" +
                     "        this.iconUrl = esc(this.iconUrl); \n" + 
                     "      }); \n" +                                                                                                                  
                     "      return company.getItemProviders(callBack); \n" +                                                                           
                     "    }); \n" +                                                                                                                    
                     "  } else { callBack(company.itemProviders); } \n" +                                                                              
                     "}; \n";                                                                                                                          
        var results = tUtil.analyze(script);                                                                                                       
        
        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length === 0) &&
                     (results.unsafeSinkCalls.length === 0) &&
                     (results.recursiveExpressions.length === 0);
                     (results.unsafeAssignments.length === 0) &&
                     (results.safeAssignments.length !== 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'completeUnVulnerableTest', 
                              undefined, script, doVersatile);
        }

        test.expect(6);
        test.notEqual(results.safeSinkCalls.length, 0, 
                   "message: expected results.safeSinkCalls.length !== 0' " + "test source:[" + script + "]");
        test.equal(results.unresolvedCalls.length, 0, 
                   "message: expected results.unresolvedCalls.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeSinkCalls.length, 0, 
                   "message: expected results.unsafeSinkCalls.length === 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, 
                   "message: expected results.recursiveExpressions.length === 0 " + "test source:[" + script + "]");
        test.equal(results.unsafeAssignments.length, 0, 
                   "message: expected results.unsafeAssignments.length === 0 " + "test source:[" + script + "]");
        test.notEqual(results.safeAssignments.length, 0, 
                   "message: expected results.safeAssignments.length !== 0 " + "test source:[" + script + "]");          
        test.done();                                                                                                                                 
    },
    'complexVulnerableTest': function(test) {
        var script = 'new Ajax.Request("backend.php", { \n' +
                     '  parameters: query, onComplete: function(transport) { \n' +
                     '    fatal_error_check(transport); \n' +
                     '    parse_headlines(transport, replace, no_effects); \n' +
                     '}}); \n' +
                     'function parse_headlines(transport, replace, no_effects) { \n' +
                     '  var reply = JSON.parse(transport.responseText); \n' + 
                     '  var headlines = reply[\'headlines\'][\'content\']; \n' +
                     '  add_headline_entry(headlines[i], \n' +
                     '                     find_feed(last_feeds, headlines[i].feed_id), \n' + 
                     '                     !no_effects); \n' +
                     '} \n' +
                     'function add_headline_entry(article, feed, no_effects) { \n' +
                     '  var icon_part = ""; \n' +
                     '  icon_part = "<img class=\'icon\' src=\'" + get_feed_icon(feed) + "\'/>"; \n' +
                     '  var style = ""; \n' +
                     '  if (article.excerpt.trim() == "") article.excerpt = __("Click to expand article."); \n' +
                     '  var li_class = "unread"; \n' +
                     '  var fresh_max = getInitParam("fresh_article_max_age") * 60 * 60; \n' +
                     '  var d = new Date(); \n' +
                     '  if (d.getTime() / 1000 - article.updated < fresh_max) li_class = "fresh"; \n' + 
                     '  var checkbox_part = "<input type=\\"checkbox\\" class=\\"cb\\" onclick=\\"toggle_select_article(this)\\"/>"; \n' +
                     '  var date = new Date(article.updated * 1000); \n' +
                     '  var date_part = date.toString().substring(0,21); \n' +
                     '  var tmp_html = "<li id=\\"A-"+article.id+"\\" "+style+" class=\\""+li_class+"\\">" + \n' +
                     '                 checkbox_part + icon_part + "<a target=\\"_blank\\" href=\\""+ article.link+"\\""+ \n' +
                     '                 "onclick=\\"return view("+article.id+")\\" class=\'title\'>" + article.title + "</a>" + \n' +
                     '                 "<div class=\'body\'>" + "<div onclick=\\"view("+article.id+")\\" class=\'excerpt\'>" + \n' +
                     '                 article.excerpt + "</div>" + "<div class=\'info\'>"; \n' +
                     '  tmp_html += date_part + "</div>" + "</div></li>"; \n' +
                     '  $("headlines-content").innerHTML += tmp_html; \n' +
                     '} \n' +  
                     'function get_feed_icon(feed) { \n' +
                     '  if (feed.has_icon) return getInitParam(\'icons_url\') + "/" + feed.id + \'.ico\'; \n' +
                     '  if (feed.id == -1) return \'images/mark_set.png\'; \n' +
                     '  if (feed.id == -2) return \'images/pub_set.png\'; \n' +
                     '  if (feed.id == -3) return \'images/fresh.png\'; \n' +
                     '  if (feed.id == -4) return \'images/tag.png\'; \n' +
                     '  if (feed.id < -10) return \'images/label.png\'; \n' +
                     '  return \'images/blank_icon.gif\'; \n' +
                     '} \n';

        var results = tUtil.analyze(script);
        
        var testOk = (results.safeSinkCalls.length !== 0) &&
                     (results.unresolvedCalls.length !== 0) &&
                     (results.unsafeSinkCalls.length !== 0) &&
                     (results.recursiveExpressions.length === 0) &&
                     (results.unsafeAssignments.length !== 0) &&
                     (results.safeAssignments.length !== 0);
        if(testOk) {
            tUtil.printTestOK(groupTestTitle, 
                              'complexVulnerableTest', 
                              undefined, script, doVersatile);
        }

        test.expect(6);
        test.ok((results.safeSinkCalls.length !== 0), 
                "message: expected results.safeSinkCalls.length > 0 " + "test source:[" + script + "]");
        //test.equal(results.unresolvedCalls.length, 0,
        test.ok((results.unresolvedCalls.length !== 0), 
                "message: expected results.unresolvedCalls.length == 0 " + "test source:[" + script + "]"); // should be >0?
        test.ok((results.unsafeSinkCalls.length !== 0), 
                "message: expected results.unsafeSinkCalls.length > 0 " + "test source:[" + script + "]");                                     
        test.equal(results.recursiveExpressions.length, 0, 
                "message: expected results.recursiveExpressions.length == 0 " + "test source:[" + script + "]");
        test.ok((results.unsafeAssignments.length !== 0), 
                "message: expected results.unsafeAssignments.length > 0 " + "test source:[" + script + "]");
        test.ok((results.safeAssignments.length !== 0), 
                "message: expected results.safeAssignments.length > 0 " + "test source:[" + script + "]");   
        test.done();
    }
}
