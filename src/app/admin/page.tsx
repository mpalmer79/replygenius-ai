'use client';

import { useState } from 'react';

// Mock data for demonstration
const mockStats = {
  totalClients: 47,
  activeTrials: 12,
  openLeads: 34,
  openTickets: 8,
  mrr: 18400,
  conversionRate: 32,
};

const mockLeads = [
  { id: 1, business: 'Oceanside Dental', contact: 'Dr. Sarah Chen', email: 'sarah@oceansidedental.com', phone: '(555) 123-4567', source: 'Website Chat', status: 'hot', score: 92, lastContact: '2 hours ago', notes: 'Very interested, has 3 locations' },
  { id: 2, business: 'Metro Auto Group', contact: 'James Wilson', email: 'jwilson@metroauto.com', phone: '(555) 234-5678', source: 'Assessment Form', status: 'warm', score: 78, lastContact: '1 day ago', notes: 'Requested demo for next week' },
  { id: 3, business: 'Bella Spa & Wellness', contact: 'Maria Rodriguez', email: 'maria@bellaspa.com', phone: '(555) 345-6789', source: 'Google Ads', status: 'warm', score: 65, lastContact: '3 days ago', notes: 'Comparing with competitors' },
  { id: 4, business: 'Summit Law Firm', contact: 'Michael Brown', email: 'mbrown@summitlaw.com', phone: '(555) 456-7890', source: 'Referral', status: 'cold', score: 45, lastContact: '1 week ago', notes: 'Budget concerns, follow up Q2' },
  { id: 5, business: 'Fresh Bites Cafe', contact: 'Amy Lin', email: 'amy@freshbites.com', phone: '(555) 567-8901', source: 'Website Chat', status: 'hot', score: 88, lastContact: '4 hours ago', notes: 'Ready to start trial today' },
];

const mockClients = [
  { id: 1, business: 'Harbor View Hotel', plan: 'Enterprise', locations: 8, reviewsThisMonth: 342, responseRate: 98, health: 'excellent', mrr: 800, since: 'Oct 2025' },
  { id: 2, business: 'City Dental Partners', plan: 'Growth', locations: 3, reviewsThisMonth: 89, responseRate: 100, health: 'excellent', mrr: 400, since: 'Nov 2025' },
  { id: 3, business: 'Premier Auto Spa', plan: 'Starter', locations: 1, reviewsThisMonth: 45, responseRate: 94, health: 'good', mrr: 200, since: 'Dec 2025' },
  { id: 4, business: 'Green Leaf Yoga', plan: 'Starter', locations: 1, reviewsThisMonth: 28, responseRate: 86, health: 'at-risk', mrr: 200, since: 'Dec 2025' },
  { id: 5, business: 'Sunrise Bakery', plan: 'Growth', locations: 2, reviewsThisMonth: 67, responseRate: 100, health: 'excellent', mrr: 400, since: 'Sep 2025' },
];

const mockTickets = [
  { id: 'TKT-001', client: 'Harbor View Hotel', subject: 'Google connection disconnected', priority: 'high', status: 'open', created: '2 hours ago', assignee: 'Support Team' },
  { id: 'TKT-002', client: 'City Dental Partners', subject: 'Request to add 4th location', priority: 'medium', status: 'open', created: '5 hours ago', assignee: 'Sales Team' },
  { id: 'TKT-003', client: 'Premier Auto Spa', subject: 'Billing question', priority: 'low', status: 'open', created: '1 day ago', assignee: 'Billing' },
  { id: 'TKT-004', client: 'Green Leaf Yoga', subject: 'AI responses too formal', priority: 'medium', status: 'in-progress', created: '2 days ago', assignee: 'Support Team' },
  { id: 'TKT-005', client: 'Sunrise Bakery', subject: 'Feature request: Yelp integration', priority: 'low', status: 'open', created: '3 days ago', assignee: 'Product' },
];

const mockTrials = [
  { id: 1, business: 'Mountain View Chiro', contact: 'Dr. Kevin Park', email: 'kevin@mvchiro.com', daysLeft: 12, engagement: 'high', reviewsGenerated: 23 },
  { id: 2, business: 'Coastal Realty', contact: 'Jessica Adams', email: 'jadams@coastalrealty.com', daysLeft: 8, engagement: 'medium', reviewsGenerated: 11 },
  { id: 3, business: 'Paws & Claws Vet', contact: 'Dr. Lisa Morgan', email: 'lisa@pawsclaws.com', daysLeft: 3, engagement: 'low', reviewsGenerated: 2 },
  { id: 4, business: 'Elite Fitness Gym', contact: 'Marcus Johnson', email: 'marcus@elitefitness.com', daysLeft: 10, engagement: 'high', reviewsGenerated: 34 },
];

type TabType = 'overview' | 'leads' | 'clients' | 'tickets' | 'trials';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [leadFilter, setLeadFilter] = useState('all');

  const filteredLeads = leadFilter === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.status === leadFilter);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <span className="text-lg font-bold">GraniteReply</span>
                <span className="ml-2 px-2 py-0.5 bg-amber-500 text-xs font-semibold rounded">ADMIN</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                  MP
                </div>
                <span className="text-sm">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'leads', label: 'Leads', icon: '🎯', count: mockStats.openLeads },
              { id: 'clients', label: 'Clients', icon: '👥', count: mockStats.totalClients },
              { id: 'tickets', label: 'Support', icon: '🎫', count: mockStats.openTickets },
              { id: 'trials', label: 'Active Trials', icon: '⏱️', count: mockStats.activeTrials },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${mockStats.mrr.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-green-600">↑ 12% from last month</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Clients</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalClients}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-green-600">↑ 5 new this month</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Open Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.openLeads}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">{mockLeads.filter(l => l.status === 'hot').length} hot leads</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.conversionRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-green-600">↑ 3% improvement</p>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hot Leads */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">🔥 Hot Leads</h2>
                </div>
                <div className="p-6 space-y-4">
                  {mockLeads.filter(l => l.status === 'hot').map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div>
                        <p className="font-medium text-gray-900">{lead.business}</p>
                        <p className="text-sm text-gray-500">{lead.contact} • {lead.lastContact}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Score: {lead.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgent Tickets */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">🚨 Urgent Tickets</h2>
                </div>
                <div className="p-6 space-y-4">
                  {mockTickets.filter(t => t.priority === 'high' || t.status === 'open').slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">{ticket.subject}</p>
                        <p className="text-sm text-gray-500">{ticket.client} • {ticket.created}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trials Expiring Soon */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">⏰ Trials Expiring Soon</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews Generated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockTrials.sort((a, b) => a.daysLeft - b.daysLeft).map((trial) => (
                      <tr key={trial.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{trial.business}</td>
                        <td className="px-6 py-4 text-gray-500">{trial.contact}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trial.daysLeft <= 3 ? 'bg-red-100 text-red-700' :
                            trial.daysLeft <= 7 ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {trial.daysLeft} days
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trial.engagement === 'high' ? 'bg-green-100 text-green-700' :
                            trial.engagement === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {trial.engagement}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{trial.reviewsGenerated}</td>
                        <td className="px-6 py-4">
                          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                            Contact →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
              <div className="flex items-center space-x-4">
                <select
                  value={leadFilter}
                  onChange={(e) => setLeadFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Leads</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                  + Add Lead
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{lead.business}</p>
                        <p className="text-sm text-gray-500">{lead.notes}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{lead.contact}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{lead.source}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'hot' ? 'bg-red-100 text-red-700' :
                          lead.status === 'warm' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                lead.score >= 80 ? 'bg-green-500' :
                                lead.score >= 60 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{lead.lastContact}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-primary-600" title="Email">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-primary-600" title="Call">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-primary-600" title="Notes">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                + Add Client
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews/Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{client.business}</p>
                        <p className="text-sm text-gray-500">Since {client.since}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                          client.plan === 'Growth' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {client.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{client.locations}</td>
                      <td className="px-6 py-4 text-gray-500">{client.reviewsThisMonth}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          client.responseRate >= 95 ? 'text-green-600' :
                          client.responseRate >= 80 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {client.responseRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.health === 'excellent' ? 'bg-green-100 text-green-700' :
                          client.health === 'good' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {client.health}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">${client.mrr}</td>
                      <td className="px-6 py-4">
                        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                + Create Ticket
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-gray-900">{ticket.id}</td>
                      <td className="px-6 py-4 text-gray-900">{ticket.client}</td>
                      <td className="px-6 py-4 text-gray-500">{ticket.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                          ticket.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{ticket.assignee}</td>
                      <td className="px-6 py-4 text-gray-500">{ticket.created}</td>
                      <td className="px-6 py-4">
                        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trials Tab */}
        {activeTab === 'trials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Active Trials</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Active Trials</p>
                <p className="text-2xl font-bold text-gray-900">{mockTrials.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">High Engagement</p>
                <p className="text-2xl font-bold text-green-600">{mockTrials.filter(t => t.engagement === 'high').length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Expiring in 3 Days</p>
                <p className="text-2xl font-bold text-red-600">{mockTrials.filter(t => t.daysLeft <= 3).length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Avg Reviews Generated</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(mockTrials.reduce((sum, t) => sum + t.reviewsGenerated, 0) / mockTrials.length)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockTrials.map((trial) => (
                    <tr key={trial.id} className={`hover:bg-gray-50 ${trial.daysLeft <= 3 ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 font-medium text-gray-900">{trial.business}</td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{trial.contact}</p>
                        <p className="text-sm text-gray-500">{trial.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trial.daysLeft <= 3 ? 'bg-red-100 text-red-700' :
                          trial.daysLeft <= 7 ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {trial.daysLeft} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trial.engagement === 'high' ? 'bg-green-100 text-green-700' :
                          trial.engagement === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {trial.engagement}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{trial.reviewsGenerated}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700">
                            Contact
                          </button>
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                            Convert
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
