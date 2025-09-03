// Load projects data and dynamically populate the projects section
class ProjectsLoader {
    constructor() {
        this.projectsData = null;
    }

    async loadProjectsData() {
        try {
            const response = await fetch('./assets/data/projects.json');
            this.projectsData = await response.json();
            return this.projectsData;
        } catch (error) {
            console.error('Error loading projects data:', error);
            return null;
        }
    }

    createTechnologyList(technologies) {
        if (!technologies || technologies.length === 0) return '';
        
        return technologies.map(tech => `
            <li class="${technologies.length > 1 ? 'me-2' : 'me-auto'}">
                <img src="${tech.logo}" alt="${tech.name}" width="32" height="32"
                     class="rounded-circle border border-white" />
            </li>
        `).join('');
    }

    createFeaturedProject(project) {
        return `
            <div class="row row-cols-1 align-items-stretch g-4 pt-5 pb-4 hiddenBlur">
                <div class="col ${project.classes}" data-bs-toggle="modal" data-bs-target="${project.modalTarget}">
                    <div class="neumorphism h-100 overflow-hidden rounded-4 hoverable" id="${project.id}">
                        <img src="${project.image}" alt="${project.alt}"
                            style="object-fit: cover; width: 100%; height: 100%; position: absolute; z-index: -1;" />

                        <div class="d-flex flex-column h-100 p-5 text-white text-shadow-1">
                            <h3 class="display-6 lh-1 fw-bold mb-0 mt-auto">
                                ${project.title}
                            </h3>
                            <div class="d-flex justify-content-between align-items-center">
                                ${project.description}
                                <ul class="d-flex list-unstyled mb-0 flex">
                                    ${this.createTechnologyList(project.technologies)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createMainProject(project) {
        return `
            <div class="col default-col ${project.staggerClass} hiddenBlur" data-bs-toggle="modal" data-bs-target="${project.modalTarget}">
                <div class="neumorphism h-100 overflow-hidden rounded-4 hoverable" id="${project.id}">
                    <img src="${project.image}" alt="${project.alt}"
                        style="object-fit: cover; width: 100%; height: 100%; position: absolute; z-index: -1;" />

                    <div class="d-flex flex-column h-100 p-5 text-white text-shadow-1">
                        <h3 class="display-6 lh-1 fw-bold mb-0 mt-auto">
                            ${project.title}
                        </h3>
                        <div class="d-flex justify-content-between align-items-center">
                            ${project.description}
                            <ul class="d-flex list-unstyled mb-0 flex">
                                ${this.createTechnologyList(project.technologies)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createSmallProject(project) {
        const marginStyle = project.marginClass === 'margin-left' ? 'style="margin-left: -12px;"' : 
                           project.marginClass === 'margin-right' ? 'style="margin-right: -12px;"' : '';
        
        const classes = project.classes || '';
        const staggerClass = project.staggerClass || '';
        
        return `
            <div class="projColSm ${staggerClass} ${classes} hiddenBlur" ${marginStyle}>
                <a href="${project.link}" class="text-decoration-none text-reset" target="_blank">
                    <div class="neumorphism h-100 overflow-hidden rounded-4">
                        <div class="d-flex flex-column h-100 p-5">
                            <h3 class="mb-4 display-7 lh-1 fw-bold">${project.title}</h3>
                            ${project.description}
                            <span class="mt-auto">
                                <span class="text-decoration-none richLink fw-bold" target="_blank" style="cursor: pointer;">${project.linkText}</span>
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    createNavigationButtons() {
        return `
            <div class="d-flex justify-content-end mt-5 position-relative hiddenBlur" style="z-index: 2;">
                <button type="button" class="btn btn-light rounded-circle neumorphicButton me-2 p-2 lh-1 leftProject"
                    style="width: 35px; height: 35px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-chevron-left faded" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                            stroke="currentColor" stroke-width="1.5" />
                    </svg>
                </button>
                <button type="button" class="btn btn-light rounded-circle neumorphicButton p-2 lh-1 rightProject"
                    style="width: 35px; height: 35px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-chevron-right faded" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                            stroke="currentColor" stroke-width="1.5" />
                    </svg>
                </button>
            </div>
        `;
    }

    async renderProjects() {
        const data = await this.loadProjectsData();
        if (!data) {
            console.error('Failed to load projects data');
            return;
        }

        const projectsContainer = document.querySelector('#Projects').parentElement;
        if (!projectsContainer) {
            console.error('Projects container not found');
            return;
        }

        // Create the complete projects HTML
        const projectsHTML = `
            <div class="container px-4 py-5 darkModeText">
                <h2 id="Projects" class="pb-2 hiddenBlur">Projects</h2>

                <!-- Featured Project -->
                ${this.createFeaturedProject(data.featuredProject)}

                <!-- Main Projects (2x2 grid) -->
                <div class="row row-cols-1 row-cols-xl-2 align-items-stretch g-4 pb-4">
                    ${data.mainProjects.map(project => this.createMainProject(project)).join('')}
                </div>

                <!-- Small Projects Scrollable Section -->
                <div class="container-fluid position-relative hiddenBlur" style="z-index: 1;">
                    <div class="row flex-nowrap scrollport" id="projectsScrollport" style="white-space:initial;">
                        ${data.smallProjects.map(project => this.createSmallProject(project)).join('')}
                    </div>
                </div>

                <!-- Navigation Buttons -->
                ${this.createNavigationButtons()}
            </div>
        `;

        // Replace the entire projects container content
        projectsContainer.innerHTML = projectsHTML;

        // Dispatch event to notify other scripts that projects have been loaded
        // This ensures compatibility with scrollport.js and other dependent scripts
        const projectsLoadedEvent = new CustomEvent('projectsLoaded', {
            detail: { projectsData: data }
        });
        document.dispatchEvent(projectsLoadedEvent);

        // Also dispatch the fragmentsLoaded event that scrollport.js expects
        // Add a small delay to ensure DOM is fully updated
        setTimeout(() => {
            const fragmentsLoadedEvent = new CustomEvent('fragmentsLoaded');
            document.dispatchEvent(fragmentsLoadedEvent);
        }, 50);
    }
}

// Initialize and load projects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const projectsLoader = new ProjectsLoader();
    projectsLoader.renderProjects();
});

// Export for potential use in other scripts
if (typeof window !== 'undefined') {
    window.ProjectsLoader = ProjectsLoader;
}