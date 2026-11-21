module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  res.status(200).json({
    status: 'online',
    service: 'Sudharshan P S Portfolio Production Engine',
    version: '4.0.0',
    platform: 'Vercel Serverless',
    timestamp: new Date().toISOString()
  });
};
