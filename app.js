// ============================================================================
// CAPSULE SIZING & PACKAGING APPLICATION LOGIC
// Supports:
// 1. 3 Distinct Non-Generic Design Styles (Swiss Clinical, Executive Slate, Warm Apothecary)
// 2. Company Selection Hub (Capsuline, Capsule Depot, Pet Caps)
// 3. Whole List of Sizes + Side Arrow Dropdown (inspect Weight & Bag without navigating)
// 4. Dedicated Size View (scroll through all quantities for one size)
// 5. Isolated Single Quantity Focus View ("the only one I'll be looking at")
// 6. Smart Search Bar with `S (size)` and `Q (quantity)` shorthand support
// ============================================================================

(function () {
  "use strict";

  // Application State
  const state = {
    theme: "style-1",
    activeCompanyId: null,     // null = Hub View, or 'capsuline' | 'capsule-depot' | 'pet-caps'
    dedicatedSize: null,       // null = All sizes list, or size string like '00'
    isolatedItem: null,        // null, or { size, label, isSeparated, item }
    expandedDropdowns: new Set(), // Tracks which sizes have their side-arrow dropdown open
    searchQuery: ""
  };

  // DOM Elements
  const htmlEl = document.documentElement;
  const appHeader = document.getElementById("appHeader");

  const brandHomeBtn = document.getElementById("brandHomeBtn");
  const crumbHub = document.getElementById("crumbHub");
  const crumbSepCompany = document.getElementById("crumbSepCompany");
  const crumbCompany = document.getElementById("crumbCompany");
  const crumbSepSize = document.getElementById("crumbSepSize");
  const crumbSize = document.getElementById("crumbSize");

  const hubView = document.getElementById("hubView");
  const companyView = document.getElementById("companyView");
  const companyCardsContainer = document.getElementById("companyCardsContainer");

  const backToHubBtn = document.getElementById("backToHubBtn");
  const activeCompanyName = document.getElementById("activeCompanyName");
  const activeCompanyBadge = document.getElementById("activeCompanyBadge");
  const activeCompanySubtitle = document.getElementById("activeCompanySubtitle");
  const companyQuickTabs = document.getElementById("companyQuickTabs");
  const companyNoticeBanner = document.getElementById("companyNoticeBanner");

  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchParsedBadges = document.getElementById("searchParsedBadges");
  const syntaxChips = document.querySelectorAll(".syntax-chip");

  const modeStatusBar = document.getElementById("modeStatusBar");
  const modeStatusText = document.getElementById("modeStatusText");
  const backToSizeListBtn = document.getElementById("backToSizeListBtn");
  const resetToAllSizesBtn = document.getElementById("resetToAllSizesBtn");

  const sizesContentArea = document.getElementById("sizesContentArea");

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    renderHubCards();
    renderCompanyQuickTabs();
    bindEvents();
    updateView();
  }

  function formatNumber(num) {
    return Number(num).toLocaleString("en-US");
  }

  // ==========================================================================
  // SEARCH PARSER: Supports `S <size>`, `Q <quantity>`, or plain size/qty text
  // Examples:
  //   "S 00"          -> { sizeFilter: "00", qtyFilter: null }
  //   "S 0 Q 5000"    -> { sizeFilter: "0",  qtyFilter: "5000" }
  //   "s00 q1,000"    -> { sizeFilter: "00", qtyFilter: "1000" }
  //   "Q 10000"       -> { sizeFilter: null, qtyFilter: "10000" }
  //   "00"            -> { sizeFilter: "00", qtyFilter: null }
  //   "00 5000"       -> { sizeFilter: "00", qtyFilter: "5000" }
  // ==========================================================================
  function parseSearchQuery(raw) {
    const cleaned = (raw || "").trim();
    if (!cleaned) {
      return { active: false, sizeFilter: null, qtyFilter: null };
    }

    let sizeFilter = null;
    let qtyFilter = null;

    // Normalize commas in numbers (e.g., 5,000 -> 5000)
    let working = cleaned.replace(/,/g, "");

    // 1. Check explicit S <size> / Size <size> token
    const sRegex = /(?:^|\s)s(?:ize)?\s*[:=-]?\s*(000|00e|00|0|[1-5])(?=\s|$|q)/i;
    const sMatch = working.match(sRegex);
    if (sMatch) {
      sizeFilter = sMatch[1].toUpperCase();
      working = working.replace(sMatch[0], " ");
    }

    // 2. Check explicit Q <quantity> / Qty <quantity> / Quantity <quantity> token
    const qRegex = /(?:^|\s)q(?:ty|uantity)?\s*[:=-]?\s*(\d+)(?=\s|$)/i;
    const qMatch = working.match(qRegex);
    if (qMatch) {
      qtyFilter = qMatch[1];
      working = working.replace(qMatch[0], " ");
    }

    // 3. Parse any remaining natural tokens (handles "S 0 1000", "0 Q 1000", "0 1000", "1000 0", "size 0 1000")
    const remainingTokens = working
      .replace(/\b(size|qty|quantity)\b/gi, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const validSizes = ["000", "00E", "00", "0", "1", "2", "3", "4", "5"];

    for (const token of remainingTokens) {
      const upper = token.toUpperCase();
      if (!sizeFilter && validSizes.includes(upper)) {
        sizeFilter = upper;
      } else if (!qtyFilter && /^\d+$/.test(token)) {
        qtyFilter = token;
      }
    }

    return {
      active: Boolean(sizeFilter || qtyFilter),
      sizeFilter,
      qtyFilter,
      raw: cleaned
    };
  }

  // ==========================================================================
  // RENDER HUB CARDS
  // ==========================================================================
  function renderHubCards() {
    const companies = Object.values(CAPSULE_DATA);
    companyCardsContainer.innerHTML = companies
      .map((comp) => {
        const totalSizes = comp.sizes.length;
        const totalConfigs = comp.sizes.reduce(
          (acc, s) => acc + s.items.length + (s.separated ? s.separated.length : 0),
          0
        );
        const sizePills = comp.sizes
          .map((s) => `<span class="mini-size-pill">Size ${s.size}</span>`)
          .join("");

        return `
          <button type="button" class="company-card" data-company-id="${comp.id}">
            <div class="company-card-top">
              <div class="company-card-header">
                <h2 class="company-card-title">${comp.name}</h2>
                <span class="company-card-tag">${comp.badge}</span>
              </div>
              <p class="company-card-desc">${comp.subtitle}</p>
              <div class="company-card-stats">
                <div class="stat-item">
                  <span class="stat-value">${totalSizes}</span>
                  <span class="stat-label">Capsule Sizes</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">${totalConfigs}</span>
                  <span class="stat-label">Pack Specs</span>
                </div>
              </div>
              <div class="company-size-pills">
                ${sizePills}
              </div>
            </div>
            <div class="company-card-footer">
              <span>Open ${comp.name} Sizing List</span>
              <span class="card-arrow-icon">&rarr;</span>
            </div>
          </button>
        `;
      })
      .join("");
  }

  function renderCompanyQuickTabs() {
    const companies = Object.values(CAPSULE_DATA);
    companyQuickTabs.innerHTML = companies
      .map(
        (comp) => `
        <button type="button" class="company-tab-btn" data-company-id="${comp.id}">
          ${comp.name}
        </button>
      `
      )
      .join("");
  }

  // ==========================================================================
  // MAIN VIEW UPDATER
  // ==========================================================================
  function applyActiveTheme() {
    const activeThemeKey = state.activeCompanyId || "style-1";
    state.theme = activeThemeKey;
    htmlEl.setAttribute("data-theme", activeThemeKey);
  }

  function updateView() {
    // 0. Apply Hub (Swiss Clinical) or Company-specific theme & background logo
    applyActiveTheme();

    // 1. Update Breadcrumbs
    updateBreadcrumbs();

    // 2. Toggle between Hub View and Company View
    if (!state.activeCompanyId) {
      hubView.classList.remove("hidden");
      companyView.classList.add("hidden");
      return;
    }

    hubView.classList.add("hidden");
    companyView.classList.remove("hidden");

    const company = CAPSULE_DATA[state.activeCompanyId];
    activeCompanyName.textContent = company.name;
    activeCompanyBadge.textContent = company.badge;
    activeCompanySubtitle.textContent = company.subtitle;

    if (company.note) {
      companyNoticeBanner.textContent = company.note;
      companyNoticeBanner.classList.remove("hidden");
    } else {
      companyNoticeBanner.classList.add("hidden");
    }

    // Highlight active company quick tab
    document.querySelectorAll(".company-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.companyId === state.activeCompanyId);
    });

    // Clear button visibility
    clearSearchBtn.classList.toggle("hidden", !state.searchQuery.trim());

    // Render parsed search badges
    const parsed = parseSearchQuery(state.searchQuery);
    renderParsedSearchBadges(parsed);

    // Update Mode Status Bar & Content Area
    renderCompanyContent(company, parsed);
  }

  function updateBreadcrumbs() {
    if (!state.activeCompanyId) {
      crumbHub.classList.add("active");
      crumbSepCompany.classList.add("hidden");
      crumbCompany.classList.add("hidden");
      crumbSepSize.classList.add("hidden");
      crumbSize.classList.add("hidden");
      return;
    }

    const company = CAPSULE_DATA[state.activeCompanyId];
    crumbHub.classList.remove("active");
    crumbSepCompany.classList.remove("hidden");
    crumbCompany.classList.remove("hidden");
    crumbCompany.textContent = company.name;

    if (state.isolatedItem) {
      crumbCompany.classList.remove("active");
      crumbSepSize.classList.remove("hidden");
      crumbSize.classList.remove("hidden");
      crumbSize.textContent = `${state.isolatedItem.label} (${formatNumber(state.isolatedItem.item.quantity)} pcs)`;
    } else if (state.dedicatedSize) {
      crumbCompany.classList.remove("active");
      crumbSepSize.classList.remove("hidden");
      crumbSize.classList.remove("hidden");
      crumbSize.textContent = `Size ${state.dedicatedSize}`;
    } else {
      crumbCompany.classList.add("active");
      crumbSepSize.classList.add("hidden");
      crumbSize.classList.add("hidden");
    }
  }

  function renderParsedSearchBadges(parsed) {
    if (!parsed.active) {
      searchParsedBadges.innerHTML = "";
      return;
    }
    const badges = [];
    if (parsed.sizeFilter) {
      badges.push(`<span class="parsed-badge">Size: ${parsed.sizeFilter}</span>`);
    }
    if (parsed.qtyFilter) {
      badges.push(`<span class="parsed-badge">Qty: ${formatNumber(parsed.qtyFilter)}</span>`);
    }
    searchParsedBadges.innerHTML = badges.join("");
  }

  // ==========================================================================
  // COMPANY CONTENT RENDERING (Handles 3 Modes: Isolated, Dedicated Size, All Sizes)
  // ==========================================================================
  function renderCompanyContent(company, parsedSearch) {
    // MODE A: ISOLATED SINGLE QUANTITY VIEW ("the only one I'll be looking at")
    if (state.isolatedItem) {
      modeStatusBar.classList.remove("hidden");
      modeStatusText.textContent = `Isolated View: ${state.isolatedItem.label} — ${formatNumber(state.isolatedItem.item.quantity)} Capsules`;
      backToSizeListBtn.classList.remove("hidden");
      backToSizeListBtn.textContent = `Show All ${state.isolatedItem.label} Quantities`;
      sizesContentArea.innerHTML = renderIsolatedQuantityHTML(company, state.isolatedItem);
      return;
    }

    // MODE B: DEDICATED SINGLE SIZE VIEW (Clicked on a size row to scroll through all quantities)
    if (state.dedicatedSize && !parsedSearch.active) {
      const sizeObj = company.sizes.find((s) => s.size.toUpperCase() === state.dedicatedSize.toUpperCase());
      if (sizeObj) {
        modeStatusBar.classList.remove("hidden");
        modeStatusText.textContent = `Dedicated Size View: ${sizeObj.label} (${sizeObj.items.length} Quantities)`;
        backToSizeListBtn.classList.add("hidden");
        sizesContentArea.innerHTML = renderDedicatedSizeHTML(company, sizeObj);
        return;
      }
    }

    // MODE C: WHOLE LIST OF SIZES (Default or Filtered by Search Bar)
    if (parsedSearch.active) {
      modeStatusBar.classList.remove("hidden");
      modeStatusText.textContent = `Search Results in ${company.name}`;
      backToSizeListBtn.classList.add("hidden");
    } else {
      modeStatusBar.classList.add("hidden");
    }

    // Filter sizes & quantities according to search query (exact match only)
    const effectiveSizeFilter = parsedSearch.sizeFilter || state.dedicatedSize;
    const filteredSizes = [];
    company.sizes.forEach((sizeObj) => {
      const matchesSize =
        !effectiveSizeFilter ||
        sizeObj.size.toUpperCase() === effectiveSizeFilter.toUpperCase();

      if (!matchesSize) return;

      const matchingItems = sizeObj.items.filter((item) => {
        if (!parsedSearch.qtyFilter) return true;
        return Number(item.quantity) === Number(parsedSearch.qtyFilter);
      });

      const matchingSeparated = (sizeObj.separated || []).filter((sep) => {
        if (!parsedSearch.qtyFilter) return true;
        return Number(sep.quantity) === Number(parsedSearch.qtyFilter);
      });

      if (matchingItems.length > 0 || matchingSeparated.length > 0) {
        filteredSizes.push({
          ...sizeObj,
          filteredItems: matchingItems,
          filteredSeparated: matchingSeparated
        });
      }
    });

    if (filteredSizes.length === 0) {
      sizesContentArea.innerHTML = `
        <div class="empty-search-state">
          <h3>No matching capsule size or quantity found</h3>
          <p>Try searching with <code>S 00</code>, <code>S 0 Q 5000</code>, or clear your search filter to view all sizes for ${company.name}.</p>
          <button type="button" class="primary-action-btn" id="emptyResetSearchBtn">Show All Sizes</button>
        </div>
      `;
      return;
    }

    sizesContentArea.innerHTML = `
      <div class="sizes-list-stack">
        ${filteredSizes.map((s) => renderSizeRowCardHTML(s, parsedSearch)).join("")}
      </div>
    `;
  }

  // ==========================================================================
  // HTML BUILDERS FOR THE 3 MODES
  // ==========================================================================

  // 1. Size Row Card with Side Arrow Dropdown + Main Row Click for Dedicated Size
  function renderSizeRowCardHTML(sizeObj, parsedSearch) {
    // Auto-expand dropdown if searching by S/Q or if user toggled the side arrow
    const isExpanded = parsedSearch.active || state.expandedDropdowns.has(sizeObj.size);
    const itemsToShow = sizeObj.filteredItems || sizeObj.items;
    const sepToShow = sizeObj.filteredSeparated || sizeObj.separated || [];

    const qtyPreviewList = itemsToShow
      .slice(0, 5)
      .map((i) => formatNumber(i.quantity))
      .join(", ");
    const moreCount = itemsToShow.length > 5 ? ` +${itemsToShow.length - 5} more` : "";

    return `
      <div class="size-row-card ${isExpanded ? "expanded" : ""}" data-size="${sizeObj.size}">
        <div class="size-row-header">
          <!-- Clicking the main row opens the Dedicated Size view -->
          <button type="button" class="size-row-main-click" data-action="open-dedicated-size" data-size="${sizeObj.size}" title="Click to view only ${sizeObj.label} quantities">
            <div class="size-title-cluster">
              <span class="size-code-badge">${sizeObj.size}</span>
              <div class="size-heading-text">
                <span class="size-name-label">${sizeObj.label}</span>
                <span class="size-meta-summary">
                  ${itemsToShow.length} quantity options (${qtyPreviewList}${moreCount})
                  ${sepToShow.length ? ` &middot; ${sepToShow.length} separated specs` : ""}
                </span>
              </div>
            </div>
            <div class="size-row-action-hint">
              <span class="open-dedicated-pill">View Dedicated Size List &rarr;</span>
            </div>
          </button>

          <!-- Side Arrow Button toggles the dropdown menu for this size -->
          <button
            type="button"
            class="size-dropdown-arrow-btn"
            data-action="toggle-dropdown"
            data-size="${sizeObj.size}"
            aria-expanded="${isExpanded}"
            title="Toggle dropdown to check quantities, weights, and bags"
          >
            <svg class="chevron-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span class="arrow-btn-caption">${isExpanded ? "Hide" : "Specs"}</span>
          </button>
        </div>

        <!-- Dropdown Drawer showing all quantities, weights, and bag/packaging -->
        <div class="size-dropdown-drawer ${isExpanded ? "" : "hidden"}">
          <div class="drawer-header-bar">
            <span class="drawer-title">${sizeObj.label} — Quantities, Weights &amp; Packaging</span>
            <span class="drawer-hint">Click any quantity card to isolate it on screen</span>
          </div>

          <div class="quantities-table-grid">
            ${itemsToShow
              .map(
                (item, idx) => `
              <button
                type="button"
                class="qty-spec-card"
                data-action="isolate-quantity"
                data-size="${sizeObj.size}"
                data-index="${idx}"
                data-separated="false"
              >
                <div class="qty-spec-top">
                  <div>
                    <span class="qty-number">${formatNumber(item.quantity)}</span>
                    <span class="qty-unit-tag">capsules${item.variantNote ? ` (${item.variantNote})` : ""}</span>
                  </div>
                  <span class="qty-focus-link">Isolate &rarr;</span>
                </div>
                <div class="qty-spec-metrics">
                  <div class="metric-box">
                    <span class="metric-label">Weight</span>
                    <span class="metric-val">${item.weight}</span>
                  </div>
                  <div class="metric-box">
                    <span class="metric-label">Bag / Packaging</span>
                    <span class="metric-val">${item.packaging}</span>
                  </div>
                </div>
              </button>
            `
              )
              .join("")}
          </div>

          ${
            sepToShow.length > 0
              ? `
            <div class="separated-section-block">
              <div class="separated-title">${sizeObj.label} (Separated Capsules — Body &amp; Cap Specs)</div>
              <div class="separated-grid">
                ${sepToShow
                  .map(
                    (sep, sIdx) => `
                  <button
                    type="button"
                    class="qty-spec-card"
                    data-action="isolate-quantity"
                    data-size="${sizeObj.size}"
                    data-index="${sIdx}"
                    data-separated="true"
                  >
                    <div class="qty-spec-top">
                      <div>
                        <span class="qty-number">${formatNumber(sep.quantity)}</span>
                        <span class="qty-unit-tag">separated capsules</span>
                      </div>
                      <span class="qty-focus-link">Isolate &rarr;</span>
                    </div>
                    <div class="separated-spec-metrics">
                      <div class="metric-box">
                        <span class="metric-label">Body Weight / Bag</span>
                        <span class="metric-val">${sep.bodyWeight} &middot; ${sep.bodyBag}</span>
                      </div>
                      <div class="metric-box">
                        <span class="metric-label">Cap Weight / Bag</span>
                        <span class="metric-val">${sep.capWeight} &middot; ${sep.capBag}</span>
                      </div>
                    </div>
                  </button>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  // 2. Dedicated Size View (Full scrollable list of quantities for one chosen size)
  function renderDedicatedSizeHTML(company, sizeObj) {
    return `
      <div class="dedicated-size-container">
        <div class="dedicated-size-banner">
          <div class="dedicated-size-title-wrap">
            <span class="size-code-badge">${sizeObj.size}</span>
            <div>
              <h2>${sizeObj.label} — Full Quantity Schedule</h2>
              <p class="dedicated-instruction">
                Scroll through the quantities below and click the one you need to make it the only specification on screen.
              </p>
            </div>
          </div>
        </div>

        <div class="dedicated-quantity-list">
          ${sizeObj.items
            .map(
              (item, idx) => `
            <button
              type="button"
              class="dedicated-qty-row"
              data-action="isolate-quantity"
              data-size="${sizeObj.size}"
              data-index="${idx}"
              data-separated="false"
            >
              <div>
                <span class="d-col-label">Quantity</span>
                <span class="d-col-value">${formatNumber(item.quantity)} pcs ${item.variantNote ? `<small>(${item.variantNote})</small>` : ""}</span>
              </div>
              <div>
                <span class="d-col-label">Target Weight</span>
                <span class="d-col-value">${item.weight}</span>
              </div>
              <div>
                <span class="d-col-label">Bag / Packaging</span>
                <span class="d-col-value">${item.packaging}</span>
              </div>
              <div class="d-col-action">
                Select &amp; Isolate &rarr;
              </div>
            </button>
          `
            )
            .join("")}
        </div>

        ${
          sizeObj.separated && sizeObj.separated.length > 0
            ? `
          <div class="separated-section-block">
            <div class="separated-title">${sizeObj.label} (Separated Capsules — Body &amp; Cap Schedule)</div>
            <div class="dedicated-quantity-list">
              ${sizeObj.separated
                .map(
                  (sep, sIdx) => `
                <button
                  type="button"
                  class="dedicated-qty-row"
                  data-action="isolate-quantity"
                  data-size="${sizeObj.size}"
                  data-index="${sIdx}"
                  data-separated="true"
                >
                  <div>
                    <span class="d-col-label">Separated Quantity</span>
                    <span class="d-col-value">${formatNumber(sep.quantity)} pcs</span>
                  </div>
                  <div>
                    <span class="d-col-label">Body (Weight / Bag)</span>
                    <span class="d-col-value">${sep.bodyWeight} / ${sep.bodyBag}</span>
                  </div>
                  <div>
                    <span class="d-col-label">Cap (Weight / Bag)</span>
                    <span class="d-col-value">${sep.capWeight} / ${sep.capBag}</span>
                  </div>
                  <div class="d-col-action">
                    Select &amp; Isolate &rarr;
                  </div>
                </button>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  // 3. Isolated Single Quantity Card ("make it the only one I'll be looking at")
  function renderIsolatedQuantityHTML(company, isolated) {
    const { label, isSeparated, item } = isolated;

    if (isSeparated) {
      return `
        <div class="isolated-focus-stage">
          <div class="isolated-card">
            <div class="isolated-top-tag">Isolated Specification &middot; Separated Capsules</div>
            <div class="isolated-header">
              <h2 class="isolated-size-title">${label} (Separated)</h2>
              <span class="isolated-company-name">${company.name}</span>
            </div>

            <div class="isolated-metrics-grid">
              <div class="isolated-metric-tile">
                <span class="isolated-metric-label">Capsule Quantity</span>
                <span class="isolated-metric-value">${formatNumber(item.quantity)} pcs</span>
              </div>
              <div class="isolated-metric-tile">
                <span class="isolated-metric-label">Body Weight &amp; Bag</span>
                <span class="isolated-metric-value">${item.bodyWeight} (${item.bodyBag})</span>
              </div>
              <div class="isolated-metric-tile">
                <span class="isolated-metric-label">Cap Weight &amp; Bag</span>
                <span class="isolated-metric-value">${item.capWeight} (${item.capBag})</span>
              </div>
            </div>

            <div class="isolated-footer-actions">
              <button type="button" class="secondary-action-btn" data-action="return-dedicated-size">
                &larr; Back to ${label} Quantities
              </button>
              <button type="button" class="primary-action-btn" data-action="return-all-sizes">
                View All ${company.name} Sizes
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="isolated-focus-stage">
        <div class="isolated-card">
          <div class="isolated-top-tag">Isolated Packing Specification</div>
          <div class="isolated-header">
            <h2 class="isolated-size-title">${label}</h2>
            <span class="isolated-company-name">${company.name}</span>
          </div>

          <div class="isolated-metrics-grid">
            <div class="isolated-metric-tile">
              <span class="isolated-metric-label">Quantity</span>
              <span class="isolated-metric-value">${formatNumber(item.quantity)} pcs</span>
            </div>
            <div class="isolated-metric-tile">
              <span class="isolated-metric-label">Target Weight</span>
              <span class="isolated-metric-value">${item.weight}</span>
            </div>
            <div class="isolated-metric-tile">
              <span class="isolated-metric-label">Bag / Packaging</span>
              <span class="isolated-metric-value">${item.packaging}</span>
            </div>
          </div>

          <div class="isolated-footer-actions">
            <button type="button" class="secondary-action-btn" data-action="return-dedicated-size">
              &larr; Back to ${label} Quantities
            </button>
            <button type="button" class="primary-action-btn" data-action="return-all-sizes">
              View All ${company.name} Sizes
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================
  function bindEvents() {
    // 0. Smooth Auto-hide App Header on intentional scroll down, reveal on scroll up
    let lastScrollY = window.scrollY || 0;
    let scrollDeltaAccum = 0;
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;

        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY || 0);
          const delta = currentScrollY - lastScrollY;

          if (appHeader) {
            if (currentScrollY <= 30) {
              appHeader.classList.remove("header-hidden");
              scrollDeltaAccum = 0;
            } else {
              // Reset accumulator when scroll direction reverses
              if ((delta > 0 && scrollDeltaAccum < 0) || (delta < 0 && scrollDeltaAccum > 0)) {
                scrollDeltaAccum = 0;
              }
              scrollDeltaAccum += delta;

              // Require a sustained downward scroll (> 32px) past 64px before hiding smoothly
              if (scrollDeltaAccum > 32 && currentScrollY > 64) {
                appHeader.classList.add("header-hidden");
                scrollDeltaAccum = 0;
              } else if (scrollDeltaAccum < -16) {
                appHeader.classList.remove("header-hidden");
                scrollDeltaAccum = 0;
              }
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
      },
      { passive: true }
    );

    // 1. Hub Card Selection
    companyCardsContainer.addEventListener("click", (e) => {
      const card = e.target.closest(".company-card");
      if (!card) return;
      selectCompany(card.dataset.companyId);
    });

    // 3. Quick Company Switcher Tabs
    companyQuickTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".company-tab-btn");
      if (!tab) return;
      selectCompany(tab.dataset.companyId);
    });

    // 4. Back to Hub / Breadcrumb Navigation
    backToHubBtn.addEventListener("click", goToHub);
    brandHomeBtn.addEventListener("click", goToHub);
    crumbHub.addEventListener("click", goToHub);

    crumbCompany.addEventListener("click", () => {
      state.dedicatedSize = null;
      state.isolatedItem = null;
      updateView();
    });

    // 5. Mode Status Bar Buttons
    backToSizeListBtn.addEventListener("click", () => {
      if (state.isolatedItem) {
        state.dedicatedSize = state.isolatedItem.size;
        state.isolatedItem = null;
        updateView();
      }
    });

    resetToAllSizesBtn.addEventListener("click", () => {
      state.dedicatedSize = null;
      state.isolatedItem = null;
      state.searchQuery = "";
      searchInput.value = "";
      updateView();
    });

    // 6. Search Input & S/Q Shorthand Chips
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      // Exit isolated view when user types in search bar so they immediately see matching size & dropdown
      state.isolatedItem = null;
      updateView();
    });

    // Pressing Enter in the search bar locks onto the exact quantity/size looked for
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        state.searchQuery = searchInput.value;
        const parsed = parseSearchQuery(state.searchQuery);
        if (!parsed.active || !state.activeCompanyId) {
          updateView();
          return;
        }

        const company = CAPSULE_DATA[state.activeCompanyId];
        const targetSizeCode = parsed.sizeFilter || state.dedicatedSize;

        // Find matching items across the target size (or all sizes if no size specified)
        const matches = [];
        company.sizes.forEach((sizeObj) => {
          if (targetSizeCode && sizeObj.size.toUpperCase() !== targetSizeCode.toUpperCase()) {
            return;
          }
          if (parsed.qtyFilter) {
            sizeObj.items.forEach((item) => {
              if (Number(item.quantity) === Number(parsed.qtyFilter)) {
                matches.push({ size: sizeObj.size, label: sizeObj.label, isSeparated: false, item });
              }
            });
            if (matches.length === 0 && sizeObj.separated) {
              sizeObj.separated.forEach((sep) => {
                if (Number(sep.quantity) === Number(parsed.qtyFilter)) {
                  matches.push({ size: sizeObj.size, label: sizeObj.label, isSeparated: true, item: sep });
                }
              });
            }
          }
        });

        // If a single exact quantity match is found (or size + quantity specified), isolate that exact one
        if (matches.length === 1) {
          state.isolatedItem = matches[0];
          searchInput.blur();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (parsed.sizeFilter && !parsed.qtyFilter) {
          // If only a size was searched and Enter pressed, open that dedicated size
          const matchedSize = company.sizes.find(
            (s) => s.size.toUpperCase() === parsed.sizeFilter.toUpperCase()
          );
          if (matchedSize) {
            state.dedicatedSize = matchedSize.size;
            state.isolatedItem = null;
            searchInput.blur();
          }
        }
        updateView();
      }
    });

    clearSearchBtn.addEventListener("click", () => {
      state.searchQuery = "";
      searchInput.value = "";
      searchInput.focus();
      updateView();
    });

    syntaxChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.dataset.query;
        state.searchQuery = q;
        searchInput.value = q;
        state.isolatedItem = null;
        state.dedicatedSize = null;
        updateView();
      });
    });

    // 7. Delegated Clicks inside Sizes Content Area
    sizesContentArea.addEventListener("click", (e) => {
      // Empty state reset button
      if (e.target.id === "emptyResetSearchBtn") {
        state.searchQuery = "";
        searchInput.value = "";
        state.dedicatedSize = null;
        state.isolatedItem = null;
        updateView();
        return;
      }

      const actionEl = e.target.closest("[data-action]");
      if (!actionEl) return;

      const action = actionEl.dataset.action;
      const sizeCode = actionEl.dataset.size;

      // Toggle Side-Arrow Dropdown
      if (action === "toggle-dropdown") {
        e.stopPropagation();
        if (state.expandedDropdowns.has(sizeCode)) {
          state.expandedDropdowns.delete(sizeCode);
        } else {
          state.expandedDropdowns.add(sizeCode);
        }
        // If search was active and forcing dropdowns open, allow toggling
        const card = actionEl.closest(".size-row-card");
        if (card) {
          const drawer = card.querySelector(".size-dropdown-drawer");
          const caption = actionEl.querySelector(".arrow-btn-caption");
          const nowOpen = drawer.classList.toggle("hidden") === false;
          card.classList.toggle("expanded", nowOpen);
          actionEl.setAttribute("aria-expanded", String(nowOpen));
          if (caption) caption.textContent = nowOpen ? "Hide" : "Specs";
        }
        return;
      }

      // Click on Size Row -> Open Dedicated Size View
      if (action === "open-dedicated-size") {
        state.dedicatedSize = sizeCode;
        state.isolatedItem = null;
        state.searchQuery = "";
        searchInput.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
        updateView();
        return;
      }

      // Click on a Specific Quantity -> Isolate it so it's the only one on screen
      if (action === "isolate-quantity") {
        const company = CAPSULE_DATA[state.activeCompanyId];
        const sizeObj = company.sizes.find((s) => s.size === sizeCode);
        if (!sizeObj) return;

        const isSep = actionEl.dataset.separated === "true";
        const idx = parseInt(actionEl.dataset.index, 10);

        // Remember if we were filtering via search so we pick the right item index
        const parsed = parseSearchQuery(state.searchQuery);
        let sourceList = isSep ? sizeObj.separated : sizeObj.items;
        if (parsed.active && parsed.qtyFilter && !state.dedicatedSize) {
          sourceList = sourceList.filter(
            (item) => String(item.quantity) === String(parsed.qtyFilter)
          );
        }

        const chosenItem = sourceList[idx];
        if (!chosenItem) return;

        state.isolatedItem = {
          size: sizeObj.size,
          label: sizeObj.label,
          isSeparated: isSep,
          item: chosenItem
        };
        window.scrollTo({ top: 0, behavior: "smooth" });
        updateView();
        return;
      }

      // Return from Isolated View to Dedicated Size View
      if (action === "return-dedicated-size") {
        if (state.isolatedItem) {
          state.dedicatedSize = state.isolatedItem.size;
          state.isolatedItem = null;
          updateView();
        }
        return;
      }

      // Return from Isolated View to All Sizes List
      if (action === "return-all-sizes") {
        state.dedicatedSize = null;
        state.isolatedItem = null;
        updateView();
        return;
      }
    });
  }

  function selectCompany(companyId) {
    state.activeCompanyId = companyId;
    state.dedicatedSize = null;
    state.isolatedItem = null;
    state.searchQuery = "";
    state.expandedDropdowns.clear();
    searchInput.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateView();
  }

  function goToHub() {
    state.activeCompanyId = null;
    state.dedicatedSize = null;
    state.isolatedItem = null;
    state.searchQuery = "";
    searchInput.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateView();
  }

  // Start app
  init();
})();
