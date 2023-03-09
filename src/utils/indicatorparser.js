class IndicatorParser {
    // Regexes
    constructor() {
        this.domain = new RegExp(/^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)\.)+([A-Za-z]{2,63})$/);
        this.def_domain = new RegExp(/^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)(?:(\[\.\]|\.)))+[A-Za-z]{2,63}$/);
        this.url = new RegExp(/^(?:http[s]?):\/\/((?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,63})\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);
        this.def_url = new RegExp(/^(?:h(xx|XX|tt)p[s]?):\/\/(?:www(?:(\[\.\]|\.)))?(?:[-a-zA-Z0-9@:%_\+~#=]+(\[\.\]|\.))+(?:[a-z]{2,63})\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/)
        this.ip = new RegExp(/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/);
        this.def_ip = new RegExp(/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\[\.\]|\.)){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/);
        this.hash = new RegExp(/(^[a-z0-9]{32}$)|(^[a-z0-9]{40}$)|(^[a-z0-9]{64}$)/); 
        this.email = new RegExp(/^[a-z0-9]+(\.[_a-z0-9]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15}))$/);
        this.def_email = new RegExp(/^[a-z0-9]+((?:\[\.\])[_a-z0-9]+)*(\[at\]|@)([a-z0-9-]+((?:\[\.\]|\.)[a-z0-9-]+)*((?:\[\.\]|\.)[a-z]{2,15}))$/);
        this.internalip = new RegExp(/(^192\.168\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^172\.([1][6-9]|[2][0-9]|[3][0-1])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^10\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5]))|(^127\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)/);
        //this.def_internalip = new RegExp(/(^192(?:\.|\[\.\])168(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^172(?:\.|\[\.\])([1][6-9]|[2][0-9]|[3][0-1])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^10(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5]))|(^127(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])(?:\.|\[\.\])([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)/);
        this.cve = new RegExp(/^CVE-\d{4}-\d{4,7}$/);    
        
        this.countries = ["ad","ae","af","ag","ai","al","am","ao","aq","ar","as","at","au","aw","ax","az","ba","bb","bd","be","bf","bg","bh","bi","bj","bl","bm","bn","bo","bq","br","bs","bt","bv","bw","by","bz","ca","cc","cd","cf","cg","ch","ci","ck","cl","cm","cn","co","cr","cu","cv","cw","cx","cy","cz","de","dj","dk","dm","do","dz","ec","ee","eg","eh","er","es","et","eu","fi","fj","fk","fm","fo","fr","ga","gd","ge","gf","gg","gh","gi","gl","gm","gn","gp","gq","gr","gs","gt","gu","gw","gy","hk","hm","hn","hr","ht","hu","id","ie","il","im","in","io","iq","ir","is","it","je","jm","jo","jp","ke","kg","kh","ki","km","kn","kp","kr","kw","ky","kz","la","lb","lc","li","lk","lr","ls","lt","lu","lv","ly","ma","mc","md","me","mf","mg","mh","mk","ml","mm","mn","mo","mp","mq","mr","ms","mt","mu","mv","mw","mx","my","mz","na","nc","ne","nf","ng","ni","nl","no","np","nr","nu","nz","om","pa","pe","pf","pg","ph","pk","pl","pm","pn","pr","ps","pt","pw","py","qa","re","ro","rs","ru","rw","sa","sb","sc","sd","se","sg","sh","si","sj","sk","sl","sm","sn","so","sr","ss","st","sv","sx","sy","sz","tc","td","tf","tg","th","tj","tk","tl","tm","tn","to","tr","tt","tv","tw","tz","ua","ug","uk","um","us","uy","uz","va","vc","ve","vg","vi","vn","vu","wf","ws","xk","ye","yt","za","zm","zw"];
    }
   

    /**
     * Get the type of the indicator given as parameter
     * @param{indicator} String that may contain an indicator
     * @return Type of the indicator detected, if it is valid
     */
    getIndicatorType(indicator) {

        if(indicator.match(this.domain)) {
            // Extract the tld
            const match = indicator.match(this.domain);
            const tld = match[2];
            const isCountry = this.countries.includes(tld);
            // Check if it is a country
            if(isCountry) {
                return ["domain", tld];
            } else {
                return ["domain", ""];
            }
        } else if(indicator.match(this.ip)) {
            if(indicator.match(this.internalip)){
                return ["internal", ""];
            }
            return ["ip", ""];
        } else if(indicator.match(this.url)) {
            return ["url", ""];
        } else if(indicator.match(this.hash)) {
            return ["hash", ""];
        } else if(indicator.match(this.email)) {
            return ["email", ""];
        } else if(indicator.match(this.cve)) {
            return ["cve", ""];
        }  else if(indicator.match(this.def_domain) || indicator.match(this.def_ip) || 
            indicator.match(this.def_url) || indicator.match(this.def_email)) {
            return ["defanged", ""];
        } else {
            return ["invalid", ""];
        }
    }


    /**
     * Get the original indicator from the defanged one
     * @param{def_indicator} defanged indicator to parse
     * @return Usable indicator that can be used as parameter for queries
     */
    refangIndicator(def_indicator) {
        // If the indicator is an URL, remove the "xx" from "http"
        if(def_indicator.match(this.def_url)) {
            def_indicator = def_indicator.replaceAll("hxxp","http");
        }
        // Remove square brackets
        def_indicator = def_indicator.replaceAll("[", "");
        let ref_indicator = def_indicator.replaceAll("]", "");
        return ref_indicator;
        
    }

    /**
     * Extract domain from url or email
     */
    getDomain(indicator) {
        let groups = indicator.match(this.url);
        if(!groups) {
            groups = indicator.match(this.email);
            if(groups) {
                return groups[2];
            }
        } else {
            return groups[1];
        }
    }

}
