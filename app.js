const { useState } = React;

function AgentGPTApp() {
    const [task, setTask] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const breakDownTask = async (task, apiKey) => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a task planning assistant. Break down the task into clear, numbered steps. Respond in Hebrew."
                    },
                    {
                        role: "user",
                        content: `Break down this task into clear steps: ${task}`
                    }
                ]
            })
        });
        return await response.json();
    };

    const executeTask = async (task, apiKey) => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that executes tasks and provides detailed results in Hebrew."
                    },
                    {
                        role: "user",
                        content: `Execute this task and provide detailed results: ${task}`
                    }
                ]
            })
        });
        return await response.json();
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            // Step 1: Break down the task
            const breakdownResult = await breakDownTask(task, apiKey);
            if (breakdownResult.error) {
                throw new Error(breakdownResult.error.message);
            }

            // Step 2: Execute the task
            const executionResult = await executeTask(task, apiKey);
            if (executionResult.error) {
                throw new Error(executionResult.error.message);
            }

            setResults({
                breakdown: breakdownResult.choices[0].message.content,
                execution: executionResult.choices[0].message.content
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-6">AgentGPT ממשק</h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="הכנס את מפתח ה-API שלך"
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">המשימה שלך</label>
                        <textarea
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="תאר את המשימה שברצונך שה-AI יבצע"
                            className="w-full p-3 border rounded-lg shadow-sm h-32"
                        />
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading || !task || !apiKey}
                        className={`w-full p-3 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium transition duration-200`}
                    >
                        {loading ? 'מבצע משימה...' : 'התחל משימה'}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                            <p className="font-medium">שגיאה:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {results && (
                        <div className="mt-6 space-y-6">
                            <div>
                                <h3 className="text-xl font-medium mb-3">פירוק המשימה:</h3>
                                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                    {results.breakdown}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-medium mb-3">תוצאות הביצוע:</h3>
                                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                    {results.execution}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
                טיפ: שמור על מפתח ה-API שלך בסודיות ואל תשתף אותו עם אף אחד
            </div>
        </div>
    );
}

ReactDOM.render(<AgentGPTApp />, document.getElementById('root'));
