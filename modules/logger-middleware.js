function getMiddleware(options) {
  const enable = options ? !!options.enable : false;
  return (req, res, next) => {
    if (enable) {
      const startetAt = process.hrtime();
      res.on('finish', () => {
        const [sec, nanosec] = process.hrtime(startetAt);
        const ms = (1000 * sec) + (nanosec / 1e6); // Convert to ms
        const duration = ms.toFixed(1).padStart(5, ' ');
        const method = req.method.padEnd(4, ' ');
        const code = res.statusCode;
        const url = req.originalUrl;
        console.log(`${duration} ms: ${method} ${code} ${url}`);
      });
    }
    next();
  };
}

export default getMiddleware;
