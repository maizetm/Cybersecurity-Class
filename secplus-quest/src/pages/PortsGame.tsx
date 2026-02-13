import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../engine/GameContext';

interface PortPair {
  service: string;
  port: number;
}

const PORT_DATA: PortPair[] = [
  { service: 'FTP Data', port: 20 },
  { service: 'FTP Control', port: 21 },
  { service: 'SSH', port: 22 },
  { service: 'Telnet', port: 23 },
  { service: 'SMTP', port: 25 },
  { service: 'DNS', port: 53 },
  { service: 'DHCP Server', port: 67 },
  { service: 'TFTP', port: 69 },
  { service: 'HTTP', port: 80 },
  { service: 'Kerberos', port: 88 },
  { service: 'POP3', port: 110 },
  { service: 'NTP', port: 123 },
  { service: 'NetBIOS', port: 139 },
  { service: 'IMAP', port: 143 },
  { service: 'SNMP', port: 161 },
  { service: 'LDAP', port: 389 },
  { service: 'HTTPS', port: 443 },
  { service: 'SMTPS', port: 465 },
  { service: 'Syslog', port: 514 },
  { service: 'LDAPS', port: 636 },
  { service: 'FTPS', port: 990 },
  { service: 'IMAPS', port: 993 },
  { service: 'POP3S', port: 995 },
  { service: 'MS SQL', port: 1433 },
  { service: 'Oracle DB', port: 1521 },
  { service: 'MySQL', port: 3306 },
  { service: 'RDP', port: 3389 },
  { service: 'SIP', port: 5060 },
  { service: 'PostgreSQL', port: 5432 },
];

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

export default function PortsGame() {
  const { setPage } = useGame();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [currentPair, setCurrentPair] = useState<PortPair | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [pairs] = useState(() => shuffle(PORT_DATA));

  const setupRound = useCallback((idx: number) => {
    if (idx >= pairs.length) {
      setGameOver(true);
      return;
    }
    const pair = pairs[idx];
    setCurrentPair(pair);

    // Generate 3 wrong options + correct
    const wrongPorts = PORT_DATA
      .filter(p => p.port !== pair.port)
      .map(p => p.port);
    const shuffledWrong = shuffle(wrongPorts).slice(0, 3);
    setOptions(shuffle([pair.port, ...shuffledWrong]));
    setFeedback(null);
  }, [pairs]);

  useEffect(() => {
    setupRound(0);
  }, [setupRound]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  const handleAnswer = (port: number) => {
    if (feedback || gameOver || !currentPair) return;

    if (port === currentPair.port) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
      setWrong(w => w + 1);
    }

    setTimeout(() => {
      const next = round + 1;
      setRound(next);
      setupRound(next);
    }, 800);
  };

  if (gameOver) {
    return (
      <div className="p-6 animate-fade-in max-w-lg mx-auto text-center">
        <h2 className="text-xl font-bold text-cyber-green mb-4">Port Arcade Results</h2>
        <div className="text-5xl font-black text-cyber-blue mb-4 animate-count-up">{score}</div>
        <p className="text-gray-400 mb-2">Correct: {score} | Wrong: {wrong}</p>
        <p className="text-gray-400 mb-6">Matched {score} of {round} ports</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setPage('home')} className="px-6 py-2 bg-cyber-panel border border-cyber-border text-gray-300 rounded-lg cursor-pointer hover:border-gray-500">Home</button>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-cyber-green text-black font-bold rounded-lg cursor-pointer hover:opacity-90">Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in max-w-lg mx-auto">
      <button onClick={() => setPage('home')} className="text-gray-400 hover:text-white mb-4 cursor-pointer text-sm">← Back</button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-cyber-green">Port & Protocol Arcade</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-green-400">✓ {score}</span>
          <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400 animate-pulse-glow' : 'text-gray-400'}`}>{timeLeft}s</span>
        </div>
      </div>

      {currentPair && (
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-2">What port does this service use?</p>
          <div className="text-3xl font-bold text-cyber-blue py-4 px-6 bg-cyber-panel border border-cyber-border rounded-xl inline-block">
            {currentPair.service}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {options.map(port => (
          <button
            key={port}
            onClick={() => handleAnswer(port)}
            disabled={feedback !== null}
            className={`py-4 rounded-xl border text-xl font-mono font-bold transition-colors cursor-pointer disabled:cursor-default
              ${feedback === null ? 'border-cyber-border hover:border-cyber-blue/50 bg-cyber-panel' :
                port === currentPair?.port ? 'border-green-500 bg-green-500/10 text-green-400' :
                'border-cyber-border opacity-50'
              }`}
          >
            {port}
          </button>
        ))}
      </div>
    </div>
  );
}
