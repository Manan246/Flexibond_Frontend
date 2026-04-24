import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiTrendingUp } from 'react-icons/fi';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import FilterBar from '../components/FilterBar';
import {
  getDashboardSummary,
  getRevenueTrend,
  getTopProducts,
  getTopCustomers,
  getCategoryBreakdown,
  getGeographic,
  getFilters
} from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '', endDate: '', salesperson: '', category: '', state: ''
  });
  const [filterOptions, setFilterOptions] = useState({});
  const [data, setData] = useState({
    summary: null,
    trend: null,
    products: null,
    customers: null,
    categories: null,
    geo: null
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        summaryRes, trendRes, productsRes, 
        customersRes, catRes, geoRes, filtersRes
      ] = await Promise.all([
        getDashboardSummary(filters),
        getRevenueTrend({ ...filters, groupBy: 'month' }),
        getTopProducts({ ...filters, limit: 10 }),
        getTopCustomers({ ...filters, limit: 5 }),
        getCategoryBreakdown(),
        getGeographic({ ...filters, groupBy: 'state' }),
        getFilters()
      ]);

      setData({
        summary: summaryRes.data.data,
        trend: trendRes.data.data,
        products: productsRes.data.data,
        customers: customersRes.data.data,
        categories: catRes.data.data,
        geo: geoRes.data.data
      });
      setFilterOptions(filtersRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters, clear = false) => {
    if (clear) {
      setFilters({ startDate: '', endDate: '', salesperson: '', category: '', state: '' });
    } else {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  const formatNumber = (val) => new Intl.NumberFormat('en-IN').format(val || 0);

  if (loading && !data.summary) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Chart Configs
  const trendChartData = {
    labels: data.trend?.map(d => d._id) || [],
    datasets: [{
      label: 'Revenue',
      data: data.trend?.map(d => d.revenue) || [],
      borderColor: 'var(--primary-500)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const productsChartData = {
    labels: data.products?.map(d => d._id) || [],
    datasets: [{
      label: 'Revenue',
      data: data.products?.map(d => d.totalAmount) || [],
      backgroundColor: 'var(--primary-400)',
      borderRadius: 4
    }]
  };

  const catChartData = {
    labels: data.categories?.map(d => d._id) || [],
    datasets: [{
      data: data.categories?.map(d => d.totalAmount) || [],
      backgroundColor: [
        '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe',
        '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'
      ],
      borderWidth: 0
    }]
  };

  const geoChartData = {
    labels: data.geo?.map(d => d._id) || [],
    datasets: [{
      label: 'Revenue',
      data: data.geo?.map(d => d.totalRevenue) || [],
      backgroundColor: '#f59e0b',
      borderRadius: 4
    }]
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Key performance indicators and revenue analytics for Flexibond</p>
      </div>

      <FilterBar filters={filters} options={filterOptions} onFilterChange={handleFilterChange} />

      {data.summary && (
        <div className="kpi-grid">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(data.summary.totalRevenue)}
            icon={<FiDollarSign />}
            color="blue"
            trend={12.5}
            subtext="vs previous period"
          />
          <KPICard
            title="Total Orders"
            value={formatNumber(data.summary.totalOrders)}
            icon={<FiShoppingCart />}
            color="green"
          />
          <KPICard
            title="Avg Order Value"
            value={formatCurrency(data.summary.avgOrderValue)}
            icon={<FiTrendingUp />}
            color="orange"
          />
          <KPICard
            title="Unique Customers"
            value={formatNumber(data.summary.uniqueCustomers)}
            icon={<FiUsers />}
            color="red"
          />
          <KPICard
            title="Quantity Sold"
            value={formatNumber(data.summary.totalQty)}
            icon={<FiPackage />}
            color="blue"
          />
        </div>
      )}

      <div className="charts-grid">
        <ChartCard title="Revenue Trend" fullWidth>
          <Line data={trendChartData} options={{ maintainAspectRatio: false }} />
        </ChartCard>
        
        <ChartCard title="Top Products (Revenue)">
          <Bar 
            data={productsChartData} 
            options={{ 
              maintainAspectRatio: false,
              indexAxis: 'y', // Horizontal bar chart
              plugins: { legend: { display: false } }
            }} 
          />
        </ChartCard>

        <ChartCard title="Category Breakdown">
          <Doughnut 
            data={catChartData} 
            options={{ 
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: { legend: { position: 'right' } }
            }} 
          />
        </ChartCard>

        <ChartCard title="Revenue by State">
          <Bar 
            data={geoChartData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} 
          />
        </ChartCard>

        <div className="data-table-wrapper" style={{ gridColumn: '1 / -1' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Top Customers</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>City</th>
                <th>State</th>
                <th>Salesperson</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.customers?.map((cust, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{cust._id}</td>
                  <td>{cust.city}</td>
                  <td>{cust.state}</td>
                  <td>{cust.salesperson}</td>
                  <td>{cust.totalOrders}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(cust.totalRevenue)}</td>
                </tr>
              ))}
              {(!data.customers || data.customers.length === 0) && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>No customer data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
