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
                        content: "You are a task planning assistant. Break down the task into clear, numbered steps."
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
                        content: "You are a helpful assistant that executes tasks and provides detailed results."
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
            const breakdownResult = await breakDownTask(task, apiKey);
            if (breakdownResult.error) {
                throw new Error(breakdownResult.error.message);
            }

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
        <div className="min-h-screen">
            <div className="container mx-auto p-4 max-w-3xl">
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-center mb-8 text-green-400">AgentGPT</h1>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">OpenAI API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                            className="w-full p-4 rounded-md chatgpt-input text-white placeholder-gray-500"
                        />
                    </div>
                    
                    <div className="relative">
                        <textarea
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Describe your task..."
                            className="w-full p-4 pr-20 rounded-lg chatgpt-input text-white placeholder-gray-500 h-32"
                        />
                        <button 
                            onClick={handleSubmit}
                            disabled={loading || !task || !apiKey}
                            className={`absolute right-2 bottom-2 p-2 rounded-md ${
                                loading || !task || !apiKey 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'
                            } text-white transition-colors duration-200`}
                        >
                            {loading ? 'Processing...' : '▶'}
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-900/30 text-red-400 rounded-md border border-red-800">
                            <p className="font-medium">Error:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {results && (
                        <div className="space-y-6">
                            <div className="result-block rounded-lg p-6">
                                <h3 className="text-lg font-medium mb-3 text-green-400">Task Breakdown:</h3>
                                <div className="whitespace-pre-wrap text-gray-300">
                                    {results.breakdown}
                                </div>
                            </div>
                            
                            <div className="result-block rounded-lg p-6">
                                <h3 className="text-lg font-medium mb-3 text-green-400">Execution Results:</h3>
                                <div className="whitespace-pre-wrap text-gray-300">
                                    {results.execution}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Keep your API key secure • Never share it with others
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<AgentGPTApp />, document.getElementById('root'));
