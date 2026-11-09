import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  PhoneOff,
  MessageSquare,
  Paintbrush,
  Code2,
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Send,
  Timer,
  CheckCircle2,
  Trash2,
  Eraser,
  Download,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const LiveRoomPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeLiveRoomId, setActiveLiveRoomId, addXP } = useApp();

  // Media Controls State
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(true);

  // Active Tool Mode (Whiteboard vs Code Editor vs Notes)
  const [collabMode, setCollabMode] = useState<'whiteboard' | 'code' | 'notes'>('whiteboard');

  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      addXP(50, 'Completed Pomodoro Study Sprint');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Chat Messages State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; avatar: string; text: string; time: string }>>([
    {
      sender: 'Dr. Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      text: 'Welcome Alex! Today we are reviewing gradient descent and PyTorch tensor operations.',
      time: '18:30',
    },
    {
      sender: 'Alex Chen (You)',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Thanks Maya! I pulled up the whiteboard so we can sketch the computation graph first.',
      time: '18:31',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      sender: currentUser?.name || 'You',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setNewMessage('');

    // Simulated peer tutor response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'Dr. Maya Patel',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
          text: 'Notice how the loss backward pass calculates gradients automatically via autograd. Check out the Code Editor tab!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  // Whiteboard Canvas Logic
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#5865F2');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw initial sample diagram on canvas for realism
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Sample computation graph sketch
    ctx.beginPath();
    ctx.arc(120, 80, 30, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#8B5CF6';
    ctx.font = '12px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Input X', 100, 85);

    ctx.beginPath();
    ctx.moveTo(150, 80);
    ctx.lineTo(240, 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(270, 80, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText('Weights W', 242, 85);

    ctx.beginPath();
    ctx.moveTo(300, 80);
    ctx.lineTo(390, 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(420, 80, 30, 0, Math.PI * 2);
    ctx.strokeStyle = '#22D3EE';
    ctx.stroke();
    ctx.fillStyle = '#22D3EE';
    ctx.fillText('Loss: MSE', 395, 85);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
    ctx.lineWidth = isEraser ? 20 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Code Editor State
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'typescript' | 'javascript'>('python');
  const [codeContent, setCodeContent] = useState<string>(`import torch
import torch.nn as nn

# Linear Regression Model for Peer Session
class PeerModel(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(PeerModel, self).__init__()
        self.linear = nn.Linear(input_dim, output_dim)
        
    def forward(self, x):
        return self.linear(x)

# Initialize Model & Loss Criterion
model = PeerModel(input_dim=1, output_dim=1)
criterion = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

print("✓ Model initialized successfully!")
print("✓ Ready for training loop with Dr. Maya")
`);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  const handleRunCode = () => {
    setIsRunningCode(true);
    setTerminalOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      setTerminalOutput(`[Python 3.12 Runtime] Executing script...
Epoch [1/5], Loss: 0.8421
Epoch [2/5], Loss: 0.6120
Epoch [3/5], Loss: 0.4502
Epoch [4/5], Loss: 0.3201
Epoch [5/5], Loss: 0.2104
✓ Training step complete! Weights converged in 1.42s.`);
      addXP(40, 'Executed Collaborative Code');
    }, 900);
  };

  // Collaborative Markdown Notes State
  const [studyNotes, setStudyNotes] = useState<string>(`# Peer Study Session Notes: PyTorch & Linear Regression

**Participants:** Alex Chen, Dr. Maya Patel  
**Date:** Today  

### Key Takeaways:
1. **Tensors:** n-dimensional arrays with GPU acceleration and automatic gradient tracking.
2. **Autograd Engine:** When \`requires_grad=True\`, PyTorch dynamically records operations in a directed acyclic graph (DAG).
3. **Loss Function:** MSE = $\\frac{1}{n} \\sum (y_{pred} - y_{true})^2$.
4. **Learning Rate:** High $\\alpha$ causes divergence; optimal $\\alpha \\approx 0.01$.

### Action Items for Next Session:
- [x] Implement linear regression model class
- [ ] Connect custom dataset with DataLoader
- [ ] Evaluate model test accuracy`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Room Header Bar with Status & Room Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5865F2] to-[#8B5CF6] flex items-center justify-center text-white shadow-md">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-slate-900 dark:text-white">
                PyTorch & AI Peer Collaboration Suite
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                LIVE HD
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Room ID: <span className="font-mono text-slate-700 dark:text-slate-300">room-alpha-ml</span> • Partner: Dr. Maya Patel
            </p>
          </div>
        </div>

        {/* Pomodoro Timer Bar & Room Switcher */}
        <div className="flex items-center gap-3">
          {/* Pomodoro Timer Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Timer className="w-4 h-4 text-[#5865F2]" />
            <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
              {formatTimer(pomodoroSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-[#5865F2]"
              title={isTimerRunning ? 'Pause Study Timer' : 'Start Study Timer'}
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setPomodoroSeconds(25 * 60);
              }}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
              title="Reset to 25m"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => alert('Invite link copied to clipboard: https://skillsphere.org/live-room/room-alpha-ml')}
            className="px-3.5 py-2 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] dark:text-[#818CF8] text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Peer</span>
          </button>
        </div>
      </div>

      {/* 2. Main Video Feeds & Workspaces Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Video Previews & Real-Time Chat) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Video Grid (2 Peers: Tutor & Learner) */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Peer Tutor Video Feed */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                alt="Dr. Maya Patel"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Dr. Maya Patel (Tutor)</span>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px]">
                1080p • 60fps
              </div>
            </div>

            {/* Current User Video Feed */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
              {isVideoOn ? (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <VideoOff className="w-8 h-8" />
                  <span className="text-xs">Camera is Off</span>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold flex items-center gap-1.5">
                <span>Alex Chen (You)</span>
              </div>
              {!isMicOn && (
                <div className="absolute top-3 right-3 p-1.5 rounded-md bg-rose-500/80 text-white">
                  <MicOff className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>

          {/* Media Control Bar */}
          <div className="glass-card p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition-colors ${
                isMicOn
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  : 'bg-rose-500 text-white'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-xl transition-colors ${
                isVideoOn
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  : 'bg-rose-500 text-white'
              }`}
              title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-xl transition-colors ${
                isScreenSharing
                  ? 'bg-[#5865F2] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
              title="Toggle Screen Share"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to leave this live room?')) {
                  window.location.href = '/dashboard';
                }
              }}
              className="p-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors"
              title="Leave Room"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>

          {/* Live Session Chat Box */}
          <div className="glass-card rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                Session Chat
              </span>
              <span className="text-[10px] text-slate-400">2 active participants</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send message to study partner..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (Collaborative Whiteboard / Code Editor / Shared Notes) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Workspace Tabs */}
          <div className="flex items-center justify-between glass-card p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCollabMode('whiteboard')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  collabMode === 'whiteboard'
                    ? 'bg-[#5865F2] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Paintbrush className="w-4 h-4" />
                Live Whiteboard
              </button>

              <button
                onClick={() => setCollabMode('code')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  collabMode === 'code'
                    ? 'bg-[#5865F2] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-4 h-4" />
                Collaborative Code
              </button>

              <button
                onClick={() => setCollabMode('notes')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  collabMode === 'notes'
                    ? 'bg-[#5865F2] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                Shared Notes
              </button>
            </div>

            {/* Screen sharing banner if on */}
            {isScreenSharing && (
              <span className="text-xs font-bold text-[#5865F2] px-3 py-1 rounded-full bg-[#5865F2]/10 animate-pulse">
                Screen Streaming
              </span>
            )}
          </div>

          {/* TAB 1: WHITEBOARD CANVAS */}
          {collabMode === 'whiteboard' && (
            <div className="glass-card rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col flex-1 min-h-[520px] space-y-3">
              {/* Whiteboard Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                {/* Colors */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Color:
                  </span>
                  {['#5865F2', '#8B5CF6', '#22D3EE', '#10B981', '#F59E0B', '#EF4444', '#0F172A'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setBrushColor(color);
                          setIsEraser(false);
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          brushColor === color && !isEraser
                            ? 'scale-125 ring-2 ring-offset-2 ring-slate-400'
                            : 'hover:scale-110'
                        }`}
                        aria-label={`Color ${color}`}
                      />
                    )
                  )}
                </div>

                {/* Brush size & Eraser */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEraser(!isEraser)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isEraser
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    Eraser
                  </button>

                  <button
                    onClick={clearCanvas}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full block touch-none"
                />
                <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-md backdrop-blur-xs">
                  ✎ Interactive Real-Time Canvas • Both peers draw simultaneously
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE EDITOR & RUNNER */}
          {collabMode === 'code' && (
            <div className="glass-card rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col flex-1 min-h-[520px] space-y-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="python">Python 3.12 (PyTorch)</option>
                    <option value="typescript">TypeScript 5.0 (React)</option>
                    <option value="javascript">JavaScript (Node)</option>
                  </select>
                  <span className="text-[11px] text-slate-400">Live Peer Sync: Active 🟢</span>
                </div>

                <button
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isRunningCode ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>

              {/* Code TextArea */}
              <div className="flex-1 relative">
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="w-full h-72 font-mono text-xs p-4 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5865F2] leading-relaxed resize-none selection:bg-[#5865F2] selection:text-white"
                ></textarea>
              </div>

              {/* Terminal Output */}
              {terminalOutput && (
                <div className="rounded-2xl p-4 bg-black text-slate-300 font-mono text-xs border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] border-b border-slate-800 pb-1 mb-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Console Output</span>
                  </div>
                  <pre className="whitespace-pre-line text-emerald-400">{terminalOutput}</pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHARED STUDY NOTES */}
          {collabMode === 'notes' && (
            <div className="glass-card rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col flex-1 min-h-[520px] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#8B5CF6]" />
                  Markdown Session Summary
                </span>
                <button
                  onClick={() => alert('Notes exported to session-notes.md')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export MD
                </button>
              </div>

              <textarea
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                className="w-full flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] leading-relaxed resize-none"
              ></textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

