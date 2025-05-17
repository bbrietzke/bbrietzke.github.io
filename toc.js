// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Introductions</a></li><li class="chapter-item expanded affix "><li class="part-title">Kubernetes</li><li class="chapter-item expanded "><a href="kube/index.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="kube/installation.html"><strong aria-hidden="true">1.1.</strong> Installation</a></li><li class="chapter-item expanded "><a href="kube/local_setup.html"><strong aria-hidden="true">1.2.</strong> Local Setup</a></li><li class="chapter-item expanded "><a href="kube/add_worker.html"><strong aria-hidden="true">1.3.</strong> Add Worker Node</a></li><li class="chapter-item expanded "><a href="kube/certmanager.html"><strong aria-hidden="true">1.4.</strong> Certificate Manager</a></li><li class="chapter-item expanded "><a href="kube/nfs_provisioner.html"><strong aria-hidden="true">1.5.</strong> NFS Provisioner</a></li><li class="chapter-item expanded "><a href="kube/metrics_server.html"><strong aria-hidden="true">1.6.</strong> Metrics Server</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Linux</li><li class="chapter-item expanded "><a href="linux/index.html"><strong aria-hidden="true">2.</strong> Introduction</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="linux/raid_setup.html"><strong aria-hidden="true">2.1.</strong> RAID Setup</a></li><li class="chapter-item expanded "><a href="linux/raid_removal.html"><strong aria-hidden="true">2.2.</strong> RAID Destruction</a></li><li class="chapter-item expanded "><a href="linux/publish_host.html"><strong aria-hidden="true">2.3.</strong> Custom Hostnames</a></li><li class="chapter-item expanded "><a href="linux/prometheus.html"><strong aria-hidden="true">2.4.</strong> Prometheus</a></li><li class="chapter-item expanded "><a href="linux/alertmanager.html"><strong aria-hidden="true">2.5.</strong> AlertManager</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Runbooks</li><li class="chapter-item expanded "><a href="runbooks/index.html"><strong aria-hidden="true">3.</strong> Introduction</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="runbooks/postgresql_create_database_user.html"><strong aria-hidden="true">3.1.</strong> PostgreSQL Database/User</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
