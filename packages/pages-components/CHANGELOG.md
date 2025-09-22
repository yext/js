#### 1.1.13 (2025-09-22)

##### Continuous Integration

*  support trusted publishing (#109) (8650b782)

##### New Features

* **pages-components:**  support cdn parameters and use cdn for aspect images (#108) (7dde1c51)

##### Bug Fixes

*  checkout main branch before publishing (#112) (e10d7c12)
*  split on '@' in verifyPublish (#111) (f924fc6e)
*  support LocationMap Mapbox in VLE iframe (#110) (0c70007d)
*  block cta links that are not strings (#107) (3a03462f)

##### Other Changes

*  pages-components@1.1.13" (ab3be7ce)
*  pages-components@1.1.13 (333203a7)
*  pages-components@1.1.13" (326031ec)
*  pages-components@1.1.13 (721b8caf)

#### 1.1.12 (2025-08-22)

##### Bug Fixes

- **pages-components:** strip empty destinationUrl (#105) (fc95a5d5)

#### 1.1.11 (2025-08-22)

##### Bug Fixes

- **pages-components:** make a mutable copy of cta in resolveCTA (#104) (cd1d3c23)
- align HoursTable row to the right side (fda3622f)

##### Other Changes

- align HoursTable row to the right side" (3eec61c1)

#### 1.1.10 (2025-07-11)

##### Bug Fixes

- **pages-components:** rel not propagating in Link (#101) (1506993c)

#### 1.1.9 (2025-07-02)

##### Chores

- add additional hours storybook tests (#97) (e01815bc)

##### New Features

- render static hours server-side (#96) (c1dabdd1)

##### Bug Fixes

- hoursStatus isOpen and hoursTable collapsed day of week names (#98) (20cf58d0)

##### Refactors

- **pages-components:** make destinationUrl optional for analytics.track (#99) (4d462672)

#### 1.1.8 (2025-06-20)

##### Bug Fixes

- schema wrapper includes potentially undefined fields and hours always return as closed (#95) (9ccdac62)

#### 1.1.7 (2025-06-16)

##### New Features

- load dynamic events in analytics debugger (#93) (b37f9b5e)

#### 1.1.6 (2025-05-22)

##### New Features

- add min-height to HoursTable (#92) (ed5c4ac5)

#### 1.1.5 (2025-04-07)

##### New Features

- **pages-components:** add enableYextAnalytics to window (#90) (2b50890d)

#### 1.1.4 (2025-03-13)

##### Bug Fixes

- add page url to events payload (#89) (4edc33b7)
- pass page referrer to Yext Events (#88) (7276ccb9)

#### 1.1.3 (2025-03-10)

##### New Features

- **pages-components:** restore productionDomains AnalyticsProvider prop (#87) (bd6b6765)

#### 1.1.2 (2025-03-07)

##### Bug Fixes

- **pages-components:** sunday hours incrementing by 1 for Spring DST (#86) (b052fddb)

#### 1.1.1 (2025-03-04)

##### New Features

- **pages-components:** fail generation when apiKey missing (#85) (c08048f4)

#### 1.1.0 (2025-02-21)

##### Chores

- upgrade vitest (#82) (b15b8bbf)
- update yext/analytics and storybook (#83) (0e65ce48)
- update semgrep_check.yml to use ubuntu-latest (#81) (613773f2)

##### New Features

- **pages-components:** add Node 22 support (#84) (03db3eab)

##### Bug Fixes

- **pages-components:** unique key for address line separators (#79) (a704b131)

#### 1.0.5 (2025-01-07)

##### Bug Fixes

- **pages-components:**
  - schema type validation (#75) (fc562712)
  - link's href not obfuscated (#76) (8e102cc3)

##### Refactors

- **pages-components:** components/maps (#73) (09bf670b)

#### 1.0.4 (2024-12-03)

##### Bug Fixes

- **pages-components:**
  - resolve nested-interactive WCAG issue (#74) (f970d1aa)
  - link component type appearing as any (#72) (494bf4d7)

#### 1.0.3 (2024-11-19)

##### Chores

- update playwright version (#69) (6612a5b5)

##### New Features

- add schema-wrapper (#71) (4aed5f6d)

##### Bug Fixes

- prevent TS error for link cta prop (#70) (01e1fc7b)
- install playwright with dependencies (#68) (91155e13)

#### 1.0.2 (2024-11-01)

##### Documentation Changes

- detail enableDebugging does not fire sdk events (c871bea6)

##### New Features

- **pages-components:**
  - support customValues and customTags in Link component (#67) (3b939029)
  - add functionality to get directions from coordinates (#66) (cd188f93)

##### Bug Fixes

- **pages-components:** hoursTable component not matching dayOfWeekNames correctly (#63) (da3b6a09)
- throw error when cta link not set (#64) (70697513)

#### 1.0.1 (2024-08-06)

##### Chores

- **pages-components:** remove old productionDomains prop (#61) (eec7e91f)

##### Bug Fixes

- **pages-components:** xYextDebug query param not honored (#60) (9bb45b4e)

#### 1.0.0 (2024-07-29)

##### Chores

- **pages-components:** map components updates (#58) (50121f3b)
- update test suite dependencies (#57) (d9d6c116)
- update actions and node versions (#56) (1b3f8d83)

##### Bug Fixes

- **pages-components:** fix debugger hydration error (#59) (924012c1)

#### 1.0.0-rc.11 (2024-05-30)

##### Bug Fixes

- **pages-components:** properly obfuscate links (#55) (b9fee518)

#### 1.0.0-rc.10 (2024-05-13)

##### Bug Fixes

- **pages-components:** pass region to analytics reporter (#54) (61290348)

##### Other Changes

- **pages-components:**
  - debug mode and scope fixes (#46)""""""""" (11eb0205)
  - debug mode and scope fixes (#46)"""""""" (9751636d)

#### 1.0.0-rc.9 (2024-05-09)

##### Bug Fixes

- **pages-components:**
  - properly translate dyn url when accountId is 0 (#51) (ff34649d)
  - remove usage of innerHTML (#50) (1c6520f4)

##### Other Changes

- **pages-components:**
  - debug mode and scope fixes (#46)""""""" (91ebfc95)
  - debug mode and scope fixes (#46)"""""" (71cbc243)

#### 1.0.0-rc.8 (2024-04-25)

##### Bug Fixes

- **pages-components:**
  - don't use URL.canParse (#49) (7b760fc8)
  - update Vite to fix vulnerability (#48) (48a240ec)

##### Other Changes

- **pages-components:**
  - debug mode and scope fixes (#46)""""" (47cdf9ec)
  - debug mode and scope fixes (#46)"""" (d901fc8e)

#### 1.0.0-rc.7 (2024-04-24)

##### Bug Fixes

- **pages-components:** updated image url formats (#47) (5e2ab268)

##### Other Changes

- **pages-components:**
  - debug mode and scope fixes (#46)""" (45480037)
  - debug mode and scope fixes (#46)"" (f782ce81)

#### 1.0.0-rc.6 (2024-04-11)

##### Other Changes

- **pages-components:** debug mode and scope fixes (#46)" (e519e26b)

#### 1.0.0-rc.5 (2024-04-03)

##### Bug Fixes

- **pages-components:** debug mode and scope fixes (#46) (b675c297)

#### 1.0.0-rc.4 (2024-03-26)

#### 1.0.0-rc.3 (2024-03-21)

##### Bug Fixes

- **pages-components:** change slug for analytics eventNames (#45) (2b25e50e)

#### 1.0.0-rc.2 (2024-03-01)

##### New Features

- **pages-components:**
  - add analytics debugger. (#25) (138bcb9a)
  - correctly convert eu image urls (#42) (f245efcc)

#### 1.0.0-rc.1 (2024-01-23)

##### New Features

- **pages-components:** add support for EU image urls (#40) (be6a9236)

##### Bug Fixes

- github workflow (#41) (68feb383)

##### Refactors

- use @yext/sites-react-components's hours component (#39) (2cbac33d)

#### 1.0.0-rc.5 (2023-10-10)

##### New Features

- **sites-components:** inline dependencies (#13) (6462ba13)

##### Bug Fixes

- **sites-components:** add warning if no height or width (#14) (1fbcdae8)

#### 1.0.0-rc.4 (2023-09-20)

##### Bug Fixes

- **sites-components:** add prepare step (3db73a13)

#### 1.0.0-rc.3 (2023-09-20)

#### 1.0.0-rc.2 (2023-09-20)

##### New Features

- turn off sideEffects for treeshaking (#9) (3036ea92)

##### Bug Fixes

- **sites-components:**
  - use bool for sideEffects (acb0ff75)
  - update isProduction to check for RPs (#10) (75fda42c)
  - fixed bug in holiday hours (#8) (2791c13e)

#### 1.0.0-rc.1 (2023-08-03)
