const os = require('os');

exports.getSystemStats = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  return {
    cpuLoad: parseFloat(os.loadavg()[0].toFixed(3)),
    cpuCount: os.cpus().length,
    totalMemory,
    freeMemory,
    usedMemory,
    memoryUsagePercent: parseFloat(((usedMemory / totalMemory) * 100).toFixed(1)),
    uptime: Math.floor(os.uptime()),
    platform: os.platform(),
    hostname: os.hostname(),
    arch: os.arch(),
    timestamp: new Date().toISOString(),
  };
};
