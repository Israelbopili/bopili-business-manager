
import { useMemo, useState } from "react";
import "./App.css";

const transactions = [
  { id: 1, name: "Fresh produce", category: "Stock purchase", date: "15 Oct 2026", amount: -850, type: "expense" },
  { id: 2, name: "Walk-in sales", category: "Product sales", date: "15 Oct 2026", amount: 2450, type: "sale" },
  { id: 3, name: "Electricity", category: "Utilities", date: "14 Oct 2026", amount: -320, type: "expense" },
  { id: 4, name: "Customer order", category: "Product sales", date: "14 Oct 2026", amount: 1750, type: "sale" },
  { id: 5, name: "Packaging supplies", category: "Supplies", date: "13 Oct 2026", amount: -180, type: "expense" },
];

const initialProducts = [
  { id: 1, name: "Cooking oil", category: "Groceries", stock: 8, price: 95 },
  { id: 2, name: "Rice (5 kg)", category: "Groceries", stock: 24, price: 180 },
  { id: 3, name: "Sugar (2 kg)", category: "Groceries", stock: 4, price: 65 },
  { id: 4, name: "Laundry soap", category: "Household", stock: 18, price: 35 },
];

const navItems = [
  { label: "Overview", icon: "▦" },
  { label: "Sales", icon: "↗" },
  { label: "Expenses", icon: "↙" },
  { label: "Inventory", icon: "▤" },
  { label: "Reports", icon: "▥" },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
    maximumFractionDigits: 2,
  }).format(amount);

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [period, setPeriod] = useState("7 days");
  const [search, setSearch] = useState("");
  const [products] = useState(initialProducts);
  const [showNotifications, setShowNotifications] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.name.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase());

      const matchesPage =
        activePage === "Overview" ||
        activePage === "Reports" ||
        (activePage === "Sales" && transaction.type === "sale") ||
        (activePage === "Expenses" && transaction.type === "expense");

      return matchesSearch && matchesPage;
    });
  }, [activePage, search]);

  const totalSales = transactions
    .filter((item) => item.type === "sale")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const netProfit = totalSales - totalExpenses;

  const lowStockProducts = products.filter((product) => product.stock <= 5);

  const pageDescriptions = {
    Overview: "Here's what's happening with your business today.",
    Sales: "Review your recorded sales transactions.",
    Expenses: "Keep track of your business spending.",
    Inventory: "Monitor stock levels and product prices.",
    Reports: "Review your business performance and financial summary.",
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div className="brand-copy">
            <strong>Bopili</strong>
            <span>BUSINESS MANAGER</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <button className="business-switcher" onClick={() => alert("Business switching will be available when accounts are connected.")}>
          <span className="business-avatar">MB</span>
          <span className="business-details">
            <strong>My Business</strong>
            <small>Free plan</small>
          </span>
          <span className="switch-arrow">⌄</span>
        </button>

        <div className="nav-label">MENU</div>
        <nav className="main-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activePage === item.label ? "active" : ""}`}
              onClick={() => {
                setActivePage(item.label);
                setSearch("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === "Inventory" && lowStockProducts.length > 0 && (
                <span className="nav-count">{lowStockProducts.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-symbol">✦</div>
            <strong>Grow your business</strong>
            <p>Unlock more tools as your business grows.</p>
            <button onClick={() => alert("Subscription plans will be added after the first release.")}>
              Explore plans <span>→</span>
            </button>
          </div>

          <div className="profile">
            <div className="profile-avatar">BO</div>
            <div className="profile-details">
              <strong>Business Owner</strong>
              <small>Demo account</small>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="date-display">
              <span>◷</span>
              <span>15 October 2026</span>
            </div>
            <button
              className="notification-button"
              aria-label="Show notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              ♧
              <span className="notification-dot" />
            </button>
            {showNotifications && (
              <div className="notification-popover">
                <strong>Notifications</strong>
                <p>{lowStockProducts.length} products need restocking.</p>
                <small>Demo notification</small>
              </div>
            )}
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="status-dot" /> BUSINESS OVERVIEW</div>
              <h1>{activePage === "Overview" ? "Good business starts here." : activePage}</h1>
              <p className="page-description">{pageDescriptions[activePage]}</p>
            </div>

            <div className="welcome-actions">
              <select
                className="period-select"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                aria-label="Dashboard period"
              >
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
              <button
                className="primary-button"
                onClick={() => alert("Transaction entry will be connected to the database in the next milestone.")}
              >
                <span>＋</span> Add transaction
              </button>
            </div>
          </section>

          <section className="demo-notice">
            <span className="notice-icon">i</span>
            <p>
              <strong>Preview mode:</strong> This dashboard uses sample data.
              Transactions are not saved yet.
            </p>
            <span className="demo-tag">DEMO DATA</span>
          </section>

          <section className="metrics-grid">
            <article className="metric-card">
              <div className="metric-heading">
                <span>Total sales</span>
                <span className="metric-icon sales-icon">↗</span>
              </div>
              <h2>{formatMoney(totalSales)}</h2>
              <div className="metric-footer">
                <span className="metric-neutral">Sample records</span>
                <span className="metric-period">{period}</span>
              </div>
              <div className="metric-line sales-line">
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-heading">
                <span>Total expenses</span>
                <span className="metric-icon expense-icon">↙</span>
              </div>
              <h2>{formatMoney(totalExpenses)}</h2>
              <div className="metric-footer">
                <span className="metric-neutral">Sample records</span>
                <span className="metric-period">{period}</span>
              </div>
              <div className="metric-line expense-line">
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-heading">
                <span>Net operating result</span>
                <span className="metric-icon profit-icon">◎</span>
              </div>
              <h2>{formatMoney(netProfit)}</h2>
              <div className="metric-footer">
                <span className="metric-neutral">Sales minus expenses</span>
                <span className="metric-period">Demo</span>
              </div>
              <div className="metric-line profit-line">
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-heading">
                <span>Products in stock</span>
                <span className="metric-icon stock-icon">▤</span>
              </div>
              <h2>{products.reduce((sum, product) => sum + product.stock, 0)}</h2>
              <div className="metric-footer">
                <span className={lowStockProducts.length ? "metric-warning" : "metric-neutral"}>
                  {lowStockProducts.length} low-stock products
                </span>
                <span className="metric-period">Items</span>
              </div>
              <div className="metric-line stock-line">
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="panel chart-panel">
              <div className="panel-heading">
                <div>
                  <h3>Financial overview</h3>
                  <p>Illustrative business activity</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setActivePage("Reports")}
                >
                  View reports <span>→</span>
                </button>
              </div>

              <div className="chart-legend">
                <span><i className="legend-sales" /> Sales</span>
                <span><i className="legend-expenses" /> Expenses</span>
              </div>

              <div className="chart">
                <div className="chart-y-axis">
                  <span>K3,000</span>
                  <span>K2,000</span>
                  <span>K1,000</span>
                  <span>K0</span>
                </div>
                <div className="chart-plot">
                  {[0, 1, 2, 3].map((line) => (
                    <div className="chart-gridline" key={line} />
                  ))}
                  <div className="bar-groups">
                    {[
                      { day: "Mon", sales: 48, expenses: 24 },
                      { day: "Tue", sales: 72, expenses: 35 },
                      { day: "Wed", sales: 55, expenses: 28 },
                      { day: "Thu", sales: 85, expenses: 40 },
                      { day: "Fri", sales: 65, expenses: 32 },
                      { day: "Sat", sales: 95, expenses: 46 },
                      { day: "Sun", sales: 60, expenses: 25 },
                    ].map((day) => (
                      <div className="bar-group" key={day.day}>
                        <div className="bars">
                          <div
                            className="bar bar-sales"
                            style={{ height: `${day.sales}%` }}
                            title="Illustrative sales"
                          />
                          <div
                            className="bar bar-expenses"
                            style={{ height: `${day.expenses}%` }}
                            title="Illustrative expenses"
                          />
                        </div>
                        <span className="bar-label">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="chart-footnote">Chart values are illustrative, not actual daily totals.</p>
            </article>

            <article className="panel inventory-panel">
              <div className="panel-heading">
                <div>
                  <h3>Stock alerts</h3>
                  <p>Products that may need attention</p>
                </div>
                <span className="alert-count">{lowStockProducts.length}</span>
              </div>

              {lowStockProducts.length > 0 ? (
                <div className="stock-alert-list">
                  {lowStockProducts.map((product) => (
                    <div className="stock-alert" key={product.id}>
                      <div className="product-symbol">▤</div>
                      <div className="stock-product-info">
                        <strong>{product.name}</strong>
                        <small>{product.category}</small>
                      </div>
                      <div className="stock-quantity">
                        <strong>{product.stock}</strong>
                        <small>left</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">All products are sufficiently stocked.</p>
              )}

              <button className="secondary-button full-button" onClick={() => setActivePage("Inventory")}>
                Manage inventory <span>→</span>
              </button>
            </article>
          </section>

          <section className="panel transactions-panel">
            <div className="panel-heading transaction-heading">
              <div>
                <h3>{activePage === "Expenses" ? "Recent expenses" : activePage === "Sales" ? "Recent sales" : "Recent transactions"}</h3>
                <p>Your latest recorded business activity</p>
              </div>
              <div className="transaction-tools">
                <label className="search-box">
                  <span>⌕</span>
                  <input
                    type="search"
                    placeholder="Search transactions"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
                <button className="text-button" onClick={() => setActivePage("Reports")}>
                  View all <span>→</span>
                </button>
              </div>
            </div>

            <div className="table-scroll">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>TRANSACTION</th>
                    <th>CATEGORY</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th className="amount-column">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <div className="transaction-name">
                            <span className={`transaction-symbol ${transaction.type}`}>
                              {transaction.type === "sale" ? "↗" : "↙"}
                            </span>
                            <strong>{transaction.name}</strong>
                          </div>
                        </td>
                        <td><span className="category-text">{transaction.category}</span></td>
                        <td className="date-cell">{transaction.date}</td>
                        <td><span className="status-pill">Recorded</span></td>
                        <td className={`amount-cell ${transaction.type}`}>
                          {transaction.amount < 0 ? "−" : "+"}
                          {formatMoney(Math.abs(transaction.amount))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-table">
                        No matching transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>Showing {filteredTransactions.length} of {transactions.length} sample transactions</span>
              <span className="sample-label">Sample data only</span>
            </div>
          </section>

          <footer className="app-footer">
            <span>© 2026 Bopili Business Manager</span>
            <span>Built for small businesses in Zambia <span className="footer-heart">♥</span></span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
