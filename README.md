# ClearAid

ClearAid is a web-based NGO management system designed to be a central hub for NGOs and donors. It allows NGOs to post projects, track donations, and recruit volunteers, while enabling people to donate anonymously to causes without requiring an account. ClearAid aims to simplify the donation and volunteer process by providing transparency and ease of use.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Acknowledgments](#acknowledgments)

## Features

- **NGO Registration**: NGOs can register to manage their projects, track donations, and recruit volunteers.
- **Project Posting**: NGOs can post detailed project descriptions, set donation goals, and provide real-time updates.
- **Donation Tracking**: ClearAid displays a live status bar to show donation progress for each project.
- **Volunteer Recruitment**: NGOs can list volunteer opportunities and hire volunteers directly through the platform.
- **Anonymous Donations**: Users can donate to projects without needing to register or log in.

## Installation

### Prerequisites

- **Node.js** (latest version recommended)
- **Firebase** account and API configuration
- **Git**

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/nrzn77/altruistic.git
   ```

2.	Navigate to the project directory:
  ```bash
  cd altruistic/Website
  ```

3.	Install dependencies:
```bash
npm install
```

4.	Set up Firebase:
	-	Create a Firebase project in your Firebase Console.
	-	Enable Firestore, Authentication, and any other required Firebase services.
	-	Obtain your Firebase configuration and add it to the .env file as follows:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```


5.	Start the web server:
```bash
npm run dev
```
6. Start the Image Server
```bash
npm run devStart
```


## Usage

1.	NGO Registration: NGOs can sign up through the sign-up page and access their dashboard.
2.	Project Management: NGOs can post projects, update donation goals, and monitor progress in real-time.
3.	Donation: Users can browse projects and make donations directly without needing an account.

## Acknowledgments

ClearAid is built with React and Firebase, and we are grateful to the open-source community for providing the tools and resources to make this project possible.
