# The FASTR data analytics platform

## Overview

The FASTR analytics platform is a web-based tool designed to support data quality assessment, adjustment, and analysis for routine health data. It allows users to upload and analyze data from various sources, including DHIS2, with built-in statistical methods to generate an adjusted dataset and run priority analyses on selected indicators. The platform provides a user-friendly interface for running analyses and offers flexible options for visualizing and exporting results.

![Platform Capabilities](resources/diagrams/platform_capabilities.svg)

## Key capabilities

### Data management

The platform provides comprehensive data management functionality. Users can import and manage health facility structures, including administrative areas and individual facilities. The system supports data imports from Health Management Information Systems (HMIS) and Health Facility Assessments (HFA), enabling users to manage indicators from multiple sources while tracking dataset versions over time.

### Data analysis

Analytical capabilities are delivered through configurable modules. Users can enable and configure analytical modules that process data using R-based statistical scripts. These modules can be chained together to support complex, multi-step analyses, with built-in tools for monitoring processing status and reviewing logs.

### AI assistant

An integrated AI assistant helps users understand and interpret their data. The assistant can explain module outputs, describe data trends and patterns, provide insights about visualizations, and help generate narrative content for reports. Users can ask questions about their project data in natural language and receive contextual guidance on analysis and interpretation.

### Visualization

The platform offers robust visualization tools for presenting analytical results. Users can create charts, maps, and tables from processed data, with options to filter and disaggregate by multiple dimensions. Visualizations can be customized in appearance and styling and exported as images or data files for use in external applications.

### Sharing results

Once users have built visualizations, the platform offers three ways to share them, suited to different audiences:

- **Dashboards** — live, shareable pages that bundle visualizations into a single view. Charts update whenever data refreshes, and the dashboard can be published at a public link so stakeholders open it in a browser without a FASTR account.
- **Presentations** — slide-deck-style outputs designed for live meetings and workshops. Export to PowerPoint or PDF for in-person delivery.
- **Reports** — long-form narrative documents that combine written analysis with live figures. Export to Word or PDF for stakeholders reading a document end-to-end.

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

![Projects within instance](resources/diagrams/projects_within_instance.svg)


### Data flow

The platform follows a structured data flow: **Data Import → Module Processing → Visualizations → Dashboards, Presentations, and Reports**. Users first upload health facility data at the instance level. Projects are then created with specific data windows that define the scope of analysis. Analytical modules process and analyze the selected data, producing outputs that can be turned into charts, maps, and tables. Visualizations can then be assembled into dashboards for live sharing, presentations for live delivery, or narrative reports for written dissemination.


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

**Indicators** are measurable health metrics used within the platform. Three types exist:

- **Common indicators** are defined and shared across the instance for consistent measurement.
- **DHIS2 indicators** are imported from external DHIS2 systems and may follow different naming conventions or calculation methods.
- **Calculated indicators** are derived metrics that combine two values — typically a numerator indicator divided by a denominator (another indicator, or a population-based figure). For example, ANC1 visits divided by the target pregnant-women population gives an ANC1 coverage estimate. Calculated indicators can be displayed as a percent, a count, or a rate per 10,000, and they support traffic-light thresholds for quick performance review (e.g., green at or above 80%, yellow 70–79%, red below 70%).

Calculated indicators are snapshotted into a project at HMIS-import time, so changing a definition forces a re-import to take effect. Population-based denominators require a population CSV to be uploaded at the instance level before they can be used.

### Datasets and versions

A **dataset** is a collection of health data, either HMIS or HFA. Each time data is imported into the platform, a new version is created. This versioning system allows users to track changes over time, switch between versions if needed, and maintain a complete data history for audit and comparison purposes.

### Modules

**Modules** are data processing units that execute analytical R scripts within the platform. Each module takes input data from datasets or from the outputs of other modules, processes and analyzes the data according to defined statistical methods, and produces results objects as output files. Modules can be chained together to support complex analytical workflows where one module uses another's outputs as its inputs.

The platform distinguishes between two module types. A **Module Definition** is the template or blueprint for a type of analysis, defining the analytical methods and parameters available. A **Module Instance** is a module that has been enabled and configured within a specific project. Some modules have prerequisites, meaning that other modules must be enabled first before they can be used.

### Visualizations

**Visualizations** are visual representations of data generated from module outputs. The platform supports three main visualization types: charts (including bar charts, line graphs, and pie charts), maps (geographic visualizations showing data across administrative areas), and tables (tabular data displays).

Visualizations can be filtered by various dimensions and disaggregated by factors such as facility type, time period, or administrative level. Users can customize the appearance and styling of visualizations, and export them for use in external applications or include them directly in dashboards, presentations, or reports.

### Dashboards

**Dashboards** are live, shareable pages that bundle saved visualizations into one view. Each tile on a dashboard is a chart, map, or table that updates automatically whenever the underlying data refreshes — so a dashboard always shows the current state of the data without re-exporting.

Dashboards can be published at a public URL (with optional access controls) so stakeholders open them in a browser without needing a FASTR account. Two layouts are available: a **grid** arranges tiles in rows and columns, and a **sidebar** organizes tiles into a left-side menu for navigation.

Dashboards also support **replicant groups** — a single tile can hold many variants of the same chart (for example, one per district), with a dropdown that lets the viewer switch between them. This keeps the dashboard compact when the same analysis needs to be shown for many areas.

### Presentations

**Presentations** are slide-deck-style outputs designed for live workshops or stakeholder meetings. The editor lays out one chart, title, or text block per slide, similar to PowerPoint. Presentations export to PowerPoint (.pptx) or PDF and are best suited for findings that will be projected in a room while someone walks the audience through them.

### Reports

**Reports** are long-form narrative documents that combine your written analysis with live figures from the platform. The editor works like a word processor with markdown formatting: users write commentary, embed visualizations that update automatically when data refreshes, and add static images for context.

Reports export to **Word (.docx) or PDF** and are designed for stakeholders reading a document end-to-end, rather than sitting through a presentation. Use a presentation when the deliverable will be projected in a meeting; use a report when the deliverable will be read on a desk or in an inbox.

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

!!! tip "User guide"
    For step-by-step tutorials on using the platform, see the [FASTR user guide](11_user_guide.md).

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
## FASTR analytics platform

The **FASTR analytics platform** is a web-based tool designed to support data quality assessment, adjustment, and analysis for routine health data.

It allows users to upload and analyze data from various sources, including DHIS2, with built-in statistical methods to generate an adjusted dataset and run priority analyses on selected indicators.

The platform provides a user-friendly interface for running analyses and offers flexible options for visualizing and exporting results.

<div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">

![h:180](../resources/screenshots/platform/platform_overview_1.png) ![h:180](../resources/screenshots/platform/platform_overview_2.png) ![h:180](../resources/screenshots/platform/platform_overview_3.png)

</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_1b -->
## Platform capabilities

<div class="columns">
<div>

![Platform Capabilities](../resources/diagrams/platform_capabilities.svg)

</div>
<div>

**Data Management** — Import facility lists and indicator data from DHIS2 or files

**Data Analysis** — Run statistical modules for quality assessment and adjustment

**Visualization** — Explore results with interactive charts and tables

**Sharing results** — Build live dashboards, slide presentations, or narrative reports for stakeholders

**Collaboration** — Work together with your team on shared projects

**AI Assistant** — Get help interpreting results and understanding your data

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_2a -->
## Country Instance

Each country has its own **instance** of the FASTR analytics platform.

An instance contains:

- All registered users and their accounts
- The shared administrative structure (regions, districts, facilities)
- Indicator definitions and data sources
- All projects created for that country

**Think of an instance as your country's dedicated workspace.**
<!-- /SLIDE -->

<!-- SLIDE:m3_2b -->
## User Roles and Permissions

There are two levels of permissions in the platform:

&nbsp;

**Instance-level roles:**

- **Instance Administrators** can add users, create projects, assign roles, upload data, import and configure modules, and run analyses

&nbsp;

**Project-level roles:**

- **Project Editors** can create visualizations, create reports, and download/export results
- **Project Viewers** can view visualizations, view reports, and download/export results

&nbsp;

*Administrators are assigned per instance; Editors and Viewers are assigned per project.*
<!-- /SLIDE -->

<!-- SLIDE:m3_2c -->
## Projects Within an Instance

<style scoped>
.container { display: flex; gap: 1rem; }
.container .img-col { flex: 2; }
.container .img-col img { width: 100%; height: auto; }
.container .text-col { flex: 1; font-size: 0.85em; }
</style>

<div class="container">
<div class="img-col">

![Projects within instance](../resources/diagrams/projects_within_instance.svg)

</div>
<div class="text-col">

Each country instance can contain **multiple projects**.

A country may only need one project, or multiple projects can be used for:

- Different versions of analyses
- A demo or playground project
- Separate projects for different teams or programs

**Key questions when setting up:**

- Who is the admin?
- Who can edit?
- Who can view?

</div>
</div>
<!-- /SLIDE -->

---

**Contact**: <fastr@worldbank.org>
