# Completer - AI Email Reply Generator
AI based GMAIL Reply Generator Chrome Extension

## 🛠️ Setup

### 1. Clone Repository 

```bash
git clone <repository-url>
```

### 2. Backend Setup

#### ENV

Create `.env` in root

#### Start Backend 

```bash
cd completer
```

# start gradle
```bash
./gradlew bootRun
```

access via  `http://localhost:8080`

### 3. Chrome Extension Setup

#### Load Extension 

1. visit `chrome://extensions/`
2. activate Developer mode
3. Click Load unpacked
4. Select `gc-extension/` Folder 

#### Test Extension 

1. Visit [Gmail](https://mail.google.com)
2. Open Mail
3. Click Reply
4. Use the **"AI Reply"** Button to generate replies based on Mailcontext

