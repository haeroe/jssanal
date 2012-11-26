var analyze = require('./testUtils');

var doAnalyze = analyze.analyze;

// TODO: verify the results once code produce results
var TOBE_VERIFIED_TRUE  = false
var TOBE_VERIFIED_FALSE = true

exports['ScenarioTest'] = {

    setUp: function(done) {
        console.log("\nScenarioTest setUp!");
        done();
    },
    tearDown: function (done) {
        console.log("\nScenarioTest tearDown!");
        done();    
    },

    'simpleFunctionTest': function(test) {
        var script  = "function getTitleText(){return \"Hello!\";}";
        var results = doAnalyze(script);
        test.expect(1);
        test.ok(TOBE_VERIFIED_TRUE, "message: 'the results TOBE validated'\t " + 
                                    "test source:[" + script + "]");
        test.done();
    },
    'simpleSafeScenarioTest': function(test) {
        var script  = "function getTitleText() { return \"Hello!\"; } " +  
                      "$(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = doAnalyze(script);
        //TODO: check that the results do not contain 
        test.expect(1);
        test.equal(results.safe, true, "message: 'the getTitleText() function call should be safe'\t " + 
                                       "test source:[" + script + "]");    
        test.done();
    },
    'simpleUnSafeScenarioTest': function(test) {
        var script = "function getTitleText() { return \"Hello\" + user.name + \"!\"; }" + 
                     "$(\"div.header\").append(\"<h1>\" + getTitleText() + \"</h1>\");";
        var results = doAnalyze(script);
        //TODO: check that the results do contain
        test.expect(1);
        test.equal(results.safe, false, "message: 'the getTitleText() function call should be UNsafe'\t " + 
                                        "test source:[" + script + "]");    
        test.done();
    },
    'simpleEscapedScenarioTest': function(test) {
        var script = "function getTitleText(){return \"Hello\" + user.name + \"!\";} " + 
                     "$(\"div.header\").append(\"<h1>\" + htmlEscape(getTitleText()) + \"</h1>\");";
        var results = doAnalyze(script);
        //TODO: check that the results do not contain
        test.expect(1);
        test.equal(results.safe, true, "message: 'the getTitleText() function call is unsafe, but escaped and therefore should be safe'\t " + 
                                       "test source:[" + script + "]");    
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
                     "      }); " +
                     "      return company.getItemProviders(callBack); " +
                     "    }); " +
                     "  } else { callBack(company.itemProviders); } " +
                     "}; ";
        var results = doAnalyze(script);
        //TODO: check that the results do contain
        test.expect(1);
        test.ok(TOBE_VERIFIED_TRUE, "message: 'the results TOBE validated'\t " + 
                                    "test source:[" + script + "]");
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
        var results = doAnalyze(script);                                                                                                       
        //TODO: check that the results do contain                                                                                                    
        test.expect(1);                                                                                                                              
        test.ok(TOBE_VERIFIED_TRUE, "message: 'the results TOBE validated'\t " +                                                                     
                                    "test source:[" + script + "]");                                                                                 
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
                     '  var checkbox_part = "<input type=\"checkbox\" class=\"cb\" onclick=\"toggle_select_article(this)\"/>"; ' +
                     '  var date = new Date(article.updated * 1000); ' +
                     '  var date_part = date.toString().substring(0,21); ' +
                     '  var tmp_html = "<li id=\"A-"+article.id+"\" "+style+" class=\""+li_class+"\">" + ' +
                     '                 checkbox_part + icon_part + "<a target=\"_blank\" href=\""+ article.link+"\""+ ' +
                     '                 "onclick=\"return view("+article.id+")\" class=\'title\'>" + article.title + "</a>" + ' +
                     '                 "<div class=\'body\'>" + "<div onclick=\"view("+article.id+")\" class=\'excerpt\'>" + ' +
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
        var results = doAnalyze(script);
        //TODO: check that the results do contain                                                                                                    
        test.expect(1);
        test.ok(TOBE_VERIFIED_TRUE, "message: 'the results TOBE validated'\t " +
                                    "test source:[" + script + "]");
        test.done();
    }

}
