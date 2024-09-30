# Maintenance Manual

### CSCE 4902/4925 - 501
### SIFT
### Maintenance Manual - by Raul Martinez & Luis Molina

**Sifters (Group 9)**  
09/29/24

- Raul Martinez
- Luis Molina
- Ahmad Dzhaguri
- Elijah Haynes
- David Rubio
- Syed Uddin

---

## 1. Introduction
This maintenance manual provides essential information for the upkeep, troubleshooting, and regular application updates. It is intended for developers and IT personnel responsible for maintaining the software.

## 2. System Overview
- **Backend:** Node.js, AWS Lambda, API Gateway
- **Frontend:** React.js, Bootstrap
- **Database:** DynamoDB
- **Authentication:** AWS Cognito
- **API:** Amadeus Flight API
- **Version Control:** GitHub
- **Deployment:** AWS Amplify

## 3. Regular Maintenance
### 3.1 Dependency Management (Routine)
- Regularly update dependencies by running `npm update`.
- Check for outdated packages using `npm outdated` and update them.

### 3.2 Database Management (Routine)
- Perform regular backups of the DynamoDB database.
- Monitor the database performance and optimize indexes as needed.

### 3.3 Predictive Model Retraining and Updates (Routine)
- New flight information is created daily, and the model must be retrained with new data to predict the best ticket prices.

### 3.4 Security Updates (Preventive)
- Apply security updates to prevent unauthorized access to user accounts.

## 4. Schedule
### 4.1 Weekly
- Retrain model
- Database backups
- Dependency checks
- Database performance monitoring

### 4.2 Monthly
- Security updates
- Database optimization

## 5. Troubleshooting
### 5.1 Common Errors
- **404 Not Found Errors:** Ensure that backend routes correspond with frontend requests. Check the correct use of route paths.
- **500 Internal Server Errors:** Investigate server logs for stack traces. Common causes include database connection issues or incorrect API requests to Amadeus.
- **Database Connectivity Issues:** Verify that DynamoDB is running and the API Gateway is correctly configured.
- **Authentication Failures:** Check AWS Cognito user pool and aws-exports file for correct configuration.

## 6. Setup and Installation
### 6.1 Prerequisites
- Node.js and npm installed.
- All up-to-date dependencies installed from package.json
- Git for version control.

## 7. Roles and Responsibilities
- **Raul Martinez:** Security Updates (Preventive)
- **Luis Molina:** Model Retraining (Routine)
- **Ahmad Dzhaguri:** Database Management (Routine)
- **Elijah Haynes:** Dependency Management (Routine)
- **David Rubio:** Security Updates (Preventive)
