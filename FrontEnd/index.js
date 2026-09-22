/* ═══════════════════════════════════════════════════════════════
   AgentOps — Multi-Agent Business Assistant
   app.js — Full application logic
   API calls are isolated in the API section below.
   Replace mock responses with real FastAPI endpoints there.
═══════════════════════════════════════════════════════════════ */

'use strict';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION — reads from environment or defaults
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  API_BASE_URL: window.ENV_API_BASE_URL || 'http://localhost:8000',
  USE_MOCK: true, // set false when FastAPI backend is live
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA — realistic Indian e-commerce data
// Replace API_* functions below to connect real endpoints
// ═══════════════════════════════════════════════════════════════
const MOCK = {
  products: [
    { id: 1, name: 'Wireless Keyboard',   sku: 'KB-001',  category: 'Keyboards',    stock: 50,  reorder: 20, price: 1200,  status: 'in-stock' },
    { id: 2, name: 'Wireless Mouse',      sku: 'MS-001',  category: 'Peripherals',  stock: 100, reorder: 30, price: 600,   status: 'in-stock' },
    { id: 3, name: 'USB-C Hub',           sku: 'HB-001',  category: 'Accessories',  stock: 30,  reorder: 15, price: 1500,  status: 'in-stock' },
    { id: 4, name: 'Mechanical Keyboard', sku: 'MK-002',  category: 'Keyboards',    stock: 12,  reorder: 25, price: 3200,  status: 'low-stock' },
    { id: 5, name: 'Laptop Stand',        sku: 'LS-003',  category: 'Accessories',  stock: 45,  reorder: 20, price: 1800,  status: 'in-stock' },
    { id: 6, name: 'USB-C Cable 2m',      sku: 'UC-001',  category: 'Cables',       stock: 8,   reorder: 50, price: 299,   status: 'low-stock' },
    { id: 7, name: 'Webcam 1080p',        sku: 'WC-001',  category: 'Video',        stock: 0,   reorder: 10, price: 3500,  status: 'out-of-stock' },
    { id: 8, name: 'Bluetooth Speaker',   sku: 'BS-001',  category: 'Audio',        stock: 22,  reorder: 15, price: 2400,  status: 'in-stock' },
    { id: 9, name: 'HDMI Cable 1.5m',     sku: 'HM-002',  category: 'Cables',       stock: 75,  reorder: 30, price: 499,   status: 'in-stock' },
    { id: 10,'name': 'Monitor Light Bar', sku: 'ML-001',  category: 'Accessories',  stock: 18,  reorder: 20, price: 2200,  status: 'low-stock' },
  ],

  orders: [
    { id: '#10482', customer: 'Rahul Sharma',   items: 3, total: 4800,  status: 'processing', date: 'Today, 10:42 AM',   products: ['Wireless Keyboard × 2', 'USB-C Hub × 1'] },
    { id: '#10481', customer: 'Priya Singh',    items: 1, total: 1200,  status: 'completed',  date: 'Today, 09:18 AM',   products: ['Wireless Keyboard × 1'] },
    { id: '#10480', customer: 'Aditya Patel',   items: 2, total: 8400,  status: 'completed',  date: 'Today, 08:55 AM',   products: ['Mechanical Keyboard × 1', 'Webcam × 1'] },
    { id: '#10479', customer: 'Sunita Verma',   items: 4, total: 6200,  status: 'pending',    date: 'Yesterday, 06:30 PM', products: ['Wireless Mouse × 2', 'USB-C Cable × 2'] },
    { id: '#10478', customer: 'Karan Mehta',    items: 1, total: 2400,  status: 'completed',  date: 'Yesterday, 03:12 PM', products: ['Bluetooth Speaker × 1'] },
    { id: '#10477', customer: 'Divya Nair',     items: 2, total: 3900,  status: 'pending',    date: 'Yesterday, 01:40 PM', products: ['Laptop Stand × 1', 'USB-C Hub × 1'] },
    { id: '#10476', customer: 'Vikram Joshi',   items: 5, total: 9800,  status: 'processing', date: '2 days ago',          products: ['Wireless Keyboard × 3', 'Wireless Mouse × 2'] },
    { id: '#10475', customer: 'Meera Iyer',     items: 1, total: 3500,  status: 'pending',    date: '2 days ago',          products: ['Webcam 1080p × 1'] },
  ],

  agentActivity: [
    { time: '10:42 AM', agent: 'Inventory Agent', action: 'Checked inventory for Wireless Keyboard', type: 'agents', color: 'green', status: 'success' },
    { time: '10:38 AM', agent: 'Pricing Agent', action: 'Calculated order #10482 — ₹4,800', type: 'agents', color: 'blue', status: 'success' },
    { time: '10:31 AM', agent: 'Orchestrator', action: 'Started multi-agent workflow for query', type: 'agents', color: 'cyan', status: 'success' },
    { time: '10:26 AM', agent: 'Logistics Agent', action: 'Generated delivery estimate for Order #10481', type: 'agents', color: 'purple', status: 'success' },
    { time: '10:20 AM', agent: 'Inventory Agent', action: 'Low stock alert triggered — Mechanical Keyboard (12 units)', type: 'inventory', color: 'amber', status: 'warning' },
    { time: '10:15 AM', agent: 'System', action: 'New order #10482 received from Rahul Sharma', type: 'orders', color: 'blue', status: 'info' },
    { time: '10:08 AM', agent: 'Pricing Agent', action: 'Applied bulk discount — Order #10476', type: 'agents', color: 'blue', status: 'success' },
    { time: '09:55 AM', agent: 'Orchestrator', action: 'Delegated 3 tasks to specialized agents', type: 'agents', color: 'cyan', status: 'success' },
    { time: '09:48 AM', agent: 'Inventory Agent', action: 'Restocked USB-C Cable — 100 units added', type: 'inventory', color: 'green', status: 'success' },
    { time: '09:30 AM', agent: 'Logistics Agent', action: 'Route optimization completed for 5 pending shipments', type: 'agents', color: 'purple', status: 'success' },
    { time: '09:15 AM', agent: 'System', action: 'All agents initialized and online', type: 'system', color: 'green', status: 'success' },
    { time: '09:00 AM', agent: 'Orchestrator', action: 'Daily business summary generated', type: 'system', color: 'cyan', status: 'success' },
  ],

  opsChartData: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    orders:    [28, 42, 35, 58, 49, 63, 42],
    aiTasks:   [120, 185, 160, 230, 195, 240, 180],
    inventory: [15, 22, 18, 30, 25, 35, 28],
  },

  agentDetails: {
    orchestrator: {
      name: 'Orchestrator Agent',
      color: 'cyan',
      icon: 'cpu',
      description: 'The central coordination hub. Receives user requests, analyzes intent, plans multi-agent workflows, delegates to specialized agents, and synthesizes final responses.',
      capabilities: ['Task Planning & Decomposition', 'Agent Routing', 'Context Management', 'Result Synthesis', 'Error Recovery'],
      tools: ['Intent Parser', 'Workflow Planner', 'Agent Registry', 'Response Combiner'],
      tasks: 1847, avgTime: '0.8s', success: '99.2%', uptime: '99.9%',
      recentActivity: [
        { action: 'Completed multi-agent workflow for inventory query', time: '2 min ago', status: 'success' },
        { action: 'Delegated pricing task to Pricing Agent', time: '5 min ago', status: 'success' },
        { action: 'Synthesized response from 3 agents', time: '12 min ago', status: 'success' },
      ]
    },
    inventory: {
      name: 'Inventory Agent',
      color: 'green',
      icon: 'package',
      description: 'Manages real-time stock visibility. Checks product availability, monitors stock levels across the catalog, detects low-stock conditions, and triggers reorder alerts.',
      capabilities: ['Real-time Stock Lookup', 'Availability Check', 'Low Stock Detection', 'Reorder Alert', 'Batch Inventory Scan'],
      tools: ['Inventory Lookup', 'Stock Availability Checker', 'Low Stock Detector', 'Alert System'],
      tasks: 482, avgTime: '1.2s', success: '98.7%', uptime: '99.8%',
      recentActivity: [
        { action: 'Checked stock for Wireless Keyboard — 50 available', time: '2 min ago', status: 'success' },
        { action: 'Low stock alert: Mechanical Keyboard (12 units)', time: '20 min ago', status: 'warning' },
        { action: 'Batch scan of 1,284 products completed', time: '1 hr ago', status: 'success' },
      ]
    },
    pricing: {
      name: 'Pricing Agent',
      color: 'blue',
      icon: 'calculator',
      description: 'Handles all pricing and cost calculations. Computes order totals, applies dynamic discount rules, generates detailed cost breakdowns, and validates pricing accuracy.',
      capabilities: ['Order Total Calculation', 'Dynamic Pricing', 'Discount Application', 'Cost Breakdown', 'Bulk Order Pricing'],
      tools: ['Price Engine', 'Discount Calculator', 'Tax Computation', 'Order Costing'],
      tasks: 364, avgTime: '0.9s', success: '100%', uptime: '100%',
      recentActivity: [
        { action: 'Calculated order #10482 — ₹4,800 total', time: '5 min ago', status: 'success' },
        { action: 'Applied 5% bulk discount on order #10476', time: '8 min ago', status: 'success' },
        { action: 'Generated pricing breakdown for 25 units of Wireless Keyboard', time: '30 min ago', status: 'success' },
      ]
    },
    logistics: {
      name: 'Logistics Agent',
      color: 'purple',
      icon: 'truck',
      description: 'Provides delivery intelligence. Estimates delivery timelines based on location and carrier data, calculates shipping costs, and optimizes routes for order fulfilment.',
      capabilities: ['Delivery Estimation', 'Shipping Cost Calculation', 'Carrier Selection', 'Route Optimization', 'Fulfilment Tracking'],
      tools: ['Delivery Estimator', 'Shipping Calculator', 'Carrier API', 'Route Optimizer'],
      tasks: 201, avgTime: '1.5s', success: '97.5%', uptime: '99.5%',
      recentActivity: [
        { action: 'Delivery estimate for Order #10481 — 3-5 business days', time: '8 min ago', status: 'success' },
        { action: 'Route optimization completed for 5 shipments', time: '30 min ago', status: 'success' },
        { action: 'Delivery failed — unserviceable PIN code 600123', time: '2 hrs ago', status: 'error' },
      ]
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// API LAYER — isolate all backend calls here
// When FastAPI backend is ready, set CONFIG.USE_MOCK = false
// and implement the real fetch calls below.
// ═══════════════════════════════════════════════════════════════
const API = {
  /**
   * POST /inventory/check
   * Check if a product is available and get pricing info.
   * @param {string} product_name
   * @param {number} quantity
   */
  async checkInventory(product_name, quantity) {
    if (CONFIG.USE_MOCK) {
      // MOCK RESPONSE — replace with real fetch when backend is ready
      await delay(1200);
      const product = MOCK.products.find(p =>
        p.name.toLowerCase().includes(product_name.toLowerCase())
      );
      if (!product) {
        return { is_available: false, message: `Product "${product_name}" not found in inventory.` };
      }
      const is_available = product.stock >= quantity;
      return {
        product: product.name,
        sku: product.sku,
        requested_quantity: quantity,
        available_stock: product.stock,
        is_available,
        unit_price: product.price,
        total_price: product.price * quantity,
        message: is_available
          ? `Product is available. ${product.stock - quantity} units will remain after this order.`
          : `Insufficient stock. Only ${product.stock} units available.`
      };
      // REAL API (uncomment when backend is ready):
      // const res = await fetch(`${CONFIG.API_BASE_URL}/inventory/check`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ product_name, quantity })
      // });
      // return res.json();
    }
  },

  async getOrders() {
    if (CONFIG.USE_MOCK) {
      await delay(600);
      return MOCK.orders;
    }
    // const res = await fetch(`${CONFIG.API_BASE_URL}/orders`);
    // return res.json();
  },

  async getProducts() {
    if (CONFIG.USE_MOCK) {
      await delay(500);
      return MOCK.products;
    }
    // const res = await fetch(`${CONFIG.API_BASE_URL}/inventory/products`);
    // return res.json();
  },

  async testConnection() {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch { return false; }
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
const PAGE_META = {
  dashboard:  { title: 'Business Overview',     subtitle: 'Monitor your operations and AI agents in real time.' },
  assistant:  { title: 'AI Business Assistant', subtitle: 'Ask the assistant to analyze and manage your business operations.' },
  agents:     { title: 'AI Agents',             subtitle: 'Four specialized agents collaborate to automate your operations.' },
  inventory:  { title: 'Inventory',             subtitle: 'Manage your product catalog and stock levels.' },
  orders:     { title: 'Orders',                subtitle: 'Track and manage customer orders.' },
  analytics:  { title: 'Analytics',             subtitle: 'Business performance and AI automation insights.' },
  activity:   { title: 'Activity Log',          subtitle: 'Real-time timeline of all system and agent events.' },
  settings:   { title: 'Settings',              subtitle: 'Configure your business, agents, and API connections.' },
};

function navigate(pageId, linkEl) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  else {
    const navEl = document.querySelector(`[data-page="${pageId}"]`);
    if (navEl) navEl.classList.add('active');
  }

  // Update header
  const meta = PAGE_META[pageId] || {};
  document.getElementById('pageTitle').textContent = meta.title || '';
  document.getElementById('pageSubtitle').textContent = meta.subtitle || '';

  // Page-specific init
  if (pageId === 'activity') renderActivityTimeline('all');
  if (pageId === 'orders')   renderOrders();

  // Close sidebar on mobile
  closeSidebar();
  return false;
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR (mobile)
// ═══════════════════════════════════════════════════════════════
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// LIVE CLOCK
// ═══════════════════════════════════════════════════════════════
function startClock() {
  function tick() {
    const d = new Date();
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    document.getElementById('liveTime').textContent = `${date} · ${time}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION DROPDOWN
// ═══════════════════════════════════════════════════════════════
function toggleNotif() {
  document.getElementById('notifDropdown').classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('notifDropdown');
  const btn = document.getElementById('notifBtn');
  if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
function showToast(message, type = 'info') {
  const icons = { success: 'check-circle', error: 'x-circle', info: 'info', warning: 'alert-triangle' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon"><i data-lucide="${icons[type] || 'info'}" width="16" height="16"></i></span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ═══════════════════════════════════════════════════════════════
// CHARTS (Chart.js)
// ═══════════════════════════════════════════════════════════════
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: {
    backgroundColor: '#0F1421',
    borderColor: '#1E2D45',
    borderWidth: 1,
    titleColor: '#F1F5F9',
    bodyColor: '#94A3B8',
    padding: 10,
    cornerRadius: 8,
  }},
  scales: {
    x: {
      grid: { color: 'rgba(30,45,69,0.5)', drawBorder: false },
      ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }
    },
    y: {
      grid: { color: 'rgba(30,45,69,0.5)', drawBorder: false },
      ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }
    }
  }
};

function createGradient(ctx, colorStop1, colorStop2) {
  const grad = ctx.createLinearGradient(0, 0, 0, 220);
  grad.addColorStop(0, colorStop1);
  grad.addColorStop(1, colorStop2);
  return grad;
}

function initOpsChart() {
  const canvas = document.getElementById('opsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const d = MOCK.opsChartData;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Orders',
          data: d.orders,
          borderColor: '#3B82F6',
          backgroundColor: createGradient(ctx, 'rgba(59,130,246,0.2)', 'rgba(59,130,246,0)'),
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#3B82F6',
        },
        {
          label: 'AI Tasks',
          data: d.aiTasks.map(v => v / 5),
          borderColor: '#10B981',
          backgroundColor: createGradient(ctx, 'rgba(16,185,129,0.15)', 'rgba(16,185,129,0)'),
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#10B981',
        },
        {
          label: 'Inventory Actions',
          data: d.inventory,
          borderColor: '#8B5CF6',
          backgroundColor: createGradient(ctx, 'rgba(139,92,246,0.15)', 'rgba(139,92,246,0)'),
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#8B5CF6',
        }
      ]
    },
    options: CHART_DEFAULTS
  });
}

function initAnalyticsCharts() {
  const revenueCanvas = document.getElementById('revenueChart');
  const ordersCanvas = document.getElementById('ordersChart');
  if (!revenueCanvas || !ordersCanvas) return;

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  new Chart(revenueCanvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Revenue (₹)',
        data: [84000, 124000, 98000, 156000, 132000, 178000, 110000],
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 5,
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: {
            label: ctx => ` ₹${ctx.raw.toLocaleString('en-IN')}`
          }
        }
      }
    }
  });

  new Chart(ordersCanvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Orders',
        data: [28, 42, 35, 58, 49, 63, 42],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10B981',
      }]
    },
    options: CHART_DEFAULTS
  });
}

// ═══════════════════════════════════════════════════════════════
// INVENTORY TABLE
// ═══════════════════════════════════════════════════════════════
let inventoryFilter = 'all';
let inventorySearch = '';

function renderInventory() {
  const body = document.getElementById('inventoryBody');
  if (!body) return;

  const filtered = MOCK.products.filter(p => {
    const matchFilter = inventoryFilter === 'all' || p.status === inventoryFilter;
    const matchSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                        p.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(inventorySearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted)">
      No products found matching your criteria.
    </td></tr>`;
    return;
  }

  body.innerHTML = filtered.map(p => {
    const stockClass = p.stock === 0 ? 'stock-critical' : p.status === 'low-stock' ? 'stock-low' : 'stock-good';
    const statusBadge = p.status === 'in-stock'
      ? '<span class="badge badge-green">In Stock</span>'
      : p.status === 'low-stock'
      ? '<span class="badge badge-amber">Low Stock</span>'
      : '<span class="badge badge-red">Out of Stock</span>';

    const catIcons = { Keyboards: 'keyboard', Peripherals: 'mouse-pointer-2', Accessories: 'layers', Cables: 'cable', Video: 'video', Audio: 'volume-2' };
    const icon = catIcons[p.category] || 'package';

    return `<tr>
      <td>
        <div class="product-cell">
          <div class="product-icon"><i data-lucide="${icon}" width="14" height="14"></i></div>
          <div class="product-name">${p.name}</div>
        </div>
      </td>
      <td><span class="sku-text">${p.sku}</span></td>
      <td>${p.category}</td>
      <td><span class="${stockClass}">${p.stock}</span></td>
      <td>${p.reorder}</td>
      <td>${formatCurrency(p.price)}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="table-action-btn" onclick="askAIAboutProduct('${p.name}')">Ask AI</button>
        <button class="table-action-btn" onclick="showToast('Edit feature requires backend','info')">Edit</button>
      </td>
    </tr>`;
  }).join('');

  lucide.createIcons({ nodes: [body] });
}

function filterInventory() {
  inventorySearch = document.getElementById('inventorySearch').value;
  renderInventory();
}

function setInventoryFilter(filter, el) {
  inventoryFilter = filter;
  document.querySelectorAll('#page-inventory .filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderInventory();
}

function askAIAboutProduct(name) {
  navigate('assistant', document.querySelector('[data-page="assistant"]'));
  setTimeout(() => {
    document.getElementById('chatInput').value = `Check stock availability for ${name} and get me the current inventory details.`;
    sendMessage();
  }, 400);
}

// ═══════════════════════════════════════════════════════════════
// ORDERS TABLE
// ═══════════════════════════════════════════════════════════════
function renderOrders(search = '') {
  const body = document.getElementById('ordersBody');
  if (!body) return;

  const filtered = MOCK.orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.status.toLowerCase().includes(search.toLowerCase())
  );

  body.innerHTML = filtered.map(o => {
    const statusMap = {
      completed:  '<span class="badge badge-green">Completed</span>',
      processing: '<span class="badge badge-blue">Processing</span>',
      pending:    '<span class="badge badge-amber">Pending</span>',
    };
    return `<tr style="cursor:pointer" onclick="openOrderPanel('${o.id}')">
      <td><span style="font-weight:600;color:var(--accent)">${o.id}</span></td>
      <td>${o.customer}</td>
      <td>${o.items} item${o.items > 1 ? 's' : ''}</td>
      <td style="font-weight:600">${formatCurrency(o.total)}</td>
      <td>${statusMap[o.status] || o.status}</td>
      <td style="color:var(--text-muted);font-size:12px">${o.date}</td>
      <td>
        <button class="table-action-btn" onclick="event.stopPropagation();openOrderPanel('${o.id}')">View</button>
      </td>
    </tr>`;
  }).join('');
}

function filterOrders(val) {
  renderOrders(val);
}

function openOrderPanel(orderId) {
  const order = MOCK.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('orderDrawerTitle').textContent = `Order ${order.id}`;
  document.getElementById('orderDrawerSubtitle').textContent = `${order.customer} · ${order.date}`;

  const statusMap = {
    completed:  '<span class="badge badge-green">Completed</span>',
    processing: '<span class="badge badge-blue">Processing</span>',
    pending:    '<span class="badge badge-amber">Pending</span>',
  };

  document.getElementById('orderDrawerContent').innerHTML = `
    <div class="drawer-section">
      <div class="drawer-section-title">Order Status</div>
      <div style="margin-bottom:12px">${statusMap[order.status]}</div>
      <div class="perf-grid">
        <div class="perf-card"><div class="perf-value">${order.items}</div><div class="perf-label">Items</div></div>
        <div class="perf-card"><div class="perf-value" style="font-size:16px;color:var(--green)">${formatCurrency(order.total)}</div><div class="perf-label">Total</div></div>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Products</div>
      ${order.products.map(p => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-soft);font-size:13px">
          <span>${p}</span>
        </div>
      `).join('')}
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Customer</div>
      <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:14px">
        <div style="font-size:14px;font-weight:600;margin-bottom:4px">${order.customer}</div>
        <div style="font-size:12px;color:var(--text-muted)">Customer since Jan 2024</div>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">AI-Generated Summary</div>
      <div style="background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(6,182,212,0.04));border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:14px;font-size:13px;line-height:1.7;color:var(--text-dim)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-weight:600;color:var(--accent)"><i data-lucide="bot" width="14" height="14"></i> AI Summary</div>
        Order ${order.id} from ${order.customer} totalling ${formatCurrency(order.total)} is currently <strong>${order.status}</strong>. 
        ${order.status === 'pending' ? 'This order is awaiting processing. Recommend reviewing and confirming within 24 hours.' : ''}
        ${order.status === 'processing' ? 'This order is being prepared. Estimated dispatch within 1-2 business days.' : ''}
        ${order.status === 'completed' ? 'This order has been successfully fulfilled. No action required.' : ''}
      </div>
    </div>

    <button class="btn btn-blue" style="width:100%;justify-content:center;margin-top:8px" onclick="showToast('Action requires backend API','info')">
      <i data-lucide="send" width="14" height="14"></i> Process Order
    </button>
  `;

  document.getElementById('orderOverlay').classList.add('open');
  document.getElementById('orderDrawer').classList.add('open');
  lucide.createIcons({ nodes: [document.getElementById('orderDrawerContent')] });
}

function closeOrderPanel() {
  document.getElementById('orderOverlay').classList.remove('open');
  document.getElementById('orderDrawer').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// AGENT DRAWER
// ═══════════════════════════════════════════════════════════════
function openAgentDrawer(agentKey) {
  const agent = MOCK.agentDetails[agentKey];
  if (!agent) return;

  const colorMap = { cyan: 'var(--cyan)', green: 'var(--green)', blue: 'var(--accent)', purple: 'var(--purple)' };
  const color = colorMap[agent.color] || 'var(--accent)';

  document.getElementById('drawerTitle').textContent = agent.name;
  document.getElementById('drawerSubtitle').textContent = 'Performance & Configuration';

  const statusColors = { success: 'badge-green', warning: 'badge-amber', error: 'badge-red' };

  document.getElementById('drawerContent').innerHTML = `
    <div class="drawer-section">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:48px;height:48px;border-radius:10px;background:${color}1a;border:1px solid ${color}40;display:flex;align-items:center;justify-content:center;color:${color}">
          <i data-lucide="${agent.icon}" width="22" height="22"></i>
        </div>
        <div>
          <div style="font-size:15px;font-weight:700">${agent.name}</div>
          <div class="agent-status-badge online" style="margin-top:4px;display:inline-block">● Online</div>
        </div>
      </div>
      <p style="font-size:13px;color:var(--text-muted);line-height:1.7">${agent.description}</p>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Performance Metrics</div>
      <div class="perf-grid">
        <div class="perf-card"><div class="perf-value" style="color:${color}">${agent.tasks.toLocaleString()}</div><div class="perf-label">Total Tasks</div></div>
        <div class="perf-card"><div class="perf-value" style="color:${color}">${agent.avgTime}</div><div class="perf-label">Avg Response</div></div>
        <div class="perf-card"><div class="perf-value" style="color:var(--green)">${agent.success}</div><div class="perf-label">Success Rate</div></div>
        <div class="perf-card"><div class="perf-value" style="color:var(--green)">${agent.uptime}</div><div class="perf-label">Uptime</div></div>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Capabilities</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${agent.capabilities.map(c => `<span class="tool-tag" style="border-color:${color}30;color:var(--text-dim)">${c}</span>`).join('')}
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Available Tools</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${agent.tools.map(t => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;font-size:12.5px">
            <i data-lucide="tool" width="13" height="13" style="color:${color}"></i>
            <span>${t}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Recent Activity</div>
      <div style="display:flex;flex-direction:column;gap:1px">
        ${agent.recentActivity.map(a => `
          <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-soft)">
            <span class="badge ${statusColors[a.status] || 'badge-blue'}" style="flex-shrink:0;align-self:flex-start;margin-top:2px">${a.status.toUpperCase()}</span>
            <div>
              <div style="font-size:12.5px;color:var(--text-dim)">${a.action}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${a.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('agentDrawer').classList.add('open');
  lucide.createIcons({ nodes: [document.getElementById('drawerContent')] });
}

function closeAgentDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('agentDrawer').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// ACTIVITY TIMELINE
// ═══════════════════════════════════════════════════════════════
function renderActivityTimeline(filter) {
  const timeline = document.getElementById('activityTimeline');
  if (!timeline) return;

  const filtered = filter === 'all'
    ? MOCK.agentActivity
    : MOCK.agentActivity.filter(a => a.type === filter);

  const statusBadge = s => {
    const m = { success: 'badge-green', warning: 'badge-amber', error: 'badge-red', info: 'badge-blue' };
    return `<span class="badge ${m[s] || 'badge-blue'}">${s.toUpperCase()}</span>`;
  };

  timeline.innerHTML = filtered.map(a => `
    <div class="timeline-item">
      <div class="timeline-time">${a.time}</div>
      <div class="timeline-dot ${a.color}"></div>
      <div class="timeline-content">
        <div class="timeline-agent">${a.agent}</div>
        <div class="timeline-desc">${a.action}</div>
        <div class="timeline-badges">${statusBadge(a.status)}<span class="badge badge-cyan" style="font-size:9.5px">${a.type}</span></div>
      </div>
    </div>
  `).join('');
}

function setActivityFilter(filter, el) {
  document.querySelectorAll('#page-activity .filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderActivityTimeline(filter);
}

// ═══════════════════════════════════════════════════════════════
// AI ASSISTANT — CHAT ENGINE
// ═══════════════════════════════════════════════════════════════
let chatHistory = [];
let isProcessing = false;

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function sendSuggestedPrompt(el) {
  const prompt = el.textContent.trim();
  document.getElementById('chatInput').value = prompt;
  sendMessage();
}

async function sendMessage() {
  if (isProcessing) return;
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  isProcessing = true;
  input.value = '';
  input.style.height = 'auto';

  // Hide welcome + suggestions on first message
  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';
  document.getElementById('suggestedPromptsArea').style.display = 'none';

  // Add user message
  appendMessage('user', text);

  // Analyze query to determine agent workflow
  const workflow = analyzeQuery(text);

  // Show execution panel
  resetExecPanel();

  // Run agent workflow
  await runAgentWorkflow(workflow, text);

  isProcessing = false;
}

function appendMessage(role, content, isHTML = false) {
  const messages = document.getElementById('chatMessages');
  const time = now();
  const isUser = role === 'user';

  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'user' : 'ai'}`;
  div.innerHTML = `
    <div class="msg-avatar ${isUser ? 'user-av' : 'ai-av'}">${isUser ? 'AK' : 'AI'}</div>
    <div>
      <div class="msg-bubble">${isHTML ? content : escapeHtml(content)}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Analyze query to decide which agents to use
function analyzeQuery(text) {
  const lower = text.toLowerCase();
  const hasInventory = /stock|inventory|available|availab|units|products|keyboard|mouse|hub|webcam|speaker|cable|stand/i.test(text);
  const hasPricing  = /price|cost|total|calculate|amount|rupee|₹|payment/i.test(text);
  const hasLogistics = /delivery|ship|dispatch|logistics|eta|days|route/i.test(text);
  const hasOrders   = /order|#\d+|orders/i.test(text);

  const agents = [];
  if (hasInventory) agents.push('inventory');
  if (hasPricing)   agents.push('pricing');
  if (hasLogistics) agents.push('logistics');
  if (!agents.length) agents.push('inventory'); // default

  // Extract product name and quantity if present
  const qtyMatch = text.match(/(\d+)\s+(wireless keyboard|wireless mouse|usb-c hub|mechanical keyboard|laptop stand|webcam|bluetooth speaker|usb-c cable|hdmi cable|monitor light)/i);
  let product = null, quantity = 1;
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1]);
    product = qtyMatch[2];
  } else {
    // Try to find product name
    const products = MOCK.products.map(p => p.name);
    for (const p of products) {
      if (lower.includes(p.toLowerCase())) {
        product = p;
        break;
      }
    }
  }

  return { agents, product, quantity, hasInventory, hasPricing, hasLogistics };
}

function resetExecPanel() {
  document.getElementById('execIdle').style.display = 'none';
  const steps = document.getElementById('execSteps');
  steps.style.display = 'block';
  steps.innerHTML = '';
}

function addExecStep(icon, name, color, status, body, result = null) {
  const steps = document.getElementById('execSteps');
  const el = document.createElement('div');
  el.className = 'exec-step';
  const statusLabel = { running: 'Running', done: 'Done', thinking: 'Thinking...' };
  el.innerHTML = `
    <div class="exec-step-header">
      <div class="exec-step-icon" style="background:var(--${color}-glow);color:var(--${color})">
        <i data-lucide="${icon}" width="13" height="13"></i>
      </div>
      <span class="exec-agent-name">${name}</span>
      <span class="exec-status ${status}">${statusLabel[status] || status}</span>
    </div>
    <div class="exec-step-body">${body}</div>
    ${result ? `<div class="exec-result"><i data-lucide="check" width="12" height="12"></i>${result}</div>` : ''}
  `;
  steps.appendChild(el);
  lucide.createIcons({ nodes: [el] });
  requestAnimationFrame(() => el.classList.add('visible'));
  return el;
}

function updateExecStep(el, status, result) {
  const badge = el.querySelector('.exec-status');
  const statusLabel = { running: 'Running', done: 'Done', thinking: 'Thinking...' };
  badge.className = `exec-status ${status}`;
  badge.textContent = statusLabel[status] || status;
  if (result) {
    const existing = el.querySelector('.exec-result');
    if (existing) {
      existing.innerHTML = `<i data-lucide="check" width="12" height="12"></i>${result}`;
      lucide.createIcons({ nodes: [existing] });
    } else {
      const res = document.createElement('div');
      res.className = 'exec-result';
      res.innerHTML = `<i data-lucide="check" width="12" height="12"></i>${result}`;
      el.appendChild(res);
      lucide.createIcons({ nodes: [res] });
    }
  }
}

async function runAgentWorkflow(workflow, query) {
  const messages = document.getElementById('chatMessages');

  // Step 1: Orchestrator thinking
  const orchStep = addExecStep('cpu', 'Orchestrator', 'cyan', 'thinking', 'Understanding your request...');
  await delay(700);
  updateExecStep(orchStep, 'running', null);
  orchStep.querySelector('.exec-step-body').textContent = `Analyzing query and planning workflow for ${workflow.agents.length} agent(s)...`;
  await delay(800);
  updateExecStep(orchStep, 'done', `Delegating to ${workflow.agents.join(', ')} agent(s)`);

  let inventoryResult = null;
  let pricingResult = null;
  let logisticsResult = null;

  // Step 2: Inventory Agent
  if (workflow.hasInventory || workflow.agents.includes('inventory')) {
    const invStep = addExecStep('package', 'Inventory Agent', 'green', 'running', workflow.product
      ? `Checking stock for "${workflow.product}"...`
      : 'Scanning inventory for low-stock products...');
    await delay(1200);

    if (workflow.product) {
      const data = await API.checkInventory(workflow.product, workflow.quantity);
      inventoryResult = data;
      updateExecStep(invStep, 'done', data.is_available
        ? `${data.available_stock} units available`
        : `Insufficient stock (${(data.available_stock || 0)} available)`
      );
    } else {
      // Low stock scan
      const lowStock = MOCK.products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock');
      inventoryResult = { lowStock };
      updateExecStep(invStep, 'done', `${lowStock.length} products need attention`);
    }
  }

  // Step 3: Pricing Agent
  if (workflow.hasPricing && inventoryResult && inventoryResult.unit_price) {
    const priceStep = addExecStep('calculator', 'Pricing Agent', 'accent', 'running',
      `Calculating total for ${workflow.quantity} × ${inventoryResult.product}...`);
    await delay(900);
    const total = inventoryResult.unit_price * workflow.quantity;
    pricingResult = { total, unit_price: inventoryResult.unit_price };
    updateExecStep(priceStep, 'done', `${formatCurrency(total)} total`);
  }

  // Step 4: Logistics Agent
  if (workflow.hasLogistics) {
    const logStep = addExecStep('truck', 'Logistics Agent', 'purple', 'running', 'Estimating delivery timeline...');
    await delay(1100);
    logisticsResult = { days: '3-5 business days', cost: 120 };
    updateExecStep(logStep, 'done', '3–5 business days estimated');
  }

  // Step 5: Orchestrator synthesizes
  await delay(500);
  const synthStep = addExecStep('cpu', 'Orchestrator', 'cyan', 'running', 'Synthesizing results...');
  await delay(600);
  updateExecStep(synthStep, 'done', 'Final response ready');

  // Generate AI response message
  const responseHTML = buildAIResponse(workflow, inventoryResult, pricingResult, logisticsResult, query);
  appendMessage('ai', responseHTML, true);
}

function buildAIResponse(workflow, inv, pricing, logistics, query) {
  const lower = query.toLowerCase();

  // Low stock check
  if (!workflow.product && inv && inv.lowStock) {
    const list = inv.lowStock.map(p =>
      `<div class="result-row"><span class="label">${p.name} (${p.sku})</span><span class="value" style="color:${p.stock===0?'var(--red)':'var(--amber)'}">Stock: ${p.stock} / Reorder: ${p.reorder}</span></div>`
    ).join('');
    return `I've scanned your inventory and found <strong>${inv.lowStock.length} products</strong> that need attention:<br/><br/>
      <div class="result-box">${list}</div>
      <br/>I recommend restocking these items soon to avoid order fulfilment issues.`;
  }

  // Inventory + Pricing
  if (inv && inv.product && pricing) {
    const available = inv.is_available;
    return `${available ? '✅' : '⚠️'} <strong>${inv.product}</strong> — here's what I found:<br/><br/>
      <div class="result-box">
        <div class="result-row"><span class="label">Available Stock</span><span class="value" style="color:var(--green)">${inv.available_stock} units</span></div>
        <div class="result-row"><span class="label">Requested Quantity</span><span class="value">${inv.requested_quantity} units</span></div>
        <div class="result-row"><span class="label">Unit Price</span><span class="value">${formatCurrency(inv.unit_price)}</span></div>
        <div class="result-row"><span class="label">Estimated Total</span><span class="value" style="color:var(--accent);font-size:15px">${formatCurrency(pricing.total)}</span></div>
        ${logistics ? `<div class="result-row"><span class="label">Est. Delivery</span><span class="value">${logistics.days}</span></div>` : ''}
      </div><br/>
      ${available
        ? `<strong>${inv.requested_quantity} units</strong> of ${inv.product} are available. After this order, <strong>${inv.available_stock - inv.requested_quantity} units</strong> would remain in stock.`
        : `Unfortunately, only <strong>${inv.available_stock} units</strong> are currently available — insufficient for your requested ${inv.requested_quantity}.`
      }`;
  }

  // Inventory only
  if (inv && inv.product) {
    return `Here's the inventory status for <strong>${inv.product}</strong>:<br/><br/>
      <div class="result-box">
        <div class="result-row"><span class="label">Available Stock</span><span class="value" style="color:${inv.is_available?'var(--green)':'var(--red)'}">${inv.available_stock} units</span></div>
        <div class="result-row"><span class="label">SKU</span><span class="value">${inv.sku}</span></div>
        <div class="result-row"><span class="label">Unit Price</span><span class="value">${formatCurrency(inv.unit_price)}</span></div>
        <div class="result-row"><span class="label">Status</span><span class="value">${inv.message}</span></div>
      </div>`;
  }

  // Logistics only
  if (logistics) {
    return `Based on current carrier data and order details:<br/><br/>
      <div class="result-box">
        <div class="result-row"><span class="label">Estimated Delivery</span><span class="value">${logistics.days}</span></div>
        <div class="result-row"><span class="label">Shipping Cost</span><span class="value">${formatCurrency(logistics.cost)}</span></div>
      </div><br/>Delivery estimate is based on standard metro shipping zones.`;
  }

  // Generic fallback
  return `I've processed your request using the available agents. For more specific results, try asking about a particular product, order, or delivery — for example: <em>"Check if 20 wireless keyboards are available"</em> or <em>"Estimate delivery for Order #10482"</em>.`;
}

// API connection test (Settings page)
async function testApiConnection() {
  const status = document.getElementById('apiStatus');
  status.innerHTML = `<span class="status-dot" style="background:var(--amber)"></span> Testing connection...`;
  const ok = await API.testConnection();
  if (ok) {
    status.innerHTML = `<span class="status-dot" style="background:var(--green)"></span> Connected to FastAPI backend`;
    showToast('Backend connected successfully!', 'success');
  } else {
    status.innerHTML = `<span class="status-dot offline"></span> Connection failed — backend not running`;
    showToast('Cannot reach backend. Is FastAPI running?', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Start clock
  startClock();

  // Initialize charts
  initOpsChart();

  // Render inventory table
  renderInventory();

  // Render orders (pre-load)
  renderOrders();

  // Render activity
  renderActivityTimeline('all');

  // Init analytics charts when that page is visible
  // (deferred to avoid canvas issues)
  document.querySelector('[data-page="analytics"]').addEventListener('click', () => {
    setTimeout(initAnalyticsCharts, 50);
  }, { once: true });

  // Auto-resize textarea
  const textarea = document.getElementById('chatInput');
  if (textarea) {
    textarea.addEventListener('input', () => autoResizeTextarea(textarea));
  }

  console.log('%c AgentOps Dashboard ', 'background:#3B82F6;color:#fff;font-size:14px;padding:4px 10px;border-radius:4px;font-weight:700');
  console.log('%c Multi-Agent Business Assistant — Ready', 'color:#10B981;font-size:12px');
  console.log(`%c API Base: ${CONFIG.API_BASE_URL} (Mock: ${CONFIG.USE_MOCK})`, 'color:#64748B;font-size:11px');
});
