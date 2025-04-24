import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Line, Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  RadarController,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState('latest');
  const [sortedReports, setSortedReports] = useState([]);
  const [comparisonDates, setComparisonDates] = useState({ first: null, second: null });
  const [showComparison, setShowComparison] = useState(false);
  const router = useRouter();

  const getSelectedReport = () => {
    if (!sortedReports.length) return null;
    if (selectedInterview === 'latest') {
      return sortedReports[sortedReports.length - 1];
    }
    return sortedReports[parseInt(selectedInterview)];
  };

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    const email = JSON.parse(user).email;
    setUserEmail(email);
    fetchReports(email);
  }, []);

  const fetchReports = async (email) => {
    if (!email) return;
    
    try {
      const response = await fetch(`/api/getAllReports?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setReports(data);
        // Sort reports by date and update sortedReports
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        setSortedReports(sorted);
      } else {
        setReports([]);
        setSortedReports([]);
        console.error('Expected array of reports but got:', typeof data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!Array.isArray(reports) || reports.length === 0) {
      return {
        scoreData: {
          labels: [],
          datasets: []
        },
        radarData: {
          labels: [],
          datasets: []
        },
        roleData: {
          labels: [],
          datasets: []
        }
      };
    }
    
    const labels = sortedReports.map(report => {
      const date = new Date(report.date).toLocaleDateString();
      return date;
    });

    // Define score categories and their colors
    const scoreCategories = [
      { key: 'technical_proficiency', label: 'Technical Proficiency', color: 'rgb(255, 99, 132)' },
      { key: 'communication', label: 'Communication', color: 'rgb(54, 162, 235)' },
      { key: 'decision_making', label: 'Decision Making', color: 'rgb(255, 206, 86)' },
      { key: 'confidence', label: 'Confidence', color: 'rgb(75, 192, 192)' },
      { key: 'language_fluency', label: 'Language Fluency', color: 'rgb(153, 102, 255)' }
    ];

    // Prepare line chart datasets for each score category
    const datasets = scoreCategories.map(category => ({
      label: category.label,
      data: sortedReports.map(report => (report.scores?.[category.key] || 0) * 1), // Keep as score out of 10
      borderColor: category.color,
      backgroundColor: category.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
      tension: 0.1
    }));

    // Prepare radar chart data for selected reports
    const radarData = {
      labels: scoreCategories.map(cat => cat.label),
      datasets: [getSelectedReport()].filter(Boolean).map((report, index) => {
          const hue = (index * 137.5) % 360;
          const color = `hsl(${hue}, 70%, 50%)`;
          const date = new Date(report.date).toLocaleDateString();
          
          return {
            label: `Interview ${sortedReports.findIndex(r => r.date === report.date) + 1} (${date})`,
            data: scoreCategories.map(cat => (report.scores?.[cat.key] || 0) * 1),
            backgroundColor: `hsla(${hue}, 70%, 50%, 0.2)`,
            borderColor: color,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: color
          };
        })
    };

    // Prepare role-based data
    const roles = [...new Set(reports.map(r => r.role))];
    const roleData = {
      labels: roles,
      datasets: [{
        label: 'Average Score by Role',
        data: roles.map(role => {
          const roleReports = reports.filter(r => r.role === role);
          const avgScore = roleReports.reduce((acc, curr) => acc + (curr.scores?.overall || 0), 0) / roleReports.length;
          return Math.round(avgScore); // Keep as score out of 50
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ]
      }]
    };

    return {
      scoreData: {
        labels,
        datasets
      },
      radarData,
      roleData
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading reports...</div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">My Interview Progress</h1>
          {userEmail && (
            <p className="text-center text-gray-600 mt-2">
              Showing progress for: <span className="font-semibold">{userEmail}</span>
            </p>
          )}
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detailed Score Progress</h2>
              <p className="text-sm text-gray-500 mt-1">Track your improvement in each skill area over time</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium text-gray-700">
                Last Interview: {reports.length > 0 ? new Date(reports[reports.length - 1].date).toLocaleDateString() : 'N/A'}
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-md text-xs font-medium text-blue-700">
                Total: {reports.length} Interviews
              </div>
            </div>
          </div>
          
          <div className="mb-5">
            <div className="grid grid-cols-5 gap-4 mb-4">
              {chartData.scoreData.datasets.map((dataset, index) => {
                const recentScore = dataset.data[dataset.data.length - 1] || 0;
                const previousScore = dataset.data.length > 1 ? dataset.data[dataset.data.length - 2] : recentScore;
                const improvement = recentScore - previousScore;
                const improvementPercent = previousScore ? (improvement / previousScore * 100).toFixed(1) : 0;
                
                return (
                  <div 
                    key={dataset.label} 
                    className="text-center p-3 rounded-lg border" 
                    style={{ borderColor: dataset.borderColor, backgroundColor: dataset.backgroundColor }}
                  >
                    <div className="text-xs uppercase tracking-wide font-semibold" style={{ color: dataset.borderColor }}>
                      {dataset.label}
                    </div>
                    <div className="text-2xl font-bold mt-1">{recentScore}/10</div>
                    <div className={`text-xs mt-1 ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {improvement > 0 ? '+' : ''}{improvement.toFixed(1)} 
                      ({improvement >= 0 ? '+' : ''}{improvementPercent}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Line 
            data={chartData.scoreData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                  ticks: {
                    callback: function(value) {
                      return value + '/10';
                    }
                  },
                  title: {
                    display: true,
                    text: 'Score (out of 10)'
                  }
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.raw}/10`;
                    },
                    title: function(tooltipItems) {
                      return `Interview: ${tooltipItems[0].label}`;
                    }
                  }
                },
                legend: {
                  position: 'bottom',
                  onClick: function() {}, // Disable hiding datasets on click
                  labels: {
                    boxWidth: 15,
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle'
                  }
                }
              },
              elements: {
                line: {
                  tension: 0.3,  // Smoother curves
                  borderWidth: 3
                },
                point: {
                  radius: 4,
                  hoverRadius: 6
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 md:col-span-1 transition-all duration-300 hover:shadow-xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Performance Analysis</h2>
              <div className="flex items-center gap-3">
                <select 
                  className="form-select rounded-md border-gray-300 shadow-sm text-sm py-1"
                  value={selectedInterview}
                  onChange={(e) => setSelectedInterview(e.target.value)}
                >
                  <option value="latest">Latest Interview</option>
                  {sortedReports.map((report, index) => (
                    <option key={report.date} value={index}>
                      Interview {index + 1} ({new Date(report.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="aspect-w-2 aspect-h-1 max-w-2xl mx-auto">
            <Radar
              data={chartData.radarData}
              options={{
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                      stepSize: 2,
                      callback: function(value) {
                        return value + '/10';
                      }
                    },
                    pointLabels: {
                      font: {
                        size: 12,
                        weight: 'bold'
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 10,
                      font: {
                        size: 11
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: 'All Interview Performances',
                    padding: {
                      bottom: 10
                    }
                  }
                },
                elements: {
                  line: {
                    borderWidth: 2
                  },
                  point: {
                    radius: 3,
                    hoverRadius: 5
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 md:col-span-1 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Score by Job Role</h2>
            <div className="text-sm text-gray-500">
              {reports.length} total interviews
            </div>
          </div>
          <Bar
            data={chartData.roleData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 50,
                  title: {
                    display: true,
                    text: 'Overall Interview Score'
                  },
                  ticks: {
                    callback: function(value) {
                      return value + '/50';
                    }
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Compare Interviews</h2>
              <p className="text-sm text-gray-500 mt-1">Select two interview dates to compare scores</p>
            </div>
            {showComparison && (
              <button
                onClick={() => {
                  setComparisonDates({ first: null, second: null });
                  setShowComparison(false);
                }}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                Clear Comparison
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Interview:</label>
              <select 
                className="w-full form-select rounded-md border-gray-300 shadow-sm"
                value={comparisonDates.first !== null ? comparisonDates.first : ''}
                onChange={(e) => {
                  const value = e.target.value !== '' ? parseInt(e.target.value) : null;
                  setComparisonDates(prev => ({ ...prev, first: value }));
                }}
              >
                <option value="">Select interview date...</option>
                {sortedReports.map((report, index) => (
                  <option key={`first-${report.date}`} value={index}>
                    Interview {index + 1} ({new Date(report.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Interview:</label>
              <select 
                className="w-full form-select rounded-md border-gray-300 shadow-sm"
                value={comparisonDates.second !== null ? comparisonDates.second : ''}
                onChange={(e) => {
                  const value = e.target.value !== '' ? parseInt(e.target.value) : null;
                  setComparisonDates(prev => ({ ...prev, second: value }));
                }}
              >
                <option value="">Select interview date...</option>
                {sortedReports.map((report, index) => (
                  <option key={`second-${report.date}`} value={index}>
                    Interview {index + 1} ({new Date(report.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  if (comparisonDates.first !== null && comparisonDates.second !== null) {
                    setShowComparison(true);
                  }
                }}
                disabled={comparisonDates.first === null || comparisonDates.second === null}
                className={`w-full px-4 py-2 rounded-md text-white font-medium ${comparisonDates.first !== null && comparisonDates.second !== null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} transition-colors`}
              >
                Compare Interviews
              </button>
            </div>
          </div>
          
          {showComparison && comparisonDates.first !== null && comparisonDates.second !== null && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Comparing Interview {comparisonDates.first + 1} vs Interview {comparisonDates.second + 1}
              </h3>
              
              <div className="grid grid-cols-5 gap-4 mb-6">
                {chartData.scoreData.datasets.map((dataset, i) => {
                  const firstScore = dataset.data[comparisonDates.first] || 0;
                  const secondScore = dataset.data[comparisonDates.second] || 0;
                  const difference = secondScore - firstScore;
                  const percentChange = firstScore ? (difference / firstScore * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={`comp-${dataset.label}`} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-center mb-2" style={{ color: dataset.borderColor }}>
                        {dataset.label}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">Interview {comparisonDates.first + 1}:</div>
                        <div className="font-bold">{firstScore}/10</div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">Interview {comparisonDates.second + 1}:</div>
                        <div className="font-bold">{secondScore}/10</div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">Change:</div>
                          <div className={`font-bold text-sm ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {difference > 0 ? '+' : ''}{difference.toFixed(1)} 
                            ({difference >= 0 ? '+' : ''}{percentChange}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">Overall Progress</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Interview {comparisonDates.first + 1} Overall Score:</div>
                    <div className="text-2xl font-bold">
                      {sortedReports[comparisonDates.first]?.scores?.overall || 0}/50
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Interview {comparisonDates.second + 1} Overall Score:</div>
                    <div className="text-2xl font-bold">
                      {sortedReports[comparisonDates.second]?.scores?.overall || 0}/50
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Detailed Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg transition-all duration-300 hover:shadow-md">
              <div className="text-lg font-semibold text-gray-700">Total Interviews</div>
              <div className="text-3xl text-blue-600 font-bold mt-2">{reports.length}</div>
              <div className="text-sm text-gray-500 mt-1">Completed Sessions</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg transition-all duration-300 hover:shadow-md">
              <div className="text-lg font-semibold text-gray-700">Overall Score</div>
              <div className="text-3xl text-green-600 font-bold mt-2">
                {reports.length > 0 ? ((reports.reduce((acc, curr) => acc + (curr.scores?.overall || 0), 0) / reports.length)).toFixed(1) : '0.0'}/50
              </div>
              <div className="text-sm text-gray-500 mt-1">Average Performance</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg transition-all duration-300 hover:shadow-md">
              <div className="text-lg font-semibold text-gray-700">Unique Roles</div>
              <div className="text-3xl text-purple-600 font-bold mt-2">
                {new Set(reports.map(r => r.role)).size}
              </div>
              <div className="text-sm text-gray-500 mt-1">Different Positions</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg transition-all duration-300 hover:shadow-md">
              <div className="text-lg font-semibold text-gray-700">Best Performance</div>
              <div className="text-3xl text-orange-600 font-bold mt-2">
                {reports.length > 0 ? Math.max(...reports.map(r => r.scores?.overall || 0)) : 0}/50
              </div>
              <div className="text-sm text-gray-500 mt-1">Highest Score</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
