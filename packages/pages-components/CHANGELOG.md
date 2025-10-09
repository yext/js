#### 1.1.13 (2025-09-24)

##### Continuous Integration

- support trusted publishing ([#109](https://github.com/yext/js/pull/109)) ([8650b782](https://github.com/yext/js/commit/8650b782671dd76e87f2e39455510026ab597bd8))

##### New Features

- **pages-components:** support cdn parameters and use cdn for aspect images ([#108](https://github.com/yext/js/pull/108)) ([7dde1c51](https://github.com/yext/js/commit/7dde1c5153657ef3e7e1dfdfa35c14e10a8cdab5))

##### Bug Fixes

- store tag correctly for publish step ([#115](https://github.com/yext/js/pull/115)) ([0622c36e](https://github.com/yext/js/commit/0622c36e77f5ce7d73e90efe4d7146a4684241d1))
- provide correct tag for publish ([#114](https://github.com/yext/js/pull/114)) ([f994b98a](https://github.com/yext/js/commit/f994b98a359f6df578cc0d44fbca408b6d4d4172))
- pass correct tag to publish step ([#113](https://github.com/yext/js/pull/113)) ([2953455a](https://github.com/yext/js/commit/2953455a83591443427c4cf8635c27386002d040))
- checkout main branch before publishing ([#112](https://github.com/yext/js/pull/112)) ([e10d7c12](https://github.com/yext/js/commit/e10d7c12417bc95c28f7bdcdefc0f961a92647c6))
- split on '@' in verifyPublish ([#111](https://github.com/yext/js/pull/111)) ([f924fc6e](https://github.com/yext/js/commit/f924fc6e50a5277ebdd502e4707b950f28eb6743))
- support LocationMap Mapbox in VLE iframe ([#110](https://github.com/yext/js/pull/110)) ([0c70007d](https://github.com/yext/js/commit/0c70007d6041c9bca7e8bbc26266128068c33a34))
- block cta links that are not strings ([#107](https://github.com/yext/js/pull/107)) ([3a03462f](https://github.com/yext/js/commit/3a03462f61823e49f236bf90b9e359665983dc08))

##### Other Changes

- pages-components@1.1.13 ([bfc928bf](https://github.com/yext/js/commit/bfc928bff2ffe880e6c19a48522722971a0c4e16))
- pages-components@1.1.13 ([6287e0be](https://github.com/yext/js/commit/6287e0bea4dc6ac7f6d16b05bed6d81baa88e239))
- store tag correctly for publish step ([#115](https://github.com/yext/js/pull/115))" ([7bec74d9](https://github.com/yext/js/commit/7bec74d9b4f668fe2d601bb10fbd84def11d6310))
- pages-components@1.1.13" ([69a9e328](https://github.com/yext/js/commit/69a9e328136e378495e2ea33bc97f68263eb7dc4))
- pages-components@1.1.13 ([e6e57d1a](https://github.com/yext/js/commit/e6e57d1a56670a811919e78ca40d45b28dac2005))
- pages-components@1.1.13" ([1d1bf855](https://github.com/yext/js/commit/1d1bf855761263ad96a5993ba8c52bf62eee90dd))
- pages-components@1.1.13 ([c4420bdd](https://github.com/yext/js/commit/c4420bdd470c0f45dbaaed9837f87e3e39da6511))
- pages-components@1.1.13" ([0369cda3](https://github.com/yext/js/commit/0369cda377095f78eaa3e7382745b71a00b15dfe))
- pages-components@1.1.13 ([17a6db63](https://github.com/yext/js/commit/17a6db6306ef02e8e6af4bb30022d6d848d8eec4))
- pages-components@1.1.13" ([797c5c27](https://github.com/yext/js/commit/797c5c275a8a2a384044fcb871a4a569e049f532))
- pages-components@1.1.13 ([fedd33ba](https://github.com/yext/js/commit/fedd33ba48f92bab59074550f98e4c095dc984d8))
- pages-components@1.1.13" ([ab3be7ce](https://github.com/yext/js/commit/ab3be7cef5c5df40074bc201a539aee4d17e2e16))
- pages-components@1.1.13 ([333203a7](https://github.com/yext/js/commit/333203a78d7b6deedad14f162c1ad299095ab562))
- pages-components@1.1.13" ([326031ec](https://github.com/yext/js/commit/326031ec7fc863735d011bfea419383b87e6e175))
- pages-components@1.1.13 ([721b8caf](https://github.com/yext/js/commit/721b8cafed50e61e4ac50bd03755c178a205048b))

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
