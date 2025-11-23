# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [ 0.24.3 ] - 2025-11-23

### Add
- Lookup TLS certificate by hash on crt.sh
- MalShare hash lookup tool
- CIRCL.lu Lookyloo lookup web tool (for URLs and domains)
- Add Google tool to pull the favicon of a given domain

### Fix
- Update ThreatBook URL
- WebCheck URL
- Vulnerability icon in graph editor

## [ 0.24.2 ] - 2025-06-21

### Add
- APNIC web resoource

### Change
- Update Emailrep properties (an account is now required)

### Fix
- Automatic field population on HIBP
- Email address encoding in Cleantalk URL
- Threat Actor editing form in graph
- Minor fixes in Graph editor

## [ 0.24.1 ] - 2025-04-19

### Add
- Neiki.dev TIP web tool
- Support for IP address to IPQS
- Add CVEFeed web resource
- Feature to import custom tools from JSON file
- Feature to import graph from JSON file
- Graph icon themes
- New graph settings
- Shortcut for popup opening
- Add Odin web tool
- Add Wannabrowser web tool
- Add Palo Alto Networks URL Filtering web tool
- Add Wappalyzer web tool
- European Union Vulnerability Database (EUVD) tool
- Add VARIoT web resource
- Add Netify web resource

### Change
- Remove CheckPhish tool
- Replace PacketTotal with DynamiteLab (its successor)
- Update CIRCL.lu web resource to vulnerability-lookup

### Fix
- Bug that prevented tools from being removed from favorites
- Bug that prevented clicking on history entries
- Auto submit for DNSDumpster tool
- Hunter.how URL parameters
- Missing PhishTank icon
- Minor fixes in Add graph node popup

## [ 0.23.0 ] - 2024-12-14

### Add
- files.ninja web resource
- PSBDMP web resource
- Spur tool for IP addresses
- Cloudflare Radar tool
- SiceHice web resource
- IBM X-Force Exchange web resource
- PhishTank web resource
- Snyk web resource for vulnerabilities lookup
- ioc[.]one web resource

### Change
- Change local storage management APIs
- Remove Polifyll library
- Minor changes to make porting to Chrome possible

### Fix
- Minor stylesheets bugs
- Minor bugs

## [ 0.22.0 ] - 2024-09-22

### Add
- Text animation to display entire tool names when they are too long
- Option to disable the typing animation of indicators in text fields
- Exact string search for GitHub resource
- Investigate option in context menu to send indicators to the popup
- Option in the context menu to add selected text as a node to the graph
- Option to filter tools that support auto-graph generation
- Option to filter tools that do not require user interactions
- Option to filter tools that do not require accounts
- Button to filter tools by name
- Icon to mark the tools that support the automatic graph population feature
- Icon to mark the tools that require user interaction
- Icon to mark the tools that require an account
- Popup box to show content of Note nodes
- Filtering for collected indicators based on value

### Change
- Updated browser-polyfill library
- Speed up typing animation
- Shrink the history drop-down menu
- Removed tools from context menu 
- Removed phone numbers format conversion when collecting indicators. Make the conversion only when the user submits a collected phone number indicator for investigations.
- UI improvements in graph page
- Improve indicators detection
- Popup UI improvements

### Fix
- Urlscan visibility scan selection
- Indicators collection on web pages containing private IP addresses
- MAC Address form in graph page
- Filtering by tool name when other filters are active
- Filtering by tool tags when other filters are active
- Filtering by tool name
- Saving and restoring tag filtering
- Bug that prevented tags from being added to custom tools
- Graphical bug when the textarea is resized in the forms on the graph page
- Gray background when a relationship is added from popup  
- Bug that prevented the export of collected indicators

## [0.21.0] - 2024-08-03

### Add
- Phone number indicator
- Autonomous System Number indicator
- Phone number and ASN indicators detection and collection
- Country flag based on phone number's dial code
- Templates to speed up custom resources creation
- Custom resources export option
- CVE Details resource for CVEs
- Exploit Database resource for CVEs
- IP Quality Score resource for phone number lookup
- Google Trends resource
- Poc-In-Github resource for CVEs
- Rapid7 Vulnerability & Exploit database resource
- HudsonRock resource
- HackerTarget DNS Lookup, Whois Lookup, Banner Grabbing, Extract links, HTTP Header check and Wappalyzer/WhatWeb Scan
- CISA KEV Catalog resource
- Emobile Tracker resource
- Sync.me and Truecaller resources
- CIRCL.LU vulnerability lookup
- OpenCVE resource
- BGPView resource
- RIPE Database resource
- Greensnow resource for IP addresses
- SecureFeed resource for IP and domains
- Search operator "tool:" to filter by tool
- Show country name on hovering flag
- Show release notes on update

### Change
- Custom resources page UI
- Rename Twitter to X
- Update Netcraft logo and color
- Improve popup look (font and colors)
- Improve resource icons
- Add lookup for ASN and Phone in Pulsedive
- Addon update detection
- Autofill input field detection logic
- Search operator for filtering by tool from "+" to "!"

### Fix
- Domain extraction from email address
- Button name in add relationship prompt in graph page
- Accept URLs containing IP address and port
- Custom tools loading
- Delete node in graph from popup
- Remove flag from the input field when the indicator is removed
- Several fixes in custom resources page
- Tool search operator


## [0.20.0] - 2024-05-12
### Add
- STIX support in the graph tool
- More options and features for graphs

### Change
- New graph engine (Vis Network)
- New graph page UI

### Fix
- JoeSandbox URL

## [0.19.0] - 2024-02-04
### Add
- Automatic graph generation
- Threatbook CTI resource for domains and IP addresses
- Info boxes on setting items

### Change
- Graph UI
- Settings menu

### Fix
- Minor fixes

## [0.18.1] - 2023-11-26
### Add
- Spam Database Lookup resource
- Project Honeypot resource

### Change
- Removed Checkphish Lookup resource (no more available)
- Update d3 library to version 7.8.5

### Fix
- Checkphish scan
- FortiGuard web filter lookup
- Popup loading bug whem auto catching is enabled

## [0.18.0] - 2023-10-03
### Add
- Graph

### Change
- Censys URL (Certificates and Host)
- Added domain for Censys Host resource 

### Fix
- Tools first loading bug in context menu

## [0.17.0] - 2023-07-26
### Add
- Web Check resource for domains and urls
- Hunter.how resource for domains and ip addresses

### Fix
- Field auto-fill for web resources that support only post requests

## [0.16.0] - 2023-05-31
### Add
- Bin icon to clean indicators list and show the popup main screen
- SSLShopper tool for TLS certificate lookup
- Digicert TLS certificate validator

### Change
- The catch option in the search bar will no longer show the list of the indicators found but only their occurrences

## [0.15.1] - 2023-04-15
### Add
- Settings option to disable indicators auto catching feature

### Fix
- GitHub icon

## [0.15.0] - 2023-04-01
### Add
- Base64 encoding for URL parameters
- FOFA search engine

### Fix
- Defanged email regex recursion

## [0.14.1] - 2023-03-18
### Added
- PolySwarm sandbox web resource

### Fixed
- Email regex does not accept upper case and special characters (%+-)

## [0.14.0] - 2023-03-12
### Added
- New popup main page reporting the number of indicators for each type found in the current visiting webpage
- Each button on the popup main page can be clicked to display indicators of the corresponding type
- Defanged indicators detection and collection from the current visiting webpage
- Twitter, Leakpeek, DNS History, BreachDirectory, Phishunt, CleanTalk resources

### Changed
- Improved support for defanged indicators
- Removed badge text when the indicators count is 0
- Removed ThreatCrowd (service no more available)

### Fixed
- Tools list loading at startup
- Indicators counting when a page is first loaded in a new tab
- Acceptance of IP addresses with a 0 at the beginning of one or more octects

## [0.13.1] - 2023-03-06
### Fixed
- Bug: the number in the badge text is not being updated when a new page is loaded
- Bug: undefined country flag when a domain is selected from the list of indicators collected with catch

## [0.13.0] - 2023-03-05
### Added
- Badge text that automatically reports the number of indicators found on the web page opened in the current tab
- Lupovis web resource for IP reputation
- DOCGuard web resource for malware hash lookup
- Hash search for InQuest resource
- "Beta" notation to the version that appears in the popuo

### Changed
- Hunt feature icon and name to "Catch" 
- Removed addon name from popup splash screen

### Fixed
- Visibility of the Catch button when an input entry is selected from the history
- BuiltWith tool entry's "techs" tag
- Current tab bug in Catch feature when more windows are open
- Presence of badge text when an input is entered after launching indicators Catch
- Minor fixes in the Custom Tool page

## [0.12.0] - 2023-02-04
### Added
- New web resources
    - PacketTotal
    - Inquest Labs
    - Criminalip
- New tags

### Fixed
- ThreatCrowd URL

## [0.11.1] - 2023-01-07
### Added
- Google Safe Browsing for URL reputation check
- LeakCheck to check if an email address has been compromised in a breach

### Changed
- Removed Spyse web resource, as it is unreachable

## [0.11.0] - 2022-12-24
### Added 
- Any.run web resource for hash analysis
- Indicators search history

### Fixed
- URL input field for custom tools creation
- Minor fixes

## [0.10.1] - 2022-10-02
### Added
- Security Headers for headers analysis for URLs

### Fixed
- String replacing for Google tool 

## [0.10.0] - 2022-08-15
### Added
- New feature for adding custom web resources
- W3Techs web resources for domain technologies lookup

## [0.9.1] - 2022-07-23
### Added
- MultiRBL.valli.org lookup tool (WHOIS & DNSBL)
- bgp.tools lookup tool for IP address (WHOIS & DNS)

### Fixed
- Censys certificates and hosts lookup

## [0.9] - 2022-06-04
### Added
- Filtering by tool name, using special character '+' in the search bar
- Indicators list download

### Changed
- Removed Alexa (End of service on May 1st 2022)

### Fixed
- Defanged domain and URL regex

## [0.8] - 2022-03-27
### Added
- Favorites handling
- Filtering by type for indicators collected through hunt feature.
- LeakIX web resources for IPs and domains (Leak and Services lookup)

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
