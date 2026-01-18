# The FASTR data analytics platform

## Overview

The FASTR analytics platform is a web-based tool designed to support data quality assessment, adjustment, and analysis for routine health data. It allows users to upload and analyze data from various sources, including DHIS2, with built-in statistical methods to generate an adjusted dataset and run priority analyses on selected indicators. The platform provides a user-friendly interface for running analyses and offers flexible options for visualizing and exporting results.

## Key capabilities

### Data management

- Import and manage health facility structure (administrative areas and facilities)
- Import HMIS (Health Management Information System) data
- Import HFA (Health Facility Assessment) data
- Manage indicators from multiple sources
- Track dataset versions over time

### Data analysis

- Enable and configure analytical modules
- Process data using R-based analytical scripts
- Chain modules together for complex analyses
- Monitor processing status and logs

### Visualization

- Create charts, maps, and tables from processed data
- Filter and disaggregate data by multiple dimensions
- Customize appearance and styling
- Export visualizations as images or data files

### Reporting

- Combine multiple visualizations into reports
- Export reports as PowerPoint presentations or PDFs
- Organize and reorder report pages
- Share reports with stakeholders

### Collaboration

- Organize work into projects
- Assign users with different roles (viewer, editor, admin)
- Control access at the project level
- Lock projects to prevent changes

## Who should use this application?

### Data analysts

Analyze health data trends, create visualizations, and generate reports for decision-makers.

### Health program managers

Monitor program performance, track indicators, and share insights with teams.

### System administrators

Set up the system, manage users, import data, and configure the platform for organizational needs.

## How the application works

### Organization level (instance)

The **instance** is your organization's workspace containing:

- All users
- Shared structure (administrative areas and health facilities)
- Shared indicators
- Data sources (HMIS, HFA)
- All projects

### Project level

**Projects** provide focused analysis workspaces:

- Select which data to include (time periods, facilities, indicators)
- Enable analytical modules
- Create visualizations
- Build reports

### Data flow

**Data Import → Module Processing → Visualizations → Reports**

1. **Data Import**: Upload health facility data at the instance level
2. **Project Setup**: Create projects with specific data windows
3. **Module Processing**: Enable modules to process and analyze data
4. **Visualizations**: Create charts, maps, and tables from module outputs
5. **Reports**: Combine visualizations into exportable reports

## Technical requirements

### Supported languages

The application supports:

- English
- French

Language settings can be configured at the instance level.

### Browser requirements

The application works best in modern web browsers:

- Chrome (recommended)
- Firefox
- Safari
- Edge

Ensure JavaScript is enabled for full functionality.

## Basic concepts

Understanding these core concepts will help you use the application effectively.

### Instance

An **instance** is your organization's workspace. It contains:

- All users
- Shared administrative structure
- Data sources
- All projects

Think of it as the top-level container for everything in the system.

### Projects

A **project** is a focused analysis workspace within an instance. Projects allow you to:

- Work with specific subsets of data (time periods, facilities, indicators)
- Enable analytical modules
- Create visualizations
- Generate reports
- Collaborate with specific team members

Multiple projects can exist in one instance, each with different data scopes and users.

### Structure

The **structure** defines the hierarchical organization of administrative areas and health facilities.

**Admin areas** are administrative boundaries organized in levels:

- **Admin Area 1**: Largest geographic unit (e.g., provinces, regions)
- **Admin Area 2**: Mid-level unit (e.g., districts, departments)
- **Admin Area 3**: Smaller unit (e.g., communes, sub-districts)
- **Admin Area 4**: Smallest unit (e.g., villages, wards)

Not all instances use all four levels.

**Health facilities** are healthcare service delivery points (hospitals, clinics, health posts) linked to admin areas. Facilities may have additional attributes like:

- Facility type (hospital, health center, dispensary)
- Ownership (public, private, faith-based)

### Data sources

#### HMIS data

Health Management Information System data contains routine health service statistics:

- Service delivery indicators
- Disease surveillance
- Program performance metrics
- Typically reported monthly

#### HFA data

Health Facility Assessment data contains facility characteristics and capacity information:

- Infrastructure availability
- Equipment and supplies
- Staffing levels
- Service readiness

### Indicators

Measurable health metrics that can be:

- **Common Indicators**: Defined and shared across the instance
- **DHIS2 Indicators**: Imported from external DHIS2 systems

### Datasets and versions

A **dataset** is a collection of health data (HMIS or HFA). Each time data is imported, a new version is created, allowing you to:

- Track changes over time
- Switch between versions if needed
- Maintain data history

### Modules

**Modules** are data processing units that execute analytical R scripts. They:

- Take input data (from datasets or other modules)
- Process and analyze the data
- Produce results objects (output files)
- Can be chained together (one module uses another's outputs)

**Module types:**

- **Module Definition**: The template or blueprint for a type of analysis
- **Module Instance**: A module enabled and configured in a specific project

Modules may have prerequisites—other modules that must be enabled first.

### Visualizations (presentation objects)

**Visualizations** (also called presentation objects) are visual representations of data:

- **Charts**: Bar charts, line graphs, pie charts, etc.
- **Maps**: Geographic visualizations showing data across administrative areas
- **Tables**: Tabular data displays

Visualizations use data from module outputs and can be:

- Filtered by various dimensions
- Disaggregated (broken down by facility type, time period, etc.)
- Styled and customized
- Exported or included in reports

### Reports

**Reports** are collections of visualization pages designed for export and sharing. Reports can be:

- Exported as PowerPoint presentations
- Exported as PDF documents
- Organized with multiple pages
- Configured with custom layouts and orientations

Each page in a report is a **report item** containing a visualization.

### Windowing

**Windowing** means selecting a subset of instance data for a project. You can filter by:

- **Time period**: Select specific months/years
- **Indicators**: Include all or specific indicators
- **Administrative areas**: Include all or specific regions
- **Facilities**: Filter by facility type or ownership

This allows projects to focus on relevant data without loading everything.

### Disaggregation

**Disaggregation** means breaking down data by dimensions to see patterns:

- By time period (monthly, quarterly, yearly)
- By administrative area level
- By facility type
- By facility ownership
- By indicator categories

### User roles

Users can have different roles determining their permissions:

**At instance level:**

- **Global Admin**: Full access to all instance settings and projects

**At project level:**

- **Admin**: Can modify project settings, modules, visualizations, and reports
- **Editor**: Can create and modify visualizations and reports
- **Viewer**: Can view but not modify project contents

### Data quality scores

The system automatically assesses data completeness and accuracy, providing quality scores to help identify data issues.

### Lock status

Projects can be **locked** to prevent modifications to configuration while allowing report viewing. Locked projects cannot have modules or data settings changed.

---

### FASTR User Guide:

#### 0.1 Platform overview
Introduction to the FASTR analytics platform, key features and capabilities

0.1 Landing page tour <iframe src="https://scribehow.com/embed/01_Landing_page_tour__Ixq2SHWYShuwaxBwQMJWMA" width="800" height="679" allow="fullscreen" style="aspect-ratio: 1 / 1; border: 0; min-height: 480px"></iframe>

#### 1.0 Accessing the FASTR analytics platform
Creating accounts, signing in, user permissions and roles

1.1 Requesting a country instance 
To request a country instance, contact Ashley Sheffel at asheffel@worldbank.org  
1.2 Creating a FASTR Analytics platform account <iframe src="https://scribehow.com/embed/12_Creating_a_FASTR_Analytics_platform_account__9Av54dcqRTK1XkP1mYAc_g" width="800" height="679" allow="fullscreen" style="aspect-ratio: 1 / 1; border: 0; min-height: 480px"></iframe>
1.3 Signing into the platform <iframe src="https://scribehow.com/embed/13_Signing_into_the_platform__ICDGCqyIQ6SxAcK4RKou7g" width="800" height="679" allow="fullscreen" style="aspect-ratio: 1 / 1; border: 0; min-height: 480px"></iframe>
1.4 Access FAQ

#### 2.0 Modules
Understanding modules, Available analysis modules, module installation, running analyses

#### 3.0 Visualizations
Available chart types, customization options, exporting visualizations

#### 4.0 Reports
Report templates, automated report generation, customizing reports

#### 5.0 Administration: General
Configuring admin areas (regions, districts), setting up facilities, defining indicators 

#### 6.0 Administration: Data management
Data format requirements, import process, validation and error handling

#### 7.0  Administration: Projects
Project setup workflow, configuration options, best practices

#### 8.0  Administration: Modules
Available analysis modules, module installation, running analyses


---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
//                                                                //
//            Edit workshop slides below this line                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m3_1 -->
## Introduction to the FASTR Analytics Platform

The FASTR analytics platform is a web-based tool for data quality assessment, adjustment, and analysis of routine health data.

**Key features:**

- Upload and analyze data from DHIS2 and other sources
- Built-in statistical methods for data quality adjustment
- User-friendly interface for running analyses
- Flexible visualization and export options

**In this session, we will provide a conceptual walkthrough of the platform and its capabilities.**
<!-- /SLIDE -->

<!-- SLIDE:m3_2 -->
## Live Demo: Platform Access & Roles

**In this demo, we will:**

- Navigate to the FASTR platform
- Explore user roles: Administrator, Editor, Viewer
- Review user management and permissions
- Understand the workflow for uploading data and making analytical decisions

*Facilitator will demonstrate in the live platform*
<!-- /SLIDE -->

<!-- SLIDE:m3_3 -->
## Activity: Setting Up Admin Areas

**In this hands-on session, we will configure:**

- Admin areas (regions, districts)
- Facility structure
- Indicator definitions

*Participants will work directly in the platform*
<!-- /SLIDE -->

<!-- SLIDE:m3_4 -->
## Activity: Importing Data

**In this hands-on session, we will:**

- Review data format requirements
- Walk through the import process
- Handle validation and error checking

*Participants will import their country's data*
<!-- /SLIDE -->

<!-- SLIDE:m3_5 -->
## Activity: Installing and Running Modules

**In this hands-on session, we will:**

- Review available analysis modules
- Install required modules
- Run initial analyses

*Participants will configure and run modules on their data*
<!-- /SLIDE -->

<!-- SLIDE:m3_6 -->
## Activity: Creating a Project

**In this hands-on session, we will:**

- Set up a new project
- Configure project settings
- Select indicators and time periods
- Apply best practices for project organization

*Participants will create their first project*
<!-- /SLIDE -->

<!-- SLIDE:m3_7 -->
## Activity: Creating Visualizations

**In this hands-on session, we will:**

- Explore available chart types
- Create and customize visualizations
- Export charts for use in reports

*Participants will build visualizations from their analysis*
<!-- /SLIDE -->

<!-- SLIDE:m3_8 -->
## Activity: Creating Reports

**In this hands-on session, we will:**

- Use report templates
- Generate automated reports
- Customize report content and layout

*Participants will create their first quarterly report draft*
<!-- /SLIDE -->

---

**Last updated**: 07-01-2026
**Contact**: FASTR Project Team
