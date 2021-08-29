class IndicatorTypeDetector {
    // Regexes
    constructor() {
        this.domain =new RegExp(/^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/);
        this.url=new RegExp(/^(?:http(?:s)?:\/\/)([\w.-]+(?:\.[\w\.-]+)+)[\w\-\._~:/?#[\]@!\$&'\(\)\*\+\,\;\=\.]+$/);
        this.ip = new RegExp(/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/);
        this.hash = new RegExp(/(^[a-z0-9]{32}$)|(^[a-z0-9]{40}$)|(^[a-z0-9]{64}$)/); 
        this.email = new RegExp(/^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/);
        this.internalip = new RegExp(/(^192\.168\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^172\.([1][6-9]|[2][0-9]|[3][0-1])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^10\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5]))|(^127\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)/);
        this.cve = new RegExp(/^CVE-\d{4}-\d{4,7}$/);    
    }
   
    /**
     * Get the type of the indicator given as parameter
     * @param{indicator} String that may contain an indicator
     * @return Type of the indicator detected, if it is valid
     */
    getIndicatorType(indicator) {
        if(indicator.match(this.domain)) {
            return "domain";
        } else if(indicator.match(this.ip)) {
            if(indicator.match(this.internalip)){
                return "internal";
            }
            return "ip";
        } else if(indicator.match(this.url)) {
            return "url";
        } else if(indicator.match(this.hash)) {
            return "hash";
        } else if(indicator.match(this.email)) {
            return "email";
        } else {
            return "invalid";
        }
    }

    /**
     * Extract domain from url
     */
    getDomainFromURL(url) {
        let groups = url.match(this.url);
        if(groups) {
            return groups[1];
        }
    }
}
