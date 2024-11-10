const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
  
    // For APIs
    if (req.originalUrl.startsWith('/api')) {
      res.json({
        error: {
          message: err.message,
        },
      });
    } else {
      // For Web Pages - Render an error page
      res.render('error', { title: 'Error', message: err.message });
    }
  };
  
  module.exports = errorHandler;
  