# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0]
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
