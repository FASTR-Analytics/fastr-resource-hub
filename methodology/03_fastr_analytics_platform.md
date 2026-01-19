# The FASTR data analytics platform

## Overview

The FASTR analytics platform is a web-based tool designed to support data quality assessment, adjustment, and analysis for routine health data. It allows users to upload and analyze data from various sources, including DHIS2, with built-in statistical methods to generate an adjusted dataset and run priority analyses on selected indicators. The platform provides a user-friendly interface for running analyses and offers flexible options for visualizing and exporting results.

![Platform Capabilities](resources/diagrams/platform_capabilities.svg)

## Key capabilities

### Data management

The platform provides comprehensive data management functionality. Users can import and manage health facility structures, including administrative areas and individual facilities. The system supports data imports from Health Management Information Systems (HMIS) and Health Facility Assessments (HFA), enabling users to manage indicators from multiple sources while tracking dataset versions over time.

### Data analysis

Analytical capabilities are delivered through configurable modules. Users can enable and configure analytical modules that process data using R-based statistical scripts. These modules can be chained together to support complex, multi-step analyses, with built-in tools for monitoring processing status and reviewing logs.

### Visualization

The platform offers robust visualization tools for presenting analytical results. Users can create charts, maps, and tables from processed data, with options to filter and disaggregate by multiple dimensions. Visualizations can be customized in terms of appearance and styling, and exported as images or data files for use in external applications.

### Reporting

Reporting functionality enables users to combine multiple visualizations into comprehensive reports. Reports can be exported as PowerPoint presentations or PDF documents. Users can organize and reorder report pages to meet specific communication needs and share completed reports with stakeholders.

### Collaboration

The platform supports collaborative work through a project-based structure. Users can organize their work into discrete projects and assign team members with different roles, including viewer, editor, and administrator permissions. Access controls operate at the project level, and projects can be locked to prevent unintended changes.

## Who should use this application?

### Data analysts

Data analysts will find the platform valuable for analyzing health data trends, creating visualizations, and generating reports for decision-makers. The analytical modules and visualization tools are designed to support rigorous data analysis workflows.

### Health program managers

Health program managers can use the platform to monitor program performance, track key indicators, and share insights with their teams. The reporting functionality enables regular communication of results to support evidence-based program management.

### System administrators

System administrators are responsible for setting up the platform, managing users, importing data, and configuring the system to meet organizational needs. Administrative tools provide control over user access, data sources, and platform settings.

## How the application works

### Organization level (instance)

The **instance** serves as the organization's primary workspace within the platform. Each instance contains all registered users, the shared administrative structure (including administrative areas and health facilities), shared indicator definitions, data sources (both HMIS and HFA), and all projects created within the organization.

### Project level

**Projects** provide focused analysis workspaces within an instance. Each project allows users to select which data to include by defining specific time periods, facilities, and indicators. Within a project, users can enable analytical modules, create visualizations, and build reports tailored to specific analytical objectives.

### Data flow

The platform follows a structured data flow: **Data Import → Module Processing → Visualizations → Reports**. Users first upload health facility data at the instance level. Projects are then created with specific data windows that define the scope of analysis. Analytical modules process and analyze the selected data, producing outputs that can be used to create charts, maps, and tables. Finally, visualizations are combined into exportable reports for dissemination.

## Technical requirements

### Supported languages

The application currently supports English and French. Language settings can be configured at the instance level to meet the needs of different user communities.

### Browser requirements

The application is designed to work with modern web browsers. Chrome is recommended for optimal performance, though Firefox, Safari, and Edge are also supported. JavaScript must be enabled for full functionality.

## Basic concepts

Understanding these core concepts will help users work effectively with the application.

### Instance

An **instance** is the organization's primary workspace within the platform. It serves as the top-level container for all users, the shared administrative structure, data sources, and projects. Each organization typically operates within a single instance that provides the foundation for all analytical work.

### Projects

A **project** is a focused analysis workspace within an instance. Projects enable users to work with specific subsets of data by defining time periods, facilities, and indicators relevant to a particular analytical objective. Within each project, users can enable analytical modules, create visualizations, generate reports, and collaborate with team members. Multiple projects can exist within one instance, each with different data scopes and user access configurations.

### Structure

The **structure** defines the hierarchical organization of administrative areas and health facilities within the platform.

**Administrative areas** represent geographic boundaries organized in up to four levels. Admin Area 1 represents the country boundaries. Admin Area 2 corresponds to the largest subnational units such as provinces or regions. Admin Area 3 encompasses mid-level units like districts or departments, while Admin Area 4 represents smaller units such as communes or sub-districts. Not all instances require all four administrative levels.

**Health facilities** are the healthcare service delivery points—including hospitals, clinics, and health posts—that are linked to administrative areas within the structure. Facilities may have additional attributes such as facility type (hospital, health center, or dispensary) and ownership category (public, private, or faith-based).

### Data sources

#### HMIS data

Health Management Information System (HMIS) data contains routine health service statistics collected from facilities. This includes service delivery indicators, disease surveillance data, and program performance metrics. HMIS data is typically reported on a monthly basis and forms the foundation for most routine health system analyses.

#### HFA data

Health Facility Assessment (HFA) data contains information about facility characteristics and capacity. This includes data on infrastructure availability, equipment and supplies, staffing levels, and service readiness. HFA data complements HMIS data by providing context about the facilities from which routine data is reported.

### Indicators

**Indicators** are measurable health metrics used within the platform. These can be either **Common Indicators**, which are defined and shared across the instance for consistent measurement, or **DHIS2 Indicators**, which are imported from external DHIS2 systems and may follow different naming conventions or calculation methods.

### Datasets and versions

A **dataset** is a collection of health data, either HMIS or HFA. Each time data is imported into the platform, a new version is created. This versioning system allows users to track changes over time, switch between versions if needed, and maintain a complete data history for audit and comparison purposes.

### Modules

**Modules** are data processing units that execute analytical R scripts within the platform. Each module takes input data from datasets or from the outputs of other modules, processes and analyzes the data according to defined statistical methods, and produces results objects as output files. Modules can be chained together to support complex analytical workflows where one module uses another's outputs as its inputs.

The platform distinguishes between two module types. A **Module Definition** is the template or blueprint for a type of analysis, defining the analytical methods and parameters available. A **Module Instance** is a module that has been enabled and configured within a specific project. Some modules have prerequisites, meaning that other modules must be enabled first before they can be used.

### Visualizations (presentation objects)

**Visualizations**, also referred to as presentation objects, are visual representations of data generated from module outputs. The platform supports three main visualization types: charts (including bar charts, line graphs, and pie charts), maps (geographic visualizations showing data across administrative areas), and tables (tabular data displays).

Visualizations can be filtered by various dimensions and disaggregated by factors such as facility type, time period, or administrative level. Users can customize the appearance and styling of visualizations, and export them for use in external applications or include them directly in reports.

### Reports

**Reports** are collections of visualization pages designed for export and sharing with stakeholders. Reports can be exported as PowerPoint presentations or PDF documents, and can be organized with multiple pages configured with custom layouts and orientations. Each page in a report is a **report item** that contains a visualization.

### Windowing

**Windowing** refers to the process of selecting a subset of instance data for use within a project. Users can filter data by time period (selecting specific months or years), by indicators (including all or only specific indicators), by administrative areas (including all or specific regions), and by facilities (filtering by facility type or ownership). This functionality allows projects to focus on the data most relevant to their analytical objectives without loading the entire dataset.

### Disaggregation

**Disaggregation** refers to the process of breaking down data by dimensions to identify patterns and variations. Data can be disaggregated by time period (monthly, quarterly, or yearly), by administrative area level, by facility type, by facility ownership, or by indicator categories. This capability supports more nuanced analysis and helps identify disparities across different dimensions.

### User roles

Users can be assigned different roles that determine their permissions within the platform. At the **instance level**, Global Administrators have full access to all instance settings and projects. At the **project level**, three roles are available: Administrators can modify project settings, modules, visualizations, and reports; Editors can create and modify visualizations and reports; and Viewers can view project contents but cannot make modifications.

### Data quality scores

The platform automatically assesses data completeness and accuracy, generating quality scores that help users identify potential data issues. These scores support data quality review processes and help prioritize areas requiring attention.

### Lock status

Projects can be **locked** to prevent modifications to their configuration while still allowing users to view reports. When a project is locked, modules and data settings cannot be changed, providing a mechanism to preserve analytical configurations once they have been finalized.

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

<!-- SLIDE:m3_1b -->
## Platform Capabilities

![Platform Capabilities h:380](../resources/diagrams/platform_capabilities.svg)

Data flows from import through analysis to shareable outputs.
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
