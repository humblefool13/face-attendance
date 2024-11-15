# Face Recognition Attendance System  

This project is a **Face Recognition Attendance System** using React, AWS, and Face API. It leverages several AWS services to build a scalable, efficient, and automated attendance system. **This project is for educational purposes only** and is not intended for production use.

---

## Features  

1. Real-time face recognition using `face-api.js`.  
2. React-based web application for taking and viewing attendance.  
3. Integration with AWS for backend services and storage.  
4. Notifications for absentees via AWS SNS.  

---

## AWS Services and Their Usage  

- **EC2**: Hosting the React application.  
- **Lambda**: Handling API requests for backend operations.  
- **API Gateway**: Serving as a REST API interface for the frontend to interact with backend services.  
- **S3**: Storing student information (e.g., face data, metadata).  
- **DynamoDB**: Storing attendance records.  
- **SNS**: Sending notifications to students marked absent.  
- **Rekognition**: Performing face recognition for verifying student identities.  

_Expected data structures are included in comments where AWS services are used._  

---

## Getting Started  

### Prerequisites  

- **Node.js**: Ensure Node.js is installed.  
- **AWS Account**: To set up and use the AWS services listed above.  
- **Git**: For version control and managing this repository.  

---

### Installation  

1. Clone the repository:  
   ```bash
   git clone https://github.com/humblefool13/face-attendance.git
   cd face-attendance
   ```

2. Install dependencies: 
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. To build the app for production:
   ```bash
   npm run build
   ```

5. To preview the production build:
   ```bash
   npm run preview
   ```

6. To lint the code:
   ```bash
   npm run lint
   ```
---

### AWS Setup

1. EC2:
   - Launch an EC2 instance and configure it to host the React app using NGINX or another web server.
  
2. API Gateway:
   - Set up REST API endpoints to connect the frontend to Lambda functions.
  
3. Lambda:
   - Write Lambda functions to process attendance data, query DynamoDB, and handle interactions with S3 and Rekognition.

4. DynamoDB:
   - Create a DynamoDB table to store attendance records. Use attributes like `courseName`, `timestamp` and `studentInfo`.

5. S3:
   - Create an S3 bucket to store student photos and metadata.

6. SNS:
   - Configure SNS to send notifications to absentees based on attendance records.

7. Rekognition: 
   - Use Rekognition to match the detected face against stored student records in S3.

---

### Scripts in `package.json`

- `npm run dev`: Starts the development server using Vite.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Lints the project using ESLint.
  
--- 

### Disclaimer

This project is for educational purposes only and is not intended for production use. AWS free tier limits apply. Ensure you monitor usage to avoid unexpected charges.

For any issues, feel free to open an issue in the repository or contact the author.

---

Developed by humblefool13.
GitHub: [humblefool13](https://github.com/humblefool13)