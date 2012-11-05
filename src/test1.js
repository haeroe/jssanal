
function populateItemData() {
    // ...
    company.getItemProviders(function(data) {
        var div = $j("div#item");
        div.empty();

        jQuery(data).each(function(){
            var html = "<div class='prov' data-id='"+this.id+"'><p>"+ this.name+"</p><img src='"+this.iconUrl+"'/></div>";
            div.append(html);
        });
    });
    // …
}

company.getItemProviders = function(callBack) {
    if (!company.itemProviders) {
        // empty cache, ask from server

        ItemService.getItemProviders(function(data) {
            // store in cache
            company.itemProviders = data;

            // XSS
            jQuery.each(company.itemProviders, function() {
                this.name = esc(this.name);
                this.description = esc(this.description);
                //this.iconUrl = esc(this.iconUrl);   // (vulnerable because of this!)
            });

            // and call me again
            return company.getItemProviders(callBack);
        });
    } else {
        callBack(company.itemProviders);
    }
};
