# LaunchPad — Multi-Cloud Application Deployment & Disaster Recovery Management

LaunchPad is a full-stack web application deployed across **Microsoft Azure and Amazon Web Services (AWS)** to demonstrate multi-cloud hosting, automated deployment, database-backed application services, and disaster recovery through DNS-based traffic failover.

## Live Application

**Primary application URL:**  
https://www.whitestoneproperties.in

The application is designed with Azure as the primary environment and AWS as the secondary recovery environment.

## Architecture Overview

| Component | Technology / Platform |
|---|---|
| Frontend | Next.js App Router, React |
| Backend | NestJS REST API, TypeScript |
| Database | PostgreSQL 16 |
| Containerization | Docker |
| Primary Cloud | Microsoft Azure |
| Secondary Cloud | Amazon Web Services (AWS) |
| Azure Application Hosting | Azure App Service |
| AWS Application Hosting | Amazon ECS |
| Content Delivery | Amazon CloudFront |
| DNS and Failover | Amazon Route 53 |
| CI/CD | GitHub Actions |

## Cloud Deployment Architecture

### 1. Primary Deployment — Microsoft Azure

The primary application environment is deployed on Azure.

- Frontend hosted using Azure App Service.
- Backend deployed separately using Azure App Service.
- PostgreSQL configured to store application data.
- Application services communicate through the backend REST API.

**Azure endpoints:**

- Frontend: https://launchpad-frontend-h0h8c2ebarcafucu.centralindia-01.azurewebsites.net/
- Backend: https://launchpad-backend-hyf9hzhbgbdzbyha.centralindia-01.azurewebsites.net/

### 2. Secondary Deployment — AWS

A secondary application environment is deployed on AWS to support disaster recovery.

- Frontend and backend deployed as containerized services on Amazon ECS.
- CloudFront configured for content delivery.
- PostgreSQL configured in the AWS environment.
- Application services are deployed in the AWS Sydney region (`ap-southeast-2`).

**AWS endpoints:**

- Frontend: https://la-f2ae1b2fcaf446ad9639574bb7a22eec.ecs.ap-southeast-2.on.aws/
- Backend: https://la-2d5aabe1d1cb4b198ecf0c7d1a812e48.ecs.ap-southeast-2.on.aws/

## Disaster Recovery and Traffic Failover

The architecture uses DNS-based health monitoring and failover routing through Amazon Route 53.

Expected failover workflow:

1. Users access the application through the primary application domain.
2. Route 53 health checks monitor the configured primary endpoint.
3. If the primary endpoint becomes unhealthy, the configured failover routing policy directs eligible new DNS resolutions toward the AWS secondary endpoint.
4. The AWS-hosted application can then serve requests through its deployed frontend and backend services.

**Important:** DNS failover reduces recovery time but does not guarantee zero downtime. DNS caching, TTL values, health-check configuration, and application recovery behavior can affect the transition.

## Database Configuration

PostgreSQL is configured in both cloud environments.

- Azure PostgreSQL handles requests from the Azure application.
- AWS PostgreSQL handles requests from the AWS application.
- The backend API validates incoming application requests and stores submitted data in the corresponding database tables.

**Database architecture note:** These are separate database environments. Do not assume that records are automatically replicated or synchronized between Azure and AWS. Cross-cloud replication, consistency guarantees, and recovery-point objectives require a separately implemented and tested database replication or synchronization mechanism.

## CI/CD Pipeline — GitHub Actions

GitHub Actions automates the application build and deployment workflow.

General workflow:

1. Developer pushes code to the GitHub repository.
2. GitHub Actions detects the configured repository event.
3. The workflow builds the application and prepares deployment artifacts.
4. The deployment jobs execute against the configured cloud environments.
5. The updated application is deployed to the respective Azure and AWS services.

Repository:  
https://github.com/siddharth-thatikanti/launch_pad

## Health and Readiness Checks

Use these endpoints to verify application availability.

**Azure backend**

- Health: https://launchpad-backend-hyf9hzhbgbdzbyha.centralindia-01.azurewebsites.net/api/health
- Readiness: https://launchpad-backend-hyf9hzhbgbdzbyha.centralindia-01.azurewebsites.net/api/ready

**AWS backend**

- Health: https://la-2d5aabe1d1cb4b198ecf0c7d1a812e48.ecs.ap-southeast-2.on.aws/api/health
- Readiness: https://la-2d5aabe1d1cb4b198ecf0c7d1a812e48.ecs.ap-southeast-2.on.aws/api/ready

The health endpoint checks API availability. The readiness endpoint checks whether the backend can connect to its configured PostgreSQL database.

## Disaster Recovery Validation

A disaster recovery setup should be tested, not just configured.

Recommended validation procedure:

1. Confirm that the primary Azure frontend and backend are responding.
2. Confirm that the AWS frontend and backend are responding.
3. Verify PostgreSQL connectivity in both environments.
4. Submit a test lead through the application.
5. Confirm that the submitted record exists in the database used by the receiving backend.
6. Test the configured Route 53 health check and failover routing behavior.
7. Verify that requests can reach the AWS environment when the primary endpoint is unhealthy.
8. Measure recovery time and identify any data loss or synchronization gaps.

## Security and Production Considerations

- Store database credentials and application secrets in cloud secret-management or application configuration services.
- Do not commit credentials, private keys, or `.env` files to GitHub.
- Restrict PostgreSQL access to trusted application networks.
- Enable HTTPS for public application endpoints.
- Configure appropriate CORS policies.
- Enable database backups and test restoration.
- Configure monitoring, logging, alerts, and resource scaling.
- Apply rate limiting and spam protection to public form endpoints.
- Validate Route 53 health checks and failover policies under controlled conditions.

## Project Scope and Limitations

This project demonstrates a multi-cloud application deployment and disaster recovery architecture using Azure, AWS, Docker, PostgreSQL, Amazon ECS, CloudFront, Route 53, and GitHub Actions.

The following capabilities must be independently implemented and validated before claiming full production disaster recovery:

- Cross-cloud PostgreSQL replication and data consistency.
- Automated database recovery and restoration.
- Tested recovery time objective (RTO) and recovery point objective (RPO).
- End-to-end failover testing, including DNS caching behavior.
- Load testing and verified ECS/App Service autoscaling.
- Production-grade security, monitoring, and alerting.

## Project Outcome

LaunchPad demonstrates how a full-stack application can be deployed across two cloud providers, with a primary Azure environment and an AWS secondary environment. It brings together cloud hosting, containerization, database-backed services, CI/CD automation, content delivery, and DNS-based disaster recovery to reduce dependency on a single cloud platform.

**Live Application:** https://www.whitestoneproperties.in

**GitHub Repository:** https://github.com/siddharth-thatikanti/launch_pad
