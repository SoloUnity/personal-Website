// Load skills data and dynamically populate the skills section
class SkillsLoader {
    constructor() {
        this.skillsData = null;
    }

    async loadSkillsData() {
        try {
            const response = await fetch('./assets/data/skills.json');
            this.skillsData = await response.json();
            return this.skillsData;
        } catch (error) {
            console.error('Error loading skills data:', error);
            return null;
        }
    }

    createSkillItem(skill) {
        // Handle special case for GitHub with dual theme logos
        if (typeof skill.logo === 'object' && skill.logo.light && skill.logo.dark) {
            return `
                <div class="col d-flex align-items-start">
                    <!-- GitHub Logo - Light Theme -->
                    <img src="${skill.logo.light}" alt="${skill.name} logo"
                        class="bi text-body-secondary flex-shrink-0 me-3 github-logo github-logo-light" width="28em" height="28em" />
                    <!-- GitHub Logo - Dark Theme -->
                    <img src="${skill.logo.dark}" alt="${skill.name} logo"
                        class="bi text-body-secondary flex-shrink-0 me-3 github-logo github-logo-dark" width="28em" height="28em" />
                    <div>
                        <h3 class="mb-0 fs-4">${skill.name}</h3>
                        <p class="faded">${skill.level || '&nbsp;'}</p>
                    </div>
                </div>
            `;
        }

        // Regular skill item with single logo
        return `
            <div class="col d-flex align-items-start">
                <img src="${skill.logo}" alt="${skill.name} logo" 
                    class="bi text-body-secondary flex-shrink-0 me-3" width="28em" height="28em" />
                <div>
                    <h3 class="mb-0 fs-4">${skill.name}</h3>
                    <p class="faded">${skill.level || '&nbsp;'}</p>
                </div>
            </div>
        `;
    }

    createSkillCategory(category) {
        return `
            <div class="col ${category.staggerClass} hiddenBlur">
                <div class="neumorphism h-100 overflow-hidden rounded-4">
                    <div class="d-flex flex-column h-100 p-5 text-shadow-1">
                        <h3 class="mb-4 display-6 lh-1 fw-bold">${category.title}</h3>
                        <div class="row row-cols-1 row-cols-sm-2 g-4">
                            ${category.skills.map(skill => this.createSkillItem(skill)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async renderSkills() {
        const data = await this.loadSkillsData();
        if (!data) {
            console.error('Failed to load skills data');
            return;
        }

        const skillsContainer = document.querySelector('#Skills').parentElement;
        if (!skillsContainer) {
            console.error('Skills container not found');
            return;
        }

        // Create the complete skills HTML
        const skillsHTML = `
            <div class="container px-4 py-5 darkModeText" id="icon-grid">
                <h2 id="Skills" class="pb-2 hiddenBlur">Skills</h2>

                <div class="row row-cols-1 row-cols-lg-2 align-items-stretch g-4 pt-5">
                    ${data.skillCategories.map(category => this.createSkillCategory(category)).join('')}
                </div>
            </div>
        `;

        // Replace the entire skills container content
        skillsContainer.innerHTML = skillsHTML;

        // Dispatch event to notify other scripts that skills have been loaded
        const skillsLoadedEvent = new CustomEvent('skillsLoaded', {
            detail: { skillsData: data }
        });
        document.dispatchEvent(skillsLoadedEvent);

        // Also dispatch the fragmentsLoaded event for consistency with other loaders
        setTimeout(() => {
            const fragmentsLoadedEvent = new CustomEvent('fragmentsLoaded');
            document.dispatchEvent(fragmentsLoadedEvent);
        }, 50);
    }
}

// Initialize and load skills when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const skillsLoader = new SkillsLoader();
    skillsLoader.renderSkills();
});

// Export for potential use in other scripts
if (typeof window !== 'undefined') {
    window.SkillsLoader = SkillsLoader;
}