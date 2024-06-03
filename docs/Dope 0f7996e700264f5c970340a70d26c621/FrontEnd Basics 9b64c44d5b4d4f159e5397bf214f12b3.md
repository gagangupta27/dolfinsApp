# FrontEnd Basics

Dope is primarily an React Native Project. 
It uses Expo as the core framework which speedens up the development process. (Fun Fact - Expo is founded by co-founder of Quora)

React Native is one of most popular framework for developing cross platform apps. Top companies like Facebook, Microsoft, Amazon, Shopify are using React Native for development of their core Apps ([link](https://reactnative.dev/showcase))

**We chose React Native because of following reasons -** 

- **Advantages**
    - It is faster to code. It is easy to find React Developers since the same tech is used in Web Development (ReactJS).
    - Interoperability of Code. Same code can be used to setup iOS App, Mac App, Android App and Web App.
    - Ease of deployment. Expo makes deployment process very straightforward. Also, Small App Updates can be pushed to User Devices without making any explicit App Release. This fastens the delivery time of BugFixes.
- **Disadvantages**
    - App might be slower compared on old iOS Phones, as compared to pure iOS Apps.
    - Some Components are not readily available like Rich Text Editor.

**App Design Philosophy**

- One of the core requirement from Pranav was that Data should be shared with servers only when it is absolutely required. Rest of the time, the data should be stored only in the device.
- App should work smoothly even in offline settings. The App components should be modular that way.
- Keeping all this in mind, we built app with Offline First POV. All the data is stored in Mobile Database (Realm) by default. The notes are never shared with the servers.
- The calendar events are fetched from Outlook/Google periodically and stored on stored. When user opens the app, the calendar events are fetched from server. Even for **calendar specific notes**, we never send them to server.
- The contacts are also stored on device. They are not synced with the server.
- Only in necessary cases like when using Ask Module, we share the notes with the server. The server strictly deletes the data after the query is complete. Data is shared only with Azure OpenAI where strict compliance requirements are in place. For more details on how Azure handles client data - see this [link](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy).

**Dope Codebase has these following Screens**

- **OnBoardingScreen** - To educate users on what Dope is all about after they have downloaded the App. At the end, we also give user an option to Login using Google.
- **HomeScreen** - To browse existing contacts, add new contacts, search contacts and notes. Also, allows user to quickly add a note
- **ContactScreen** - To browse the notes for a specific Contact. User can also add LinkedIn Id of the contact to fetch their linkedin summary.
- **CalendarListScreen** - To browse all the Future Calendar Events and Old Calendar Events.
- **CalendarScreen** - To add notes for a particular Calendar Event
- **NoteTakingComponent** - Markdown based Multi-Modal Notes Editor. User can do basic operations like Bold/Italic/Strikethrough in their notes. Also, accepts Audio, Video and Images.
- **AskModuleScreen** - Ask questions to GPT while giving all the Contact and Calendar Context. Answers are streamed back to user to have less latency.

**Onboarding & Login Flow**

![D2579A91-77DB-4F9D-8FD4-BFEA5B245911.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/D2579A91-77DB-4F9D-8FD4-BFEA5B245911.png)

![12CBC96B-13E4-4F60-8667-D37C7CACC573.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/12CBC96B-13E4-4F60-8667-D37C7CACC573.png)

![4B208323-8BD8-44B8-8D3D-CCDFC3F7DA4D.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/4B208323-8BD8-44B8-8D3D-CCDFC3F7DA4D.png)

![684DBE4D-C7C4-4098-A422-6B1180C7A28D.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/684DBE4D-C7C4-4098-A422-6B1180C7A28D.png)

**Home Screen**

![2F75669D-3A2B-45D2-A8D3-8257BF38214D.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/2F75669D-3A2B-45D2-A8D3-8257BF38214D.png)

![E072172D-6D7E-400C-9677-13999563DE18.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/E072172D-6D7E-400C-9677-13999563DE18.png)

![48CB3460-4D78-4065-9666-D7C64090662A.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/48CB3460-4D78-4065-9666-D7C64090662A.png)

**Contact Screen**

![40529CAF-D291-4D77-8828-48204D70377A.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/40529CAF-D291-4D77-8828-48204D70377A.png)

![2011682B-A099-43D6-8A74-2FA3BC95091A.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/2011682B-A099-43D6-8A74-2FA3BC95091A.png)

![CA168106-CEF1-46DF-B166-56B0B72F88CB.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/CA168106-CEF1-46DF-B166-56B0B72F88CB.png)

![84DA0055-3F3A-43C2-A78D-30EC7FCCD712.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/84DA0055-3F3A-43C2-A78D-30EC7FCCD712.png)

**Calendar Section**

![745A8690-0864-45C9-931A-CDC288AF4E2B.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/745A8690-0864-45C9-931A-CDC288AF4E2B.png)

![C672D278-459B-4C23-8099-7B67A9FF882E.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/C672D278-459B-4C23-8099-7B67A9FF882E.png)

**Notes Component**

![2950EDD8-764D-4AA5-84C8-749FC9A1278F.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/2950EDD8-764D-4AA5-84C8-749FC9A1278F.png)

![0530DC3A-5C1C-4E88-86A2-C82629C99E55.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/0530DC3A-5C1C-4E88-86A2-C82629C99E55.png)

![2B923D24-D700-4979-A3A7-32F657C29AAF.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/2B923D24-D700-4979-A3A7-32F657C29AAF.png)

![1AA9C5F8-9C2A-4B6B-9738-DA0850AA2DC8.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/1AA9C5F8-9C2A-4B6B-9738-DA0850AA2DC8.png)

![18EE35A0-FF1A-4A45-92EE-F36BB107D8B1.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/18EE35A0-FF1A-4A45-92EE-F36BB107D8B1.png)

![4D20697A-16B8-45B2-9A89-E012321A415D.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/4D20697A-16B8-45B2-9A89-E012321A415D.png)

**Ask Module**

![34599E6D-7388-4581-832C-1425079B0E55.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/34599E6D-7388-4581-832C-1425079B0E55.png)

![BDF9E5C2-A312-42AA-836B-F5D7716DFA14.PNG](App%20Flow%201581096c68b64f9c9be3c87d632eabd7/BDF9E5C2-A312-42AA-836B-F5D7716DFA14.png)