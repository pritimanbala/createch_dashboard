import { useState } from "react";
import { useParams } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Send, Zap, AlertTriangle, CheckCircle, ThermometerSun, Activity } from "lucide-react";

const timelineData = [
  { time: "0h", temp: 20, maturity: 0, strength: 0 },
  { time: "2h", temp: 22, maturity: 44, strength: 1.2 },
  { time: "4h", temp: 55, maturity: 154, strength: 4.8 },
  { time: "6h", temp: 65, maturity: 404, strength: 10.2 },
  { time: "6.5h", temp: 65, maturity: 437, strength: 12.8 },
  { time: "8h", temp: 58, maturity: 530, strength: 14.2 },
  { time: "10h", temp: 42, maturity: 630, strength: 15.1 },
  { time: "12h", temp: 28, maturity: 710, strength: 15.6 },
];

const chatHistory = [
  {
    role: "ai",
    message: "Process #23 on track. Current optimization: safe to demould at 14:45 (15.1MPa predicted strength).",
    timestamp: "13:42"
  },
  {
    role: "user",
    message: "Can I speed up without risk?",
    timestamp: "13:45"
  },
  {
    role: "ai",
    message: "✅ YES: Reduce hold time by 30min → Demould at 14:15, still achieving 15.2MPa safely.\n\n⚠️ NO: Peak >75°C risks thermal cracking in current 85% RH environment.\n\nRecommendation: Reduce hold time as suggested for -9% energy with zero risk.",
    timestamp: "13:45"
  },
];

export function ProcessDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState(chatHistory);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setChats([...chats, {
      role: "user",
      message,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setTimeout(() => {
      setChats(prev => [...prev, {
        role: "ai",
        message: "Based on current conditions, that adjustment is feasible. I'll update the optimization model and notify you of any impacts.",
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
    
    setMessage("");
  };

  return (
    <div className="flex h-full">
      {/* Main Content - 70% */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Process #{id}: Metro Pier Cap</h1>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-semibold">On Track - Safe</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>M50 Grade</span>
            <span>•</span>
            <span>Mould #12</span>
            <span>•</span>
            <span>Chamber #4</span>
            <span>•</span>
            <span>Crane #2</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Current Strength</div>
            <div className="text-2xl font-bold text-gray-900">13.2 MPa</div>
            <div className="text-xs text-green-600 mt-1">Target: 15.0 MPa</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Energy Used</div>
            <div className="text-2xl font-bold text-gray-900">42 kWh</div>
            <div className="text-xs text-blue-600 mt-1">-9% vs baseline</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">CO₂ Footprint</div>
            <div className="text-2xl font-bold text-gray-900">26 kg</div>
            <div className="text-xs text-green-600 mt-1">-12% vs baseline</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Demould ETA</div>
            <div className="text-2xl font-bold text-gray-900">14:45</div>
            <div className="text-xs text-gray-600 mt-1">In 1h 13m</div>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Process Timeline</h2>
          <div className="flex gap-2 mb-6">
            {[
              { stage: "Prep", time: "1.2h", status: "complete" },
              { stage: "Cast", time: "0.8h", status: "complete" },
              { stage: "Cure", time: "6h32m", status: "active" },
              { stage: "Demould", time: "0.5h", status: "pending" },
              { stage: "Reset", time: "0.3h", status: "pending" },
            ].map((stage, idx) => (
              <div key={idx} className="flex-1">
                <div className={`rounded-lg p-3 text-center ${
                  stage.status === 'complete' ? 'bg-green-100 border-2 border-green-500' :
                  stage.status === 'active' ? 'bg-blue-100 border-2 border-blue-500' :
                  'bg-gray-100 border-2 border-gray-300'
                }`}>
                  <div className="font-semibold text-gray-900">{stage.stage}</div>
                  <div className="text-sm text-gray-600 mt-1">{stage.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Temperature & Strength Charts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ThermometerSun className="text-[#005EB8]" />
            Temperature vs Strength Prediction
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Strength (MPa)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#FDB813" strokeWidth={2} name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="strength" stroke="#005EB8" strokeWidth={2} name="Strength (MPa)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maturity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-green-600" />
            Maturity Index Progress
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="maturity" stroke="#10b981" fill="#10b98133" name="Maturity (°C·h)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Current AI Optimization */}
        <div className="bg-gradient-to-r from-[#005EB8] to-blue-600 rounded-xl p-6 mt-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <Zap size={32} className="text-[#FDB813]" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Active AI Optimization</h3>
              <p className="text-blue-100">
                Reduce hold time by 45 minutes to save <strong className="text-[#FDB813]">12% energy</strong> while maintaining safe strength target. 
                Demould time moved from 15:30 to 14:45 with zero risk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Sidebar - 30% */}
      <div className="w-[30%] bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🤖 Live AI Assistant
          </h2>
          <p className="text-sm text-gray-600 mt-1">Ask anything about this process</p>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {chats.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${
                chat.role === 'user' 
                  ? 'bg-[#005EB8] text-white' 
                  : 'bg-gray-100 text-gray-900 border border-gray-200'
              } rounded-xl p-4`}>
                <div className="text-sm whitespace-pre-line">{chat.message}</div>
                <div className={`text-xs mt-2 ${chat.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {chat.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about optimization..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
            />
            <button 
              onClick={handleSend}
              className="bg-[#005EB8] text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
