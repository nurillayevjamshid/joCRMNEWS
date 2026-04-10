/**
 * KPI Service - Real-time calculations for dashboard metrics
 */

export interface KPIData {
  totalRevenue: number;
  activeCustomers: number;
  conversionRate: number;
  salesTarget: number;
  newLeads: number;
  wonDeals: number;
  lostDeals: number;
  avgDealValue: number;
  customerRetention: number;
  responseTime: number; // in hours
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  amount: string;
  avatar: string;
  createdAt?: any;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  spent: string;
  joined: string;
  avatar: string;
  createdAt?: any;
}

export interface Message {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
  createdAt?: any;
}

export const kpiService = {
  /**
   * Calculate KPI metrics from raw data
   */
  calculateKPIs(leads: Lead[], customers: Customer[], messages: Message[]): KPIData {
    // Parse amounts from strings like "$5,000" or "5000"
    const parseAmount = (amount: string): number => {
      const cleaned = amount.replace(/[$,]/g, '');
      return parseFloat(cleaned) || 0;
    };

    // Total Revenue from leads with "Won" status
    const wonLeads = leads.filter(l => l.status === 'Won');
    const totalRevenue = wonLeads.reduce((sum, lead) => sum + parseAmount(lead.amount), 0);

    // Active Customers
    const activeCustomers = customers.filter(c => c.status === 'Active' || c.status === 'Faol').length;

    // Conversion Rate: (Won deals / Total leads) * 100
    const totalLeads = leads.length || 1;
    const conversionRate = (wonLeads.length / totalLeads) * 100;

    // Sales Target: percentage of target achieved (mock calculation)
    const salesTarget = Math.min((totalRevenue / 150000) * 100, 100);

    // New Leads (created today or this week - mock)
    const newLeads = leads.filter(l => l.status === 'New').length;

    // Won Deals
    const wonDeals = wonLeads.length;

    // Lost Deals
    const lostDeals = leads.filter(l => l.status === 'Lost').length;

    // Average Deal Value
    const avgDealValue = wonDeals > 0 ? totalRevenue / wonDeals : 0;

    // Customer Retention: percentage of customers with status Active
    const customerRetention = activeCustomers > 0 ? (activeCustomers / customers.length) * 100 : 0;

    // Response Time: mock calculation based on message count
    const responseTime = messages.length > 0 ? Math.max(1, 24 - (messages.length / 10)) : 24;

    return {
      totalRevenue,
      activeCustomers,
      conversionRate,
      salesTarget,
      newLeads,
      wonDeals,
      lostDeals,
      avgDealValue,
      customerRetention,
      responseTime
    };
  },

  /**
   * Format currency
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },

  /**
   * Format percentage
   */
  formatPercentage(value: number): string {
    return `${Math.round(value * 10) / 10}%`;
  },

  /**
   * Calculate trend (mock - in production, compare with previous period)
   */
  calculateTrend(current: number, previous: number = 0): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  },

  /**
   * Get trend direction
   */
  getTrendDirection(trend: number): 'up' | 'down' | 'neutral' {
    if (trend > 0) return 'up';
    if (trend < 0) return 'down';
    return 'neutral';
  }
};
