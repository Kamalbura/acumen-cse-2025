/**
 * Footer Integrity Checker
 * Ensures consistency in footer display across all pages
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ Checking footer integrity');
        checkFooter();
    });
    
    function checkFooter() {
        const footer = document.querySelector('.footer');
        
        // If footer doesn't exist, create one
        if (!footer) {
            console.warn('Footer missing - generating standard footer');
            createStandardFooter();
            return;
        }
        
        // Check if footer has proper structure
        const footerContent = footer.querySelector('.footer-content');
        const footerBottom = footer.querySelector('.footer-bottom');
        
        if (!footerContent || !footerBottom) {
            console.warn('Footer structure incomplete - regenerating');
            footer.parentNode.removeChild(footer);
            createStandardFooter();
            return;
        }
        
        // Ensure footer has all required sections
        const sections = footer.querySelectorAll('.footer-section');
        if (sections.length < 3) {
            console.warn('Footer missing sections - adding missing sections');
            fixFooterSections(footerContent);
        }
        
        // Apply any missing style fixes
        applyFooterStyleFixes();
    }
    
    function createStandardFooter() {
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        const pathPrefix = isInSubfolder ? '../' : '';
        
        const footerHtml = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section footer-logo">
                            <div class="acumen-logo-nav">
                                <span class="department-text">CSE</span>
                                <span>ACUMEN</span><span class="year-integrated">2025</span>
                            </div>
                            <p>ACUMEN 2025 | CSE Department</p>
                            <p>Vasavi College of Engineering</p>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="${pathPrefix}index.html">Home</a></li>
                                <li><a href="${pathPrefix}events.html">Events</a></li>
                                <li><a href="${pathPrefix}schedule.html">Schedule</a></li>
                                <li><a href="${pathPrefix}registration.html">Register</a></li>
                                <li><a href="${pathPrefix}team.html">Team</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Contact Us</h3>
                            <ul>
                                <li><i class="fas fa-map-marker-alt"></i> Vasavi College of Engineering, Ibrahimbagh, Hyderabad</li>
                                <li><i class="fas fa-phone"></i> +91 9876543210</li>
                                <li><i class="fas fa-envelope"></i> acumen@vasavi.ac.in</li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Follow Us</h3>
                            <div class="social-links">
                                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>&copy; 2025 ACUMEN - CSE Department, Vasavi College of Engineering. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        `;
        
        document.body.insertAdjacentHTML('beforeend', footerHtml);
    }
    
    function fixFooterSections(footerContent) {
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        const pathPrefix = isInSubfolder ? '../' : '';
        
        // Check for logo section
        if (!footerContent.querySelector('.footer-logo')) {
            const logoSection = document.createElement('div');
            logoSection.className = 'footer-section footer-logo';
            logoSection.innerHTML = `
                <div class="acumen-logo-nav">
                    <span class="department-text">CSE</span>
                    <span>ACUMEN</span><span class="year-integrated">2025</span>
                </div>
                <p>ACUMEN 2025 | CSE Department</p>
                <p>Vasavi College of Engineering</p>
            `;
            footerContent.insertBefore(logoSection, footerContent.firstChild);
        }
        
        // Check for links section
        if (!footerContent.querySelector('.footer-section:not(.footer-logo) ul a[href*="index.html"]')) {
            const linksSection = document.createElement('div');
            linksSection.className = 'footer-section';
            linksSection.innerHTML = `
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="${pathPrefix}index.html">Home</a></li>
                    <li><a href="${pathPrefix}events.html">Events</a></li>
                    <li><a href="${pathPrefix}schedule.html">Schedule</a></li>
                    <li><a href="${pathPrefix}registration.html">Register</a></li>
                    <li><a href="${pathPrefix}team.html">Team</a></li>
                </ul>
            `;
            footerContent.appendChild(linksSection);
        }
        
        // Check for contact section
        if (!footerContent.querySelector('.footer-section i.fa-map-marker-alt')) {
            const contactSection = document.createElement('div');
            contactSection.className = 'footer-section';
            contactSection.innerHTML = `
                <h3>Contact Us</h3>
                <ul>
                    <li><i class="fas fa-map-marker-alt"></i> Vasavi College of Engineering, Ibrahimbagh, Hyderabad</li>
                    <li><i class="fas fa-phone"></i> +91 9876543210</li>
                    <li><i class="fas fa-envelope"></i> acumen@vasavi.ac.in</li>
                </ul>
            `;
            footerContent.appendChild(contactSection);
        }
        
        // Check for social section
        if (!footerContent.querySelector('.social-links')) {
            const socialSection = document.createElement('div');
            socialSection.className = 'footer-section';
            socialSection.innerHTML = `
                <h3>Follow Us</h3>
                <div class="social-links">
                    <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                </div>
            `;
            footerContent.appendChild(socialSection);
        }
    }
    
    function applyFooterStyleFixes() {
        // Add inline style fixes if needed
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            /* Additional footer fixes */
            .footer-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 40px;
                margin-bottom: 40px;
            }
            
            .footer-section h3 {
                color: var(--primary-color);
                margin-bottom: 20px;
                font-size: 1.2rem;
                position: relative;
                padding-bottom: 10px;
            }
            
            /* Add mobile fixes */
            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
                
                .footer-section {
                    text-align: center;
                }
                
                .footer-section h3::after {
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                }
            }
        `;
        
        if (!document.head.querySelector('style[data-footer-fix]')) {
            styleEl.dataset.footerFix = 'true';
            document.head.appendChild(styleEl);
        }
    }
})();
