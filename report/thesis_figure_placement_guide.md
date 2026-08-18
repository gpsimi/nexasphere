# 🗺️ NexaSphere Thesis Diagram Placement Guide

This guide maps each of the **14 landscape PNG diagrams** from the **NexaSphere Thesis Diagram Package** to the exact chapter, section heading, line number, and preceding paragraph in your thesis Word document (`Project Work.docx`).

---

## 📌 Quick Summary Table

| Figure File Name | Thesis Chapter & Section | Section Heading in Word Document | Placement Point |
| :--- | :--- | :--- | :--- |
| **Figure 3.1: High-Level System Architecture** | Chapter 3, Section 3.3.1 | `3.3.1 High-Level Architectural Model` | Right after the 3-tier architecture description |
| **Figure 3.2: Micro-Frontend Architecture** | Chapter 3, Section 3.3.4 | `3.3.4 Micro-Frontend Layer` | After describing host shell and remotes |
| **Figure 3.3: Domain and API Interaction** | Chapter 3, Section 3.4.13 | `3.4.13 API Design` | After the domain-oriented REST API endpoints |
| **Figure 3.4: System Context Diagram** | Chapter 3, Section 3.4.1 | `3.4.1 Use Case Model` | After introducing system actors and boundaries |
| **Figure 3.5: User Authentication Flow** | Chapter 3, Section 3.4.2 | `3.4.2 User Authentication Use Case` | After the JWT authentication workflow |
| **Figure 3.6: MFE Loading and Error Handling** | Chapter 3, Section 3.4.7 | `3.4.7 Failure Handling Workflow` | After the error boundary fallback sequence |
| **Figure 3.7: Database Schema Overview** | Chapter 3, Section 3.4.11 | `3.4.11 Database Design` | After the 8 relational entities description |
| **Figure 3.8: CI/CD Pipeline for Each MFE** | Chapter 4, Section 4.2.21 | `4.2.21 Independent Deployment` | After the automated build and deployment pipeline |
| **Figure 3.9: Deployment Architecture** | Chapter 4, Section 4.1.20 | `4.1.20 Development Environment Summary` | After the local/cloud deployment topology |
| **Figure 3.10: User Journey Flow** | Chapter 3, Section 3.4.3 | `3.4.3 Micro-Frontend Navigation Use Case` | After the cross-zone route navigation flow |
| **Figure 3.11: Repository and Code Structure** | Chapter 4, Section 4.1.6 | `4.1.6 Source Code Structure` | In place of the monorepo directory tree text |
| **Figure 3.12: Testing and Evaluation Workflow** | Chapter 5, Section 5.1.22 | `5.1.22 Summary of Testing Strategy` | At the conclusion of the testing methodology |
| **Figure 3.13: Scalability Experiment Workflow** | Chapter 5, Section 5.2.10 | `5.2.10 Scalability Results` | Before the Experiment D scalability results |
| **Figure 3.14: Maintainability Experiment Workflow** | Chapter 5, Section 5.3.4 | `5.3.4 Objective Four` | In the maintainability and change-isolation section |

---

## 📖 Detailed Placement & Surrounding Text

### 1. Figure 3.1: High-Level System Architecture
* **Target Section**: `3.3 System Architecture` $\rightarrow$ `3.3.1 High-Level Architectural Model`
* **Search in Word**: `3.3.1 High-Level Architectural Model`
* **Preceding Text**:
  > *"The proposed architecture is organized into three major tiers: the client presentation layer, the application services layer, and the data layer..."*
* **👉 Insert Image Here**: `Figure 3.1: High-Level System Architecture`
* **Caption**: `Figure 3.1: High-Level System Architecture of NexaSphere`
* **Following Text**:
  > *"3.3.2 Client Layer: The client presentation layer is structured as an ensemble of independently developed micro-frontend applications..."*

---

### 2. Figure 3.2: Micro-Frontend Architecture
* **Target Section**: `3.3 System Architecture` $\rightarrow$ `3.3.4 Micro-Frontend Layer`
* **Search in Word**: `3.3.4 Micro-Frontend Layer`
* **Preceding Text**:
  > *"The micro-frontend layer contains the individual domain applications that provide business functionality. Each micro-frontend is focused on a specific functional domain..."*
* **👉 Insert Image Here**: `Figure 3.2: Micro-Frontend Architecture`
* **Caption**: `Figure 3.2: Micro-Frontend Architectural Composition`
* **Following Text**:
  > *"3.3.5 Application Composition Mechanism: Runtime composition enables the application shell to load remote micro-frontends dynamically..."*

---

### 3. Figure 3.3: Domain and API Interaction
* **Target Section**: `3.4 System Design` $\rightarrow$ `3.4.13 API Design`
* **Search in Word**: `3.4.13 API Design`
* **Preceding Text**:
  > *"The API design follows a domain-oriented structure that aligns backend endpoints with the functional requirements of individual micro-frontends..."*
* **👉 Insert Image Here**: `Figure 3.3: Domain and API Interaction`
* **Caption**: `Figure 3.3: Domain Micro-Frontend and API Interaction Architecture`
* **Following Text**:
  > *"3.4.14 Error and Response Design: A consistent response structure simplifies error handling across all micro-frontends..."*

---

### 4. Figure 3.4: System Context Diagram
* **Target Section**: `3.4 System Design` $\rightarrow$ `3.4.1 Use Case Model`
* **Search in Word**: `3.4.1 Use Case Model`
* **Preceding Text**:
  > *"The use case model defines the interactions between users, the application shell, micro-frontends, and external systems..."*
* **👉 Insert Image Here**: `Figure 3.4: System Context Diagram`
* **Caption**: `Figure 3.4: NexaSphere System Context and Actor Diagram`
* **Following Text**:
  > *"3.4.2 User Authentication Use Case: Authentication is required before users can access protected enterprise domains..."*

---

### 5. Figure 3.5: User Authentication Flow
* **Target Section**: `3.4 System Design` $\rightarrow$ `3.4.2 User Authentication Use Case`
* **Search in Word**: `3.4.2 User Authentication Use Case`
* **Preceding Text**:
  > *"When a user submits credentials through the login interface, the request is validated against the authentication service. Upon verification, a JSON Web Token (JWT) is returned..."*
* **👉 Insert Image Here**: `Figure 3.5: User Authentication Flow`
* **Caption**: `Figure 3.5: User Authentication and Role-Based Access Sequence Flow`
* **Following Text**:
  > *"3.4.3 Micro-Frontend Navigation Use Case: Navigation between functional domains is coordinated through the application shell..."*

---

### 6. Figure 3.6: MFE Loading and Error Handling
* **Target Section**: `3.4 System Design` $\rightarrow$ `3.4.7 Failure Handling Workflow`
* **Search in Word**: `3.4.7 Failure Handling Workflow`
* **Preceding Text**:
  > *"The failure-handling design aims to prevent an issue in one micro-frontend from propagating to the rest of the application. When a remote component throws an error, the local error boundary intercepts the exception..."*
* **👉 Insert Image Here**: `Figure 3.6: MFE Loading and Error Handling`
* **Caption**: `Figure 3.6: Micro-Frontend Loading, Error Boundary, and Fallback Sequence`
* **Following Text**:
  > *"3.4.8 Class and Component Responsibilities: The architecture defines explicit responsibilities for each layer..."*

---

### 7. Figure 3.7: Database Schema Overview
* **Target Section**: `3.4 System Design` $\rightarrow$ `3.4.11 Database Design`
* **Search in Word**: `3.4.11 Database Design`
* **Preceding Text**:
  > *"The database design defines the persistent data structures that support the micro-frontend domains. The schema is organized into 8 relational entities..."*
* **👉 Insert Image Here**: `Figure 3.7: Database Schema Overview`
* **Caption**: `Figure 3.7: Database Schema and Entity Relationship Overview`
* **Following Text**:
  > *"3.4.12 Entity Relationships: The entities are structured to minimize circular dependencies..."*

---

### 8. Figure 3.8: CI/CD Pipeline for Each MFE
* **Target Section**: `4.2 Implementation Details` $\rightarrow$ `4.2.21 Independent Deployment`
* **Search in Word**: `4.2.21 Independent Deployment`
* **Preceding Text**:
  > *"Each micro-frontend possesses an independent continuous integration and deployment pipeline. Code changes in one domain trigger automated tests and matrix builds strictly for that service..."*
* **👉 Insert Image Here**: `Figure 3.8: CI/CD Pipeline for Each MFE`
* **Caption**: `Figure 3.8: Continuous Integration and Independent Deployment Pipeline`
* **Following Text**:
  > *"4.2.22 Version Compatibility: Independent deployment requires mechanisms to ensure runtime compatibility between the shell and remotes..."*

---

### 9. Figure 3.9: Deployment Architecture
* **Target Section**: `4.1 Development Environment` $\rightarrow$ `4.1.20 Development Environment Summary`
* **Search in Word**: `4.1.20 Development Environment Summary`
* **Preceding Text**:
  > *"The development environment was structured to reproduce the principal characteristics of the proposed architecture across 10 concurrent services..."*
* **👉 Insert Image Here**: `Figure 3.9: Deployment Architecture`
* **Caption**: `Figure 3.9: NexaSphere Multi-Zone Deployment Architecture`
* **Following Text**:
  > *"4.2 Implementation Details: The implementation of the proposed system translates the architectural decisions into a functional web application..."*

---

### 10. Figure 3.10: User Journey Flow
* **Target Section**: `3.4 System Design` $\rightarrow$ `3.4.3 Micro-Frontend Navigation Use Case`
* **Search in Word**: `3.4.3 Micro-Frontend Navigation Use Case`
* **Preceding Text**:
  > *"Navigation between functional domains is coordinated through the application shell. When a user selects a new domain, the shell determines the micro-frontend associated with the requested route..."*
* **👉 Insert Image Here**: `Figure 3.10: User Journey Flow`
* **Caption**: `Figure 3.10: End-to-End Enterprise User Journey Flow`
* **Following Text**:
  > *"3.4.4 Micro-Frontend Communication Design: Communication between micro-frontends is designed to minimise direct coupling..."*

---

### 11. Figure 3.11: Repository and Code Structure
* **Target Section**: `4.1 Development Environment` $\rightarrow$ `4.1.6 Source Code Structure`
* **Search in Word**: `4.1.6 Source Code Structure`
* **Preceding Text**:
  > *"The implementation was organized around separate application boundaries using a pnpm workspace monorepo. A representative structure is shown below:"*
* **👉 Insert Image Here**: `Figure 3.11: Repository and Code Structure`
* **Caption**: `Figure 3.11: Monorepo Workspace and Codebase Structure`
* **Following Text**:
  > *"The structure demonstrates an important distinction between the application shell and individual micro-frontends..."*

---

### 12. Figure 3.12: Testing and Evaluation Workflow
* **Target Section**: `5.1 Testing Strategy` $\rightarrow$ `5.1.22 Summary of Testing Strategy`
* **Search in Word**: `5.1.22 Summary of Testing Strategy`
* **Preceding Text**:
  > *"The testing strategy was designed to evaluate the proposed micro-frontend architecture from multiple perspectives, combining unit, integration, deployment, and performance tests..."*
* **👉 Insert Image Here**: `Figure 3.12: Testing and Evaluation Workflow`
* **Caption**: `Figure 3.12: Multi-Tier Testing and Evaluation Workflow`
* **Following Text**:
  > *"5.2 Test Results: The testing activities described in Section 5.1 were used to evaluate the functional behaviour..."*

---

### 13. Figure 3.13: Scalability Experiment Workflow
* **Target Section**: `5.2 Test Results` $\rightarrow$ `5.2.10 Scalability Results`
* **Search in Word**: `5.2.10 Scalability Results`
* **Preceding Text**:
  > *"Scalability testing focused on the ability to introduce another application domain (Analytics MFE) without modifying the internal implementation of existing micro-frontends..."*
* **👉 Insert Image Here**: `Figure 3.13: Scalability Experiment Workflow`
* **Caption**: `Figure 3.13: Scalability Experiment Execution Workflow (Experiment D)`
* **Following Text**:
  > *"The results of the horizontal scalability experiment confirmed that new remotes can be integrated in under two minutes..."*

---

### 14. Figure 3.14: Maintainability Experiment Workflow
* **Target Section**: `5.3 Evaluation of Objectives` $\rightarrow$ `5.3.4 Objective Four`
* **Search in Word**: `5.3.4 Objective Four`
* **Preceding Text**:
  > *"The maintainability experiment examined whether domain feature enhancements remain strictly isolated to the originating micro-frontend..."*
* **👉 Insert Image Here**: `Figure 3.14: Maintainability Experiment Workflow`
* **Caption**: `Figure 3.14: Maintainability and Change Isolation Experiment Workflow (Experiment E)`
* **Following Text**:
  > *"Evaluation: Achieved, subject to the results of the security, maintainability, and failure-isolation tests."*
