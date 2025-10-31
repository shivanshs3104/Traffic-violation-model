document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view");
  const pageTitle = document.getElementById("page-title");
  const violationsBody = document.getElementById("violations-body");
  const recentBody = document.getElementById("recent-violations-body");

  let allData = [];

  // Fetch violations data
  fetch("data/violations.json")
    .then(res => {
      if (!res.ok) throw new Error("Could not load violations.json");
      return res.json();
    })
    .then(data => {
      allData = data;
      renderDashboardStats(data);
      renderRecentViolations(data);
      renderViolationsTable(data);
      renderAnalysisCharts(data);
    })
    .catch(err => console.error("❌ Error loading data:", err));

  // Navigation
  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");

      navItems.forEach(b => b.classList.remove("active"));
      views.forEach(v => v.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(target).classList.add("active");

      pageTitle.textContent = btn.querySelector("span").textContent;

      // Optional: re-render charts when switching
      if (target === "view-analysis") renderAnalysisCharts(allData);
    });
  });

  // ==============================
  // DASHBOARD SECTION
  // ==============================
  function renderDashboardStats(data) {
    document.getElementById("stat-violations").textContent = data.length;
    document.getElementById("stat-pending").textContent = data.length;
    document.getElementById("stat-paid").textContent = "₹0";
    document.getElementById("stat-due").textContent = "₹" + (data.length * 500);
  }

  function renderRecentViolations(data) {
    recentBody.innerHTML = "";
    data.slice(0, 6).forEach(v => {
      const img = `data/results/images/${v.image}`;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>Unknown</td>
        <td>${v.license_plate || "N/A"}</td>
        <td>${v.violation || "N/A"}</td>
        <td>-</td>
        <td><img src="${img}" width="60" style="border-radius:6px"/></td>
        <td>${new Date().toLocaleDateString()}</td>
        <td class="right">₹500</td>
        <td class="center">Pending</td>
        <td class="right"><button class="pill-btn small view-btn">View</button></td>
      `;
      recentBody.appendChild(row);
    });
  }

  // ==============================
  // VIOLATIONS SECTION
  // ==============================
  function renderViolationsTable(data) {
    violationsBody.innerHTML = "";
    data.forEach(v => {
      const img = `data/results/images/${v.image}`;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>Unknown</td>
        <td>${v.license_plate || "N/A"}</td>
        <td>${v.violation || "N/A"}</td>
        <td>-</td>
        <td><img src="${img}" width="70" style="border-radius:6px"/></td>
        <td>${new Date().toLocaleDateString()}</td>
        <td class="right">₹500</td>
        <td class="center">Pending</td>
        <td class="right"><button class="pill-btn small view-btn">View</button></td>
      `;
      violationsBody.appendChild(row);
    });
  }

  // ==============================
  // ANALYSIS SECTION
  // ==============================
  function renderAnalysisCharts(data) {
    const typeCounts = {};
    const areaCounts = {};

    data.forEach(v => {
      const type = v.violation && v.violation !== "None" ? v.violation : "Unknown";
      const area = v.area || "Unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      areaCounts[area] = (areaCounts[area] || 0) + 1;
    });

    const typeCtx = document.getElementById("violationTypeChart").getContext("2d");
    const areaCtx = document.getElementById("areasChart").getContext("2d");

    if (window.typeChart) window.typeChart.destroy();
    if (window.areaChart) window.areaChart.destroy();

    window.typeChart = new Chart(typeCtx, {
      type: "bar",
      data: {
        labels: Object.keys(typeCounts),
        datasets: [
          {
            label: "Violations by Type",
            data: Object.values(typeCounts),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Violations by Type" }
        }
      }
    });

    window.areaChart = new Chart(areaCtx, {
      type: "pie",
      data: {
        labels: Object.keys(areaCounts),
        datasets: [
          {
            data: Object.values(areaCounts),
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)"
            ]
          }
        ]
      },
      options: {
        plugins: {
          title: { display: true, text: "Violations by Area" }
        }
      }
    });
  }
});


// --- Modal / View-button handling (paste inside DOMContentLoaded) ---
(function setupViewModal() {
  const recentBody = document.getElementById("recent-violations-body");
  const violationsBody = document.getElementById("violations-body"); // full table
  const proofModal = document.getElementById("proof-modal");
  const proofImage = document.getElementById("proof-image");
  const proofPlate = document.getElementById("proof-plate");
  const proofType = document.getElementById("proof-type");
  const proofVehicle = document.getElementById("proof-vehicle");
  const proofName = document.getElementById("proof-name");
  const proofArea = document.getElementById("proof-area");
  const proofDate = document.getElementById("proof-date");
  const proofFine = document.getElementById("proof-fine");
  const proofStatus = document.getElementById("proof-status");
  const modalClose = document.getElementById("modal-close");

  // Helper: open modal and populate fields
  function openProofModal(record) {
    const imagePath = `data/results/images/${record.image || ""}`;

    // optimistic populate fields
    proofType.textContent = record.violation || "N/A";
    proofVehicle.textContent = record.license_plate || "N/A";
    proofName.textContent = record.name || "Unknown";
    proofArea.textContent = record.area || "-";
    proofDate.textContent = record.date || new Date().toLocaleDateString();
    proofFine.textContent = record.fine ? `₹${record.fine}` : "₹500";
    proofStatus.textContent = record.status || "Pending";

    // load image and show only when loaded (prevents broken image flash)
    const img = new Image();
    img.onload = () => {
      proofImage.src = imagePath;
      // also set small plate crop if available (same image or separate)
      proofPlate.src = imagePath;
      proofModal.style.display = "flex"; // show modal (your CSS may use flex)
    };
    img.onerror = () => {
      console.warn("Image failed to load:", imagePath);
      proofImage.src = ""; // clear or set to a placeholder if you have one
      proofPlate.src = "";
      proofModal.style.display = "flex"; // still open modal so user sees text details
    };
    img.src = imagePath;
  }

  // Delegated click handler for any view-btn inside recent or violations table
  function delegatedViewClick(e) {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;

    // We expect buttons to have a data-index or data-img attribute.
    // Preferred: data-index linking to the allData array. If you don't have that,
    // we'll try to read data-img attribute and match filename.
    const dataIndex = btn.dataset.index;       // optional
    const dataImg = btn.dataset.img;           // optional: 'data/results/images/..' or just filename
    const dataViolation = btn.dataset.violation;
    const dataPlate = btn.dataset.plate;

    // Attempt to access global allData if available
    if (typeof allData !== "undefined" && Array.isArray(allData)) {
      if (dataIndex !== undefined) {
        const rec = allData[Number(dataIndex)];
        if (rec) return openProofModal(rec);
      }
      // fallback: match by filename if dataset.img only contains filename
      if (dataImg) {
        const filename = dataImg.split("/").pop();
        const rec = allData.find(r => r.image === filename || r.image === dataImg);
        if (rec) return openProofModal(rec);
      }
    }

    // If no allData or no matching record, construct a minimal record from data-* attrs
    const filename = dataImg ? dataImg.split("/").pop() : null;
    const fallbackRec = {
      image: filename,
      violation: dataViolation || "N/A",
      license_plate: dataPlate || "N/A",
      name: btn.dataset.name || "Unknown",
      date: btn.dataset.date || new Date().toLocaleDateString()
    };
    openProofModal(fallbackRec);
  }

  // Attach delegation to both table bodies (works for dynamic rows too)
  if (recentBody) recentBody.addEventListener("click", delegatedViewClick);
  if (violationsBody) violationsBody.addEventListener("click", delegatedViewClick);

  // Close modal handlers
  if (modalClose) modalClose.addEventListener("click", () => (proofModal.style.display = "none"));
  // click outside modal-dialog should close
  proofModal.addEventListener("click", (ev) => {
    if (ev.target === proofModal) proofModal.style.display = "none";
  });

  console.debug("Modal view handlers set up.");
})();
