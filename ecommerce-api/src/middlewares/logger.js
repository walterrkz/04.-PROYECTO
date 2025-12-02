const logger = (req, res, next) => {
  const dateTime = new Date().toISOString();
  const ua = req.get('user-agent') || '-';
  const ip = req.ip || req.connection?.remoteAddress || '-';
  console.log(`${dateTime} | ${req.method} ${req.url} | UA: ${ua} | IP: ${ip}`);
  next();
};
export default logger;