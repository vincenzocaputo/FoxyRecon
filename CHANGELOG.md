# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8]
### Added
- Favorites handling
- Filtering by type for indicators collected through hunt feature.
- LeakIX web resources for IPs and domains (Leak and Services lookup)

### Changed
- Removed Alexa (End of service on May 1st 2022)

### Fixed
- Deletion of indicator from local storage when trash bin icon is clicked.
- Removing of badge text on active tab change
- Browserling icon

## [0.7.2] - 2022-03-05
### Added
- CVE web resources (AttackerKB, Tenable, CVE report, Vulners)
- Greynoise resource for IP address
- Google search engine
- Hunt feature for CVEs

### Changed
- Added "tls" and "whois" tag to Spyse resource

### Fixed
- Popup crash

## [0.7.1] - 2022-02-26
### Added
- Disclaimer

### Fixed
- IANA whois icon
- Minor fixes

## [0.7.0] - 2022-02-22
### Added
- New WHOIS tools (URLVoid Whois Lookup, Whois, EuroDNS, IANA, MX Toolbox)
- MX Toolbox resources (WHOIS, DNS Lookup, Blacklist lookup)
- Fortiguard Web Filter Lookup
- CVEs web resources (Mitre, NIST, Vulmon, GitHub, Fortiguard, Kaspersky)

## [0.6.5] - 2022-02-19
### Fixed
- Rejection of valid defanged URL with two or more subdomains
- Censys URL request

## [0.6.4] - 2022-02-13
### Added
- Autofill feature for context menu.
- Support for defanged indicators

### Fixed
- Input validation for domains with TLD with more than 6 characters.

## [0.6.3] - 2022-01-19
### Changed
- On the web pages that require human interactions to submit a query, the input text field will be automatically filled only once

### Fixed
- VirusTotal and Urlscan auto-submit
- Disappearing of the domain extraction icon option when closing the popup.

## [0.6.2] - 2022-01-19
### Added
- BuiltWith resource for domains

## [0.6.1] - 2021-12-31
### Fixed
- Open in new/current tab button

## [0.6.0] - 2021-12-30
### Added
- Hunt! feature that let you search search all potential indicators present in the web page visible in the current active tab of the browser.
- Trash bin button to clear the input text field.
- Open in new/current tab button

### Changed
- Behaviour of indicators text selection. Now only submitted indicator will be saved inside the input text field of the popup.
- Buttons icons inside the input text field.
- Settings popup appearance

### Fixed
- Behaviour of the domain extraction feature icon in the textfield

## [0.5.2] - 2021-11-16
### Added
- Auto-submit feature for CentralOps resource (domain whois, network whois, dns)

### Changed
- Removed auto-submit feature for active URL scan with urlscan.io (scans fails because of CAPTCHA errors)

### Fixed
- Urlscan visibility settings even without auto-submit feature enabled

## [0.5.1] - 2021-11-14
### Added
- Urlscan active URL scan with auto-submit feature. Three options are available, one for each level of scan visibility provided for by urlscan.io (public, unlisted and private)
- VirusTotal active/passive URL scan with auto-submit feature

### Changed
- Auto-submit is now disabled by default

### Fixed
- Talos Intelligence domain and IP lookup  
- Minor fixes

## [0.5.0] - 2021-09-21
### Added
- Added tags to web resources depending on the type of information they provide
- Added web resources filtering by tag

### Changed
- Improve local storage cleaning when a add-on version updates occur
- Pop-up appearance

### Fixed
- Popup text field width
- Minor fixes

## [0.4.2] - 2021-09-05
### Added
- Auto-submit disable/enable option
- Intezer Analyze for malicious file hash lookup

### Changed
- Project structure
- Added browser-polyfill.js library
- Improved 

## [0.4.1] - 2021-09-01
### Fixed
- Hiding of web resources list when the text field is empty
- Indicator type detection when selecting text

## [0.4.0] - 2021-08-31
### Added
- Feature that allows to automatically submit indicators on web resources that requires UI actions (dnsdumpster, urlvoid, hibp)
- Feature that allows to extract domain name from URL or email addresses

### Changed
- BPG Hurricane resource name to Hurricane Electric
- Web Archive resource name to Wayback Machine

### Fixed
- Open in new tab default option
- Query for Web Archive web resource


## [0.3.4] - 2021-08-29
### Added
- Settings popup
- "Open in new tab" option

### Changed
- Code improvements and clean-up

### Fixed
- Indicator type detection when selecting text on a webpage

## [0.3.3] - 2021-08-26
### Added
- SecurityTrails, ZoomEye and Spamhaus for domain and IP researches
- JoeSandbox for hash researches

### Fixed
- Version update bug
- Malware bazaar hash lookup

## [0.3.2] - 2021-08-25
### Changed
- UI appearance
- Removed JQuery

### Fixed
- Old cache bug when add-on is updated

## [0.3.1] - 2021-08-22
### Added
- URLvoid textfield autofill
- IntelligenceX and Threat Crowd for email address lookup

### Changed
- Add-on logo in the popup. Added version number.
- Error and warning message appearance.
- Tools are now alphabetically ordered.

### Fixed
- Fixed domain indicator detection when it contains underscores

## [0.3.0] - 2021-08-14
### Added
- Support for email addresses, with five web services:
  - Dehashed
  - Have I Been Pwned
  - CentralOps (Email Dossier)
  - Hunter
  - Emailrep
- New web services
  - dnsdumpster
  - CentralOps (Domain Dossier)
- Support for web services that requires some user interactions (such as submitting a query or solving CAPTCHA). Text fields on these web pages will be automatically filled with searched indicator.
- Indicator searched through context menu will be saved as input in the text field of the popup.

## [0.2.4] - 2021-08-10
### Added
- ViewDNS tools (Whois, DNS Lookup and HTTP Headers)
- Netcraft site report tool

### Changed
- Popup buttons appearance

## [0.2.3] - 2021-08-09
### Added
- Checkphish Lookup tool for domains and IPs
- Checkphish Scan tool for URLs

### Changed
- Popup buttons appearance
- (Temporarily) removed VirusTotal URL lookup (it was not working)
 

## [0.2.2] - 2021-08-08
### Changed
- Highlighted text can contain spaces

### Fixed
- Threatcrowd icon background

## [0.2.1] - 2021-08-08
### Fixed
- Hash false positive detection in text selection
- Context menu works properly on all websites

## [0.2.0] - 2021-08-08
### Added
- Web resources description
- Censys domain lookup
- VirusTotal URL lookup
- urlscan liveshot for URLs
- urlscan IP lookup
- Threatcrowd web resource (for domains and IPs)
