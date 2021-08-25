# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Added
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
