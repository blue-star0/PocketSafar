import React, { useEffect, useState, createContext, useContext } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const processSession = async (sessionId) => {
    try {
      const response = await axios.post(`${API}/auth/session`, {}, {
        headers: { 'X-Session-ID': sessionId },
        withCredentials: true
      });
      setUser(response.data.user);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    } catch (error) {
      console.error('Session processing error:', error);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, processSession, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Landing Page Component
const LandingPage = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6 animate-pulse">
            🎒 POCKET<span className="text-yellow-400">SAFAR</span>
          </h1>
          <p className="text-2xl mb-8 opacity-90">
            Your AI-Powered Travel Companion for Incredible India
          </p>
          <p className="text-lg mb-12 max-w-3xl mx-auto opacity-80">
            Share your travel experiences with the government, earn rewards, and get personalized AI travel guidance. 
            Help improve India's infrastructure while planning your perfect journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Travel Diary</h3>
              <p className="opacity-80">Record your journeys and share valuable feedback</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Travel Guide</h3>
              <p className="opacity-80">Get personalized recommendations powered by GPT-5</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Rewards System</h3>
              <p className="opacity-80">Earn points and badges for discounts on transport</p>
            </div>
          </div>

          <button
            onClick={login}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
          >
            🚀 Start Your Journey with Google
          </button>
        </div>
      </div>
    </div>
  );
};

// Consent Form Component
const ConsentForm = ({ onConsentSubmit }) => {
  const [consent, setConsent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (consent === null) return;
    
    setSubmitting(true);
    try {
      await axios.post(`${API}/consent`, 
        { consent_given: consent }, 
        { withCredentials: true }
      );
      onConsentSubmit(consent);
    } catch (error) {
      console.error('Consent submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Data Sharing Consent</h2>
          <p className="text-gray-600">
            Help improve India's travel infrastructure by sharing your travel data with the government
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">What happens when you consent?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <p className="font-medium">Earn Rewards</p>
                <p className="text-sm text-gray-600">Get points and badges for sharing</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <p className="font-medium">Transport Discounts</p>
                <p className="text-sm text-gray-600">Save on trains, flights, and tolls</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <p className="font-medium">Improve Infrastructure</p>
                <p className="text-sm text-gray-600">Help government plan better</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <p className="font-medium">Data Transparency</p>
                <p className="text-sm text-gray-600">See who uses your data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-yellow-800">If you choose "No":</h3>
          <p className="text-gray-600">
            You can still use PocketSafar as your personal travel diary and AI guide, 
            but rewards and government benefits will not be available.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="consent-yes"
              name="consent"
              value={true}
              onChange={() => setConsent(true)}
              className="w-5 h-5"
            />
            <label htmlFor="consent-yes" className="text-lg">
              Yes, I consent to share my travel data with the government
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="consent-no"
              name="consent"
              value={false}
              onChange={() => setConsent(false)}
              className="w-5 h-5"
            />
            <label htmlFor="consent-no" className="text-lg">
              No, I want to use PocketSafar privately
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={consent === null || submitting}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-300"
        >
          {submitting ? 'Submitting...' : 'Continue to Dashboard'}
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('diary');
  const [travelEntries, setTravelEntries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Travel Entry Form State
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    transportation_rating: '',
    infrastructure_rating: '',
    review: ''
  });

  // Expense Form State
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'transport',
    date: ''
  });

  // AI Guide State
  const [aiInput, setAiInput] = useState('');
  const [aiLocation, setAiLocation] = useState('');

  // Budget Calculator State
  const [budgetCalc, setBudgetCalc] = useState({
    budget: '',
    duration_days: '',
    location: ''
  });
  const [budgetResult, setBudgetResult] = useState(null);

  useEffect(() => {
    fetchTravelEntries();
    fetchExpenses();
  }, []);

  const fetchTravelEntries = async () => {
    try {
      const response = await axios.get(`${API}/travel-entries`, { withCredentials: true });
      setTravelEntries(response.data);
    } catch (error) {
      console.error('Error fetching travel entries:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        axios.get(`${API}/expenses`, { withCredentials: true }),
        axios.get(`${API}/expenses/summary`, { withCredentials: true })
      ]);
      setExpenses(expensesRes.data);
      setExpenseSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/travel-entries`, newEntry, { withCredentials: true });
      setNewEntry({
        title: '',
        description: '',
        location: '',
        date: '',
        transportation_rating: '',
        infrastructure_rating: '',
        review: ''
      });
      fetchTravelEntries();
    } catch (error) {
      console.error('Error creating travel entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/expenses`, {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      }, { withCredentials: true });
      setNewExpense({
        description: '',
        amount: '',
        category: 'transport',
        date: ''
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiGuide = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    setLoading(true);
    try {
      const userMessage = { role: 'user', content: aiInput };
      setAiMessages(prev => [...prev, userMessage]);
      
      const response = await axios.post(`${API}/ai-guide`, {
        message: aiInput,
        location: aiLocation
      }, { withCredentials: true });
      
      const aiMessage = { role: 'assistant', content: response.data.response };
      setAiMessages(prev => [...prev, aiMessage]);
      setAiInput('');
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetCalculation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/calculate-trip-cost`, {
        budget: parseFloat(budgetCalc.budget),
        duration_days: parseInt(budgetCalc.duration_days),
        location: budgetCalc.location
      }, { withCredentials: true });
      setBudgetResult(response.data);
    } catch (error) {
      console.error('Error calculating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">
              🎒 POCKET<span className="text-yellow-500">SAFAR</span>
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <img src={user?.picture} alt="Profile" className="w-8 h-8 rounded-full" />
              <span>Welcome, {user?.name}!</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.rewards_enabled && (
              <div className="flex items-center space-x-4 bg-yellow-100 px-4 py-2 rounded-lg">
                <span className="text-yellow-800 font-medium">
                  🏆 {user.total_points} Points
                </span>
                <span className="text-yellow-800">
                  🎖️ {user.badges?.length || 0} Badges
                </span>
              </div>
            )}
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton tab="diary" label="Travel Diary" icon="📝" />
          <TabButton tab="guide" label="AI Guide" icon="🤖" />
          <TabButton tab="expenses" label="Expenses" icon="💰" />
          <TabButton tab="calculator" label="Trip Calculator" icon="🧮" />
          {user?.rewards_enabled && (
            <TabButton tab="rewards" label="Rewards" icon="🏆" />
          )}
        </div>

        {/* Travel Diary Tab */}
        {activeTab === 'diary' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">✍️ Add New Journey</h2>
              <form onSubmit={handleCreateEntry} className="space-y-4">
                <input
                  type="text"
                  placeholder="Journey Title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Describe your experience..."
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  className="w-full p-3 border rounded-lg h-24"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newEntry.location}
                  onChange={(e) => setNewEntry({...newEntry, location: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transportation Rating</label>
                    <select
                      value={newEntry.transportation_rating}
                      onChange={(e) => setNewEntry({...newEntry, transportation_rating: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Select Rating</option>
                      {[1,2,3,4,5].map(i => <option key={i} value={i}>{i} Star{i > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Infrastructure Rating</label>
                    <select
                      value={newEntry.infrastructure_rating}
                      onChange={(e) => setNewEntry({...newEntry, infrastructure_rating: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Select Rating</option>
                      {[1,2,3,4,5].map(i => <option key={i} value={i}>{i} Star{i > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
                <textarea
                  placeholder="Additional review for government feedback..."
                  value={newEntry.review}
                  onChange={(e) => setNewEntry({...newEntry, review: e.target.value})}
                  className="w-full p-3 border rounded-lg h-20"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg"
                >
                  {loading ? 'Saving...' : '📝 Save Journey'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">📖 Your Travel Stories</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {travelEntries.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold">{entry.title}</h3>
                    <p className="text-sm text-gray-600">{entry.location} • {entry.date}</p>
                    <p className="text-sm mt-1">{entry.description}</p>
                    {(entry.transportation_rating || entry.infrastructure_rating) && (
                      <div className="flex space-x-4 mt-2 text-sm">
                        {entry.transportation_rating && (
                          <span>🚗 Transport: {entry.transportation_rating}⭐</span>
                        )}
                        {entry.infrastructure_rating && (
                          <span>🏗️ Infrastructure: {entry.infrastructure_rating}⭐</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {travelEntries.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No travel entries yet. Start documenting your journeys! ✨
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Guide Tab */}
        {activeTab === 'guide' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">🤖 AI Travel Guide (Powered by GPT-5)</h2>
            
            <form onSubmit={handleAiGuide} className="mb-6">
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Where are you planning to visit? (optional)"
                  value={aiLocation}
                  onChange={(e) => setAiLocation(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                />
              </div>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Ask me anything about travel in India..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg"
                >
                  {loading ? '🤔' : '🚀'}
                </button>
              </div>
            </form>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {aiMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-100 ml-8'
                      : 'bg-gray-100 mr-8'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {message.role === 'user' ? '👤 You' : '🤖 AI Guide'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
              {aiMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p>Ask me anything about travel in India!</p>
                  <p className="text-sm mt-2">
                    I can help with destinations, food, culture, transportation, and budget planning.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">💰 Add Expense</h2>
              <form onSubmit={handleCreateExpense} className="space-y-4">
                <input
                  type="text"
                  placeholder="Expense Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount (₹)"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="transport">🚗 Transport</option>
                  <option value="accommodation">🏨 Accommodation</option>
                  <option value="food">🍽️ Food & Dining</option>
                  <option value="activities">🎯 Activities & Tours</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="other">📝 Other</option>
                </select>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg"
                >
                  {loading ? 'Adding...' : '💰 Add Expense'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              {/* Expense Summary */}
              {expenseSummary && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">📊 Expense Summary</h2>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    Total: ₹{expenseSummary.total_spent?.toFixed(2)}
                  </div>
                  <div className="space-y-2">
                    {expenseSummary.categories?.map((cat) => (
                      <div key={cat._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="capitalize">{cat._id}</span>
                        <span className="font-semibold">₹{cat.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Expenses */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">📝 Recent Expenses</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {expenses.slice(0, 10).map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 border-l-4 border-green-500 bg-gray-50">
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-gray-600">{expense.category} • {expense.date}</div>
                      </div>
                      <div className="font-bold text-green-600">₹{expense.amount}</div>
                    </div>
                  ))}
                  {expenses.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trip Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">🧮 Trip Cost Calculator</h2>
              <form onSubmit={handleBudgetCalculation} className="space-y-4">
                <input
                  type="number"
                  placeholder="Total Budget (₹)"
                  value={budgetCalc.budget}
                  onChange={(e) => setBudgetCalc({...budgetCalc, budget: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Trip Duration (days)"
                  value={budgetCalc.duration_days}
                  onChange={(e) => setBudgetCalc({...budgetCalc, duration_days: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Destination"
                  value={budgetCalc.location}
                  onChange={(e) => setBudgetCalc({...budgetCalc, location: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg"
                >
                  {loading ? 'Calculating...' : '🧮 Calculate Trip Cost'}
                </button>
              </form>
            </div>

            {budgetResult && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">📋 Budget Breakdown</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">Trip Summary</h3>
                    <p><strong>Destination:</strong> {budgetResult.location}</p>
                    <p><strong>Duration:</strong> {budgetResult.duration_days} days</p>
                    <p><strong>Total Budget:</strong> ₹{budgetResult.total_budget}</p>
                    <p><strong>Daily Budget:</strong> ₹{budgetResult.daily_budget?.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">AI Recommendations</h3>
                    <div className="whitespace-pre-wrap text-sm">
                      {budgetResult.ai_recommendations}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && user?.rewards_enabled && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">🏆 Your Rewards</h2>
              <div className="text-center">
                <div className="text-6xl mb-4">🎖️</div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {user.total_points} Points
                </div>
                <p className="text-gray-600 mb-6">
                  Earned from sharing travel experiences
                </p>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Point Values</h3>
                  <div className="text-sm space-y-1">
                    <p>✍️ Travel diary entry: 50 points</p>
                    <p>🎯 First-time consent: 100 points</p>
                    <p>⭐ Rating transport/infrastructure: 25 points</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">🎖️ Your Badges</h2>
              <div className="grid grid-cols-2 gap-4">
                {user.badges?.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-white">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="font-semibold text-sm">{badge}</div>
                  </div>
                ))}
                {(!user.badges || user.badges.length === 0) && (
                  <div className="col-span-2 text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🎯</div>
                    <p>Start sharing your travels to earn badges!</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Available Benefits</h3>
                <div className="text-sm space-y-1">
                  <p>🚅 Train booking discounts</p>
                  <p>✈️ Flight ticket offers</p>
                  <p>🛣️ Toll road discounts</p>
                  <p>🚌 Public transport benefits</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Session Processing Component
const SessionProcessor = () => {
  const { processSession } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleSession = async () => {
      const fragment = window.location.hash;
      if (fragment.includes('session_id=')) {
        const sessionId = fragment.split('session_id=')[1].split('&')[0];
        const success = await processSession(sessionId);
        if (success) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        setProcessing(false);
      }
    };

    handleSession();
  }, [processSession]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">⚡</div>
          <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
          <p>Please wait while we set up your account</p>
        </div>
      </div>
    );
  }

  return null;
};

// Main App Component
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <SessionProcessor />
        <AppContent currentPath={currentPath} />
      </div>
    </AuthProvider>
  );
}

const AppContent = ({ currentPath }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🎒</div>
          <p>Loading PocketSafar...</p>
        </div>
      </div>
    );
  }

  if (currentPath === '/dashboard') {
    if (!user) {
      window.location.href = '/';
      return null;
    }

    // Check if user needs to complete consent
    if (user.consent_given === undefined || user.consent_given === null) {
      return <ConsentForm onConsentSubmit={() => window.location.reload()} />;
    }

    return <Dashboard />;
  }

  // Default to landing page
  if (user && currentPath === '/') {
    window.location.href = '/dashboard';
    return null;
  }

  return <LandingPage />;
};

export default App;