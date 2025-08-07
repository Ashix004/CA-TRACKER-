# Setting Up Email Functionality in CA Tracker

CA Tracker allows you to send your progress data to your email for backup. This feature uses EmailJS, a service that enables sending emails directly from client-side JavaScript without requiring a backend server.

## Setup Instructions

### 1. Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for a free account
2. The free tier allows 200 emails per month, which should be sufficient for personal use

### 2. Create an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Once connected, note down the **Service ID** (you'll need this later)

### 3. Create an Email Template

1. In your EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Design your template using the EmailJS editor
4. Make sure to include the following template variables:
   - `{{user_name}}` - The user's name
   - `{{subject_summary}}` - Summary of subject progress
   - `{{progress_data}}` - Complete progress data in JSON format
   - `{{system_date}}` - Current date (optional)
5. Save your template and note down the **Template ID**

### 4. Get Your User ID

1. In your EmailJS dashboard, go to "Account" > "API Keys"
2. Copy your **Public Key** (this is your User ID)

### 5. Update the CA Tracker Application

1. Open `src/App.jsx` in your code editor
2. Find the `sendProgressByEmail` function (around line 330)
3. Replace the placeholder IDs with your actual IDs:

```javascript
emailjs.send(
  'YOUR_SERVICE_ID',  // Replace with your EmailJS service ID
  'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  templateParams,
  'YOUR_USER_ID'      // Replace with your EmailJS user ID (public key)
)
```

## Example Template

An example HTML template is provided in `src/emailjs-template-example.html`. You can use this as a reference when creating your template in the EmailJS dashboard.

## Testing

After setting up EmailJS:

1. Go to the Settings page in CA Tracker
2. Enter your email address in the User Profile section or in the Backup & Export section
3. Click "Send Progress Data"
4. Check your email inbox for the progress report

## Troubleshooting

- If you don't receive emails, check your spam folder
- Verify that your EmailJS service is properly connected
- Make sure you've replaced all placeholder IDs with your actual EmailJS IDs
- Check the browser console for any error messages

## Privacy Note

Your progress data is sent directly from your browser to your email via EmailJS. The data is not stored on any server except for temporary processing by EmailJS.