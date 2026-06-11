function errorHandler(err, req, res, next) {
  console.error('❌', err.message);

  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: `A record with this ${err.meta?.target?.join(', ')} already exists.` });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }

  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
